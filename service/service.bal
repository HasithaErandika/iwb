import 'service.jobs;
import 'service.meetups;
import 'service.utils;

import ballerina/http;
import ballerina/log;
import ballerina/time;

configurable int port = 8080;

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000"],
        allowCredentials: false,
        allowHeaders: ["CORELATION_ID", "Content-Type"],
        allowMethods: ["GET", "POST", "PUT", "DELETE"]
    }
}
service / on new http:Listener(port) {
    resource function get api/jobs(string? positionType = (), int? minSalary = (), int? maxSalary = (), string? category = ())
            returns jobs:Job[]|http:BadRequest|http:InternalServerError {

        jobs:JobFilters filters = {minSalary, maxSalary};

        if positionType is string {
            jobs:PositionType|error posType = positionType.ensureType();
            if posType is error {
                return <http:BadRequest>{body: {message: "Invalid position type", details: "Valid values are: Full Time, Part Time, Contract"}};
            }
            filters.positionType = posType;
        }

        if category is string {
            jobs:Category|error cat = category.ensureType();
            if cat is error {
                return <http:BadRequest>{body: {message: "Invalid category", details: "Valid categories are: Administration, Consulting, Customer Success, Design, Development, Education, Finance, Healthcare, Human Resources, Legal, Marketing, Management, Sales, System Administration, Writing"}};
            }
            filters.category = cat;
        }

        jobs:Job[]|error jobsResult = jobs:fetchFilteredJobs(filters);
        return jobsResult is error ? <http:InternalServerError>{body: {message: "Failed to fetch jobs", details: jobsResult.message()}} : jobsResult;
    }

    resource function post event/create(http:Request req) returns json|error {
        meetups:EventCreationResult|error result = meetups:createMeetup(req);
        if result is error {
            return {success: false, message: "Error creating event: " + result.message()};
        }
        return result.toJson();
    }

    resource function post upload/image(http:Request req) returns json|error {
        utils:ImageUploadResult|error result = utils:uploadImageToS3(req);
        if result is error {
            return {success: false, message: "Error uploading image: " + result.message()};
        }
        return result.toJson();
    }

    resource function get images() returns json|error {
        utils:ImageListResult|error result = utils:listImagesFromS3();
        if result is error {
            return {success: false, message: "Error listing images: " + result.message()};
        }
        return result.toJson();
    }

    resource function get image/[string filename]() returns http:Response|error {
        return utils:getImageFromS3(filename);
    }

    resource function get health() returns json {
        return {
            status: "healthy",
            "service": "event-management-service",
            timestamp: time:utcNow().toString()
        };
    }
}

public function main() returns error? {
    log:printInfo("Event Management Service started on port " + port.toString());
}
