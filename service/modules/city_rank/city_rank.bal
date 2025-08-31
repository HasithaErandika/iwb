import 'service.utils;

import ballerina/http;
import ballerina/io;
import ballerina/mime;
import ballerina/regex;
import ballerina/sql;
import ballerina/time;
import ballerina/uuid;

public isolated function getAllCities() returns CityListResponse|error {
    CityRecord[]|sql:Error dbResult = getAllCitiesFromDb();
    if dbResult is sql:Error {
        return {success: false, message: "Failed to fetch cities: " + dbResult.message()};
    }

    CityBasic[] cities = [];
    foreach CityRecord cityRecord in dbResult {
        CityBasic city = mapCityRecordToCityBasic(cityRecord);
        cities.push(city);
    }

    return {success: true, message: "Cities fetched successfully", data: cities};
}

public isolated function getCityBySlug(string slug) returns CityResponse|error {
    CityRecord|sql:Error cityResult = getCityBySlugFromDb(slug);
    if cityResult is sql:Error {
        return {success: false, message: "City not found"};
    }

    CityRatingAverages|sql:Error ratingsResult = getCityRatingAverages(cityResult.city_id);
    CityRatingBreakdown? ratingsBreakdown = ();
    if ratingsResult is CityRatingAverages {
        ratingsBreakdown = {
            costOfLivingAvg: ratingsResult.cost_of_living_avg,
            safetyAvg: ratingsResult.safety_avg,
            transportationAvg: ratingsResult.transportation_avg,
            healthcareAvg: ratingsResult.healthcare_avg,
            foodAvg: ratingsResult.food_avg,
            nightlifeAvg: ratingsResult.nightlife_avg,
            cultureAvg: ratingsResult.culture_avg,
            outdoorActivitiesAvg: ratingsResult.outdoor_activities_avg
        };
    }

    City city = mapCityRecordToCity(cityResult, ratingsBreakdown);
    return {success: true, message: "City fetched successfully", data: city};
}

public isolated function createCity(http:Request req) returns CityCreationResult|error {
    mime:Entity[]|http:ClientError bodyParts = req.getBodyParts();
    if bodyParts is error {
        return {success: false, message: "Error parsing multipart data"};
    }

    map<string> formData = {};
    string[] imageUrls = [];

    foreach mime:Entity part in bodyParts {
        mime:ContentDisposition contentDisposition = part.getContentDisposition();
        string partName = contentDisposition.name;

        // upload imgs one by one
        if partName.startsWith("image") && imageUrls.length() < 4 {
            utils:ImageUploadResult|error uploadResult = utils:uploadImageFromPart(part);
            if uploadResult is utils:ImageUploadResult && uploadResult.success {
                utils:ImageData? imageData = uploadResult?.data;
                if imageData is utils:ImageData {
                    imageUrls.push(imageData.url);
                }
            } else {
                if uploadResult is utils:ImageUploadResult {
                    io:println("Image upload failed: " + uploadResult.message);
                } else {
                    io:println("Image upload error: " + uploadResult.message());
                }
            }
        } else {
            string|error textContent = part.getText();
            if textContent is string {
                formData[partName] = textContent;
            }
        }
    }

    string[] requiredFields = ["name", "province", "description", "category", "latitude", "longitude"];
    foreach string reqField in requiredFields {
        if !formData.hasKey(reqField) || formData[reqField] == "" {
            return {success: false, message: "Missing required field: " + reqField};
        }
    }

    decimal|error latitude = decimal:fromString(formData.get("latitude"));
    if latitude is error {
        return {success: false, message: "Invalid latitude format"};
    }

    decimal|error longitude = decimal:fromString(formData.get("longitude"));
    if longitude is error {
        return {success: false, message: "Invalid longitude format"};
    }

    string slug = generateSlug(formData.get("name"));
    string cityId = uuid:createType1AsString();

    string amenitiesStr = formData["amenities"] ?: "[]";
    json|error amenitiesJson = amenitiesStr.fromJsonString();
    if amenitiesJson is error {
        return {success: false, message: "Invalid amenities JSON format"};
    }

    CityInsert cityInsert = {
        cityId: cityId,
        name: formData.get("name"),
        slug: slug,
        province: formData.get("province"),
        description: formData.get("description"),
        category: formData.get("category"),
        latitude: latitude,
        longitude: longitude,
        costOfLiving: (),
        temperature: (),
        population: (),
        amenities: amenitiesStr,
        imageUrls: imageUrls.length() > 0 ? string:'join(",", ...imageUrls) : "",
        createdAt: time:utcNow().toString(),
        updatedAt: time:utcNow().toString()
    };

    sql:ExecutionResult|sql:Error dbResult = insertCity(cityInsert);
    if dbResult is sql:Error {
        return {success: false, message: "Failed to save city to database: " + dbResult.message()};
    }

    io:println(string `City created successfully with ${imageUrls.length()} images`);
    return {success: true, message: "City created successfully", cityId: cityId};
}

