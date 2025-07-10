import ballerina/http;
import ballerina/io;
import ballerina/mime;
import ballerina/regex as re;
import ballerina/time;
import ballerinax/aws.s3;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;
configurable string bucketName = ?;

s3:ConnectionConfig amazonS3Config = {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
};

s3:Client s3Client = check new (amazonS3Config);

final readonly & map<string> imageTypes = {
    "png": "image/png",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "gif": "image/gif",
    "webp": "image/webp"
};

public type ImageUploadResult record {
    boolean success;
    string message;
    ImageData? data?;
};

public type ImageData record {
    string filename;
    string s3Path;
    string uploadedAt;
    string url;
};

public type ImageListResult record {
    boolean success;
    string? message?;
    ImageInfo[]? images?;
};

public type ImageInfo record {
    string name;
    string size;
    string lastModified;
    string url;
};

public function uploadImageToS3(http:Request req) returns ImageUploadResult|error {
    mime:Entity[]|http:ClientError bodyParts = req.getBodyParts();
    if bodyParts is error {
        return {success: false, message: "Error parsing multipart data"};
    }

    byte[] imageContent = [];
    string fileName = "";
    foreach mime:Entity part in bodyParts {
        mime:ContentDisposition contentDisposition = part.getContentDisposition();
        if contentDisposition.name == "image" {
            byte[]|error content = part.getByteArray();
            if content is byte[] {
                imageContent = content;
                fileName = contentDisposition.fileName is string ? contentDisposition.fileName : "image.jpg";
            }
        }
    }

    if imageContent.length() == 0 {
        return {success: false, message: "No image file found"};
    }

    string[] parts = re:split(fileName, "\\.");
    if parts.length() < 2 || !imageTypes.hasKey(parts[parts.length() - 1].toLowerAscii()) {
        return {success: false, message: "Invalid image type. Supported: png, jpg, jpeg, gif, webp"};
    }

    string uniqueFileName = time:utcNow().toString() + "_" + fileName;
    string s3ObjectPath = "uploads/" + uniqueFileName;

    error? uploadResult = s3Client->createObject(bucketName, s3ObjectPath, imageContent);
    if uploadResult is error {
        return {success: false, message: "Failed to upload image to S3: " + uploadResult.message()};
    }

    return {
        success: true,
        message: "Image uploaded successfully",
        data: {
            filename: uniqueFileName,
            s3Path: s3ObjectPath,
            uploadedAt: time:utcNow().toString(),
            url: string `https://${bucketName}.s3.${region}.amazonaws.com/${s3ObjectPath}`
        }
    };
}

public function listImagesFromS3() returns ImageListResult|error {
    s3:S3Object[]|error listResult = s3Client->listObjects(bucketName, prefix = "uploads/");
    if listResult is error {
        return {success: false, message: "Failed to list images: " + listResult.message()};
    }

    ImageInfo[] imageInfos = [];
    foreach s3:S3Object obj in listResult {
        string? objectNameOptional = obj.objectName;
        string? objectSizeOptional = obj.objectSize;
        string? lastModifiedOptional = obj.lastModified;

        string objectName = objectNameOptional ?: "unknown";
        string objectSize = objectSizeOptional ?: "0";
        string lastModified = lastModifiedOptional ?: "";

        ImageInfo imageInfo = {
            name: objectName,
            size: objectSize,
            lastModified: lastModified,
            url: string `https://${bucketName}.s3.${region}.amazonaws.com/${objectName}`
        };
        imageInfos.push(imageInfo);
    }

    return {
        success: true,
        images: imageInfos
    };
}

public function getImageFromS3(string filename) returns http:Response|error {
    http:Response response = new;
    response.setHeader("Access-Control-Allow-Origin", "*");

    stream<byte[], io:Error?>|error downloadResult = s3Client->getObject(bucketName, "uploads/" + filename);
    if downloadResult is error {
        response.statusCode = 404;
        response.setTextPayload("Image not found");
        return response;
    }

    byte[] imageContent = [];
    error? streamResult = downloadResult.forEach(function(byte[] chunk) {
        imageContent.push(...chunk);
    });

    if streamResult is error {
        response.statusCode = 500;
        response.setTextPayload("Error reading image");
        return response;
    }

    string[] parts = re:split(filename, "\\.");
    string extension = parts.length() > 1 ? parts[parts.length() - 1].toLowerAscii() : "jpg";
    response.setHeader("Content-Type", imageTypes[extension] ?: "image/jpeg");
    response.setBinaryPayload(imageContent);
    return response;
}
