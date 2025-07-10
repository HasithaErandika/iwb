import 'service.utils;

import ballerina/http;
import ballerina/mime;
import ballerina/sql;
import ballerina/time;

public function createMeetup(http:Request req) returns EventCreationResult|error {
    mime:Entity[]|http:ClientError bodyParts = req.getBodyParts();
    if bodyParts is error {
        return {success: false, message: "Error parsing multipart data"};
    }

    string eventName = "";
    string eventDescription = "";
    string eventStartDate = "";
    string eventStartTime = "";
    string eventEndDate = "";
    string eventEndTime = "";
    string venueName = "";
    string venueGoogleMapsUrl = "";
    boolean isPaidEvent = false;
    decimal? eventCost = ();
    boolean hasLimitedCapacity = false;
    int? eventCapacity = ();
    boolean requireApproval = false;
    string? imageUrl = ();

    foreach mime:Entity part in bodyParts {
        mime:ContentDisposition contentDisposition = part.getContentDisposition();
        string partName = contentDisposition.name;

        if partName == "eventName" {
            string|error textContent = part.getText();
            if textContent is string {
                eventName = textContent;
            }
        } else if partName == "eventDescription" {
            string|error textContent = part.getText();
            if textContent is string {
                eventDescription = textContent;
            }
        } else if partName == "eventStartDate" {
            string|error textContent = part.getText();
            if textContent is string {
                eventStartDate = textContent;
            }
        } else if partName == "eventStartTime" {
            string|error textContent = part.getText();
            if textContent is string {
                eventStartTime = textContent;
            }
        } else if partName == "eventEndDate" {
            string|error textContent = part.getText();
            if textContent is string {
                eventEndDate = textContent;
            }
        } else if partName == "eventEndTime" {
            string|error textContent = part.getText();
            if textContent is string {
                eventEndTime = textContent;
            }
        } else if partName == "venueName" {
            string|error textContent = part.getText();
            if textContent is string {
                venueName = textContent;
            }
        } else if partName == "venueGoogleMapsUrl" {
            string|error textContent = part.getText();
            if textContent is string {
                venueGoogleMapsUrl = textContent;
            }
        } else if partName == "isPaidEvent" {
            string|error textContent = part.getText();
            if textContent is string {
                isPaidEvent = textContent == "true";
            }
        } else if partName == "eventCost" {
            string|error textContent = part.getText();
            if textContent is string && textContent != "" {
                decimal|error costValue = decimal:fromString(textContent);
                if costValue is decimal {
                    eventCost = costValue;
                }
            }
        } else if partName == "hasLimitedCapacity" {
            string|error textContent = part.getText();
            if textContent is string {
                hasLimitedCapacity = textContent == "true";
            }
        } else if partName == "eventCapacity" {
            string|error textContent = part.getText();
            if textContent is string && textContent != "" {
                int|error capacityValue = int:fromString(textContent);
                if capacityValue is int {
                    eventCapacity = capacityValue;
                }
            }
        } else if partName == "requireApproval" {
            string|error textContent = part.getText();
            if textContent is string {
                requireApproval = textContent == "true";
            }
        } else if partName == "image" {
            utils:ImageUploadResult|error uploadResult = utils:uploadImageToS3(req);
            if uploadResult is utils:ImageUploadResult && uploadResult.success {
                utils:ImageData? imageData = uploadResult?.data;
                if imageData is utils:ImageData {
                    imageUrl = imageData.url;
                }
            }
        }
    }

    if eventName == "" || eventDescription == "" || eventStartDate == "" || eventStartTime == "" ||
        eventEndDate == "" || eventEndTime == "" || venueName == "" || venueGoogleMapsUrl == "" {
        return {success: false, message: "Missing required fields: eventName, eventDescription, eventStartDate, eventStartTime, eventEndDate, eventEndTime, venueName, venueGoogleMapsUrl"};
    }

    if isPaidEvent && eventCost is () {
        return {success: false, message: "Event cost is required for paid events"};
    }

    if hasLimitedCapacity && eventCapacity is () {
        return {success: false, message: "Event capacity is required for limited capacity events"};
    }

    string eventId = generateEventId();
    string createdAt = time:utcNow().toString();

    utils:MeetupInsert meetupInsert = {
        eventId: eventId,
        eventName: eventName,
        eventDescription: eventDescription,
        eventStartDate: eventStartDate,
        eventStartTime: eventStartTime,
        eventEndDate: eventEndDate,
        eventEndTime: eventEndTime,
        venueName: venueName,
        venueGoogleMapsUrl: venueGoogleMapsUrl,
        isPaidEvent: isPaidEvent,
        eventCost: eventCost,
        hasLimitedCapacity: hasLimitedCapacity,
        eventCapacity: eventCapacity,
        requireApproval: requireApproval,
        imageUrl: imageUrl,
        createdAt: createdAt
    };

    sql:ExecutionResult|sql:Error dbResult = utils:insertMeetup(meetupInsert);
    if dbResult is sql:Error {
        return {success: false, message: "Failed to save meetup to database: " + dbResult.message()};
    }

    return {
        success: true,
        message: "Event created successfully and saved to database",
        data: {
            eventId: eventId,
            eventName: eventName,
            eventDescription: eventDescription,
            eventStartDate: eventStartDate,
            eventStartTime: eventStartTime,
            eventEndDate: eventEndDate,
            eventEndTime: eventEndTime,
            venueName: venueName,
            venueGoogleMapsUrl: venueGoogleMapsUrl,
            isPaidEvent: isPaidEvent,
            eventCost: eventCost,
            hasLimitedCapacity: hasLimitedCapacity,
            eventCapacity: eventCapacity,
            requireApproval: requireApproval,
            imageUrl: imageUrl,
            createdAt: createdAt
        }
    };
}

function generateEventId() returns string {
    return "event_" + time:utcNow().toString();
}