public isolated function submitCityRating(string cityId, CityRatingRequest ratingRequest) returns CityRatingResponse|error {
    RatingData ratings = ratingRequest.ratings;
    int[] ratingValues = [
        ratings.costOfLiving,
        ratings.safety,
        ratings.transportation,
        ratings.healthcare,
        ratings.food,
        ratings.nightlife,
        ratings.culture,
        ratings.outdoorActivities
    ];

    foreach int rating in ratingValues {
        if rating < 1 || rating > 5 {
            return {success: false, message: "All ratings must be between 1 and 5"};
        }
    }

    CityRecord|sql:Error cityResult = getCityByIdFromDb(cityId);
    if cityResult is sql:Error {
        return {success: false, message: "City not found"};
    }

    string ratingId = uuid:createType1AsString();
    CityRatingInsert ratingInsert = {
        ratingId: ratingId,
        cityId: cityId,
        userId: ratingRequest.userId,
        costOfLivingRating: ratings.costOfLiving,
        safetyRating: ratings.safety,
        transportationRating: ratings.transportation,
        healthcareRating: ratings.healthcare,
        foodRating: ratings.food,
        nightlifeRating: ratings.nightlife,
        cultureRating: ratings.culture,
        outdoorActivitiesRating: ratings.outdoorActivities,
        reviewText: ratingRequest?.reviewText,
        createdAt: time:utcNow().toString()
    };

    sql:ExecutionResult|sql:Error ratingResult = insertCityRating(ratingInsert);
    if ratingResult is sql:Error {
        return {success: false, message: "Failed to save rating: " + ratingResult.message()};
    }

    error? updateResult = updateCityOverallRating(cityId);
    if updateResult is error {
        io:println("Warning: Failed to update city overall rating: " + updateResult.message());
    }

    return {success: true, message: "Rating submitted successfully"};
}

public isolated function getCityChat(string cityId) returns CityChatResponse|error {
    CityChatRecord[]|sql:Error dbResult = getCityChatMessagesFromDb(cityId);
    if dbResult is sql:Error {
        return {success: false, message: "Failed to fetch chat messages: " + dbResult.message()};
    }

    CityChatMessage[] messages = [];
    foreach CityChatRecord chatRecord in dbResult {
        CityChatMessage message = {
            messageId: chatRecord.message_id,
            cityId: chatRecord.city_id,
            userId: chatRecord.user_id,
            userName: chatRecord.user_name,
            message: chatRecord.message,
            createdAt: chatRecord.created_at
        };
        messages.push(message);
    }

    return {success: true, message: "Chat messages fetched successfully", data: messages};
}

public isolated function postCityChat(string cityId, CityChatRequest chatRequest) returns CityChatResponse|error {
    // Check if city exists
    CityRecord|sql:Error cityResult = getCityByIdFromDb(cityId);
    if cityResult is sql:Error {
        return {success: false, message: "City not found"};
    }

    if chatRequest.message.trim() == "" {
        return {success: false, message: "Message cannot be empty"};
    }

    string messageId = uuid:createType1AsString();
    CityChatInsert chatInsert = {
        messageId: messageId,
        cityId: cityId,
        userId: chatRequest.userId,
        userName: chatRequest.userName,
        message: chatRequest.message,
        createdAt: time:utcNow().toString()
    };

    sql:ExecutionResult|sql:Error dbResult = insertCityChatMessage(chatInsert);
    if dbResult is sql:Error {
        return {success: false, message: "Failed to send message: " + dbResult.message()};
    }

    return {success: true, message: "Message sent successfully"};
}

// helpers
isolated function generateSlug(string name) returns string {
    string lowercaseName = name.toLowerAscii();
    string slug = regex:replaceAll(lowercaseName, "[^a-z0-9]", "-");
    return regex:replaceAll(slug, "-+", "-").trim();
}

isolated function mapCityRecordToCityBasic(CityRecord cityRecord) returns CityBasic {
    string[] urls = cityRecord.image_urls is string && cityRecord.image_urls != "" ?
        regex:split(<string>cityRecord.image_urls, ",") : [];

    return {
        cityId: cityRecord.city_id,
        name: cityRecord.name,
        slug: cityRecord.slug,
        overallRating: cityRecord.overall_rating,
        category: cityRecord.category,
        description: cityRecord.description,
        firstImageUrl: urls.length() > 0 ? urls[0] : (),
        rankPosition: cityRecord.rank_position
    };
}

isolated function mapCityRecordToCity(CityRecord cityRecord, CityRatingBreakdown? ratingsBreakdown) returns City {
    string[]? amenities = ();
    if cityRecord.amenities is string && cityRecord.amenities != "" {
        json|error amenitiesJson = cityRecord.amenities ?: "".fromJsonString();
        if amenitiesJson is json[] {
            string[] tempAmenities = [];
            foreach json amenity in amenitiesJson {
                if amenity is string {
                    tempAmenities.push(amenity);
                }
            }
            amenities = tempAmenities;
        }
    }

    string[]? imageUrls = cityRecord.image_urls is string && cityRecord.image_urls != ""
        ? regex:split(<string>cityRecord.image_urls, ",")
        : ();

    return {
        cityId: cityRecord.city_id,
        name: cityRecord.name,
        slug: cityRecord.slug,
        province: cityRecord.province,
        description: cityRecord.description,
        category: cityRecord.category,
        latitude: cityRecord.latitude,
        longitude: cityRecord.longitude,
        costOfLiving: cityRecord.cost_of_living,
        temperature: cityRecord.temperature,
        population: cityRecord.population,
        amenities: amenities,
        imageUrls: imageUrls,
        overallRating: cityRecord.overall_rating,
        totalRatings: cityRecord.total_ratings,
        rankPosition: cityRecord.rank_position,
        createdAt: cityRecord.created_at,
        updatedAt: cityRecord.updated_at,
        ratingsBreakdown: ratingsBreakdown
    };
}

// db queries

isolated function getAllCitiesFromDb() returns CityRecord[]|sql:Error {
    sql:ParameterizedQuery selectQuery = `
        SELECT city_id, name, slug, province, description, category, latitude, longitude,
               cost_of_living, temperature, population, amenities, image_urls,
               overall_rating, total_ratings, rank_position, created_at, updated_at
        FROM cities 
        ORDER BY rank_position ASC, overall_rating DESC, name ASC
    `;

    stream<CityRecord, sql:Error?> cityStream = utils:dbClient->query(selectQuery, CityRecord);
    CityRecord[] cities = check from var city in cityStream
        select city;
    return cities;
}

isolated function getCityBySlugFromDb(string slug) returns CityRecord|sql:Error {
    sql:ParameterizedQuery selectQuery = `
        SELECT city_id, name, slug, province, description, category, latitude, longitude,
               cost_of_living, temperature, population, amenities, image_urls,
               overall_rating, total_ratings, rank_position, created_at, updated_at
        FROM cities 
        WHERE slug = ${slug}
    `;

    return utils:dbClient->queryRow(selectQuery);
}

isolated function getCityByIdFromDb(string cityId) returns CityRecord|sql:Error {
    sql:ParameterizedQuery selectQuery = `
        SELECT city_id, name, slug, province, description, category, latitude, longitude,
               cost_of_living, temperature, population, amenities, image_urls,
               overall_rating, total_ratings, rank_position, created_at, updated_at
        FROM cities 
        WHERE city_id = ${cityId}
    `;

    return utils:dbClient->queryRow(selectQuery);
}

isolated function insertCity(CityInsert cityData) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery insertQuery = `
        INSERT INTO cities (
            city_id, name, slug, province, description, category, latitude, longitude,
            cost_of_living, temperature, population, amenities, image_urls, 
            overall_rating, total_ratings, rank_position, created_at, updated_at
        ) VALUES (
            ${cityData.cityId}, ${cityData.name}, ${cityData.slug}, ${cityData.province},
            ${cityData.description}, ${cityData.category}, ${cityData.latitude}, ${cityData.longitude},
            ${cityData.costOfLiving}, ${cityData.temperature}, ${cityData.population},
            ${cityData.amenities}, ${cityData.imageUrls}, 0.0, 0, 0,
            ${cityData.createdAt}, ${cityData.updatedAt}
        )
    `;

    return utils:dbClient->execute(insertQuery);
}

isolated function insertCityRating(CityRatingInsert ratingData) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery insertQuery = `
        INSERT INTO city_ratings (
            rating_id, city_id, user_id, cost_of_living_rating, safety_rating,
            transportation_rating, healthcare_rating, food_rating, nightlife_rating,
            culture_rating, outdoor_activities_rating, review_text, created_at
        ) VALUES (
            ${ratingData.ratingId}, ${ratingData.cityId}, ${ratingData.userId},
            ${ratingData.costOfLivingRating}, ${ratingData.safetyRating},
            ${ratingData.transportationRating}, ${ratingData.healthcareRating},
            ${ratingData.foodRating}, ${ratingData.nightlifeRating},
            ${ratingData.cultureRating}, ${ratingData.outdoorActivitiesRating},
            ${ratingData.reviewText}, ${ratingData.createdAt}
        )
    `;

    return utils:dbClient->execute(insertQuery);
}

isolated function getCityRatingAverages(string cityId) returns CityRatingAverages|sql:Error {
    sql:ParameterizedQuery selectQuery = `
        SELECT 
            COALESCE(AVG(cost_of_living_rating), 0) as cost_of_living_avg,
            COALESCE(AVG(safety_rating), 0) as safety_avg,
            COALESCE(AVG(transportation_rating), 0) as transportation_avg,
            COALESCE(AVG(healthcare_rating), 0) as healthcare_avg,
            COALESCE(AVG(food_rating), 0) as food_avg,
            COALESCE(AVG(nightlife_rating), 0) as nightlife_avg,
            COALESCE(AVG(culture_rating), 0) as culture_avg,
            COALESCE(AVG(outdoor_activities_rating), 0) as outdoor_activities_avg
        FROM city_ratings 
        WHERE city_id = ${cityId}
    `;

    return utils:dbClient->queryRow(selectQuery);
}

isolated function updateCityOverallRating(string cityId) returns error? {
    sql:ParameterizedQuery calculateQuery = `
        UPDATE cities 
        SET 
            overall_rating = (
                SELECT COALESCE(AVG((cost_of_living_rating + safety_rating + transportation_rating + 
                                   healthcare_rating + food_rating + nightlife_rating + 
                                   culture_rating + outdoor_activities_rating) / 8.0), 0)
                FROM city_ratings 
                WHERE city_id = ${cityId}
            ),
            total_ratings = (
                SELECT COUNT(*) 
                FROM city_ratings 
                WHERE city_id = ${cityId}
            ),
            updated_at = ${time:utcNow().toString()}
        WHERE city_id = ${cityId}
    `;

    sql:ExecutionResult|sql:Error result = utils:dbClient->execute(calculateQuery);
    if result is sql:Error {
        return error("Failed to update city overall rating: " + result.message());
    }
}

isolated function getCityChatMessagesFromDb(string cityId) returns CityChatRecord[]|sql:Error {
    sql:ParameterizedQuery selectQuery = `
        SELECT message_id, city_id, user_id, user_name, message, created_at
        FROM city_chat 
        WHERE city_id = ${cityId}
        ORDER BY created_at ASC
    `;

    stream<CityChatRecord, sql:Error?> chatStream = utils:dbClient->query(selectQuery, CityChatRecord);
    CityChatRecord[] messages = check from var message in chatStream
        select message;
    return messages;
}

isolated function insertCityChatMessage(CityChatInsert chatData) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery insertQuery = `
        INSERT INTO city_chat (
            message_id, city_id, user_id, user_name, message, created_at
        ) VALUES (
            ${chatData.messageId}, ${chatData.cityId}, ${chatData.userId},
            ${chatData.userName}, ${chatData.message}, ${chatData.createdAt}
        )
    `;

    return utils:dbClient->execute(insertQuery);
}
