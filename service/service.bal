import 'service.chat;
import 'service.city_guide;
import 'service.jobs;
import 'service.meetups;
import 'service.users;

import ballerina/http;
import ballerina/log;

configurable int port = 8080;

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000"],
        allowCredentials: false,
        allowHeaders: ["CORELATION_ID", "Content-Type", "Authorization"],
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

    resource function get api/meetups() returns json|http:InternalServerError {
        meetups:MeetupListResponse|error result = meetups:getAllMeetups();
        if result is error {
            return <http:InternalServerError>{body: {success: false, message: "Error fetching meetups: " + result.message()}};
        }
        return result.toJson();
    }

    resource function get api/meetups/[string eventId]() returns json|http:NotFound|http:InternalServerError {
        meetups:MeetupResponse|error result = meetups:getMeetupById(eventId);
        if result is error {
            return <http:InternalServerError>{
                body: {success: false, message: "Error fetching meetup: " + result.message()}
            };
        }

        if !result.success {
            return <http:NotFound>{
                body: {success: false, message: result.message}
            };
        }

        return result.toJson();
    }

    resource function delete api/meetups/[string eventId]() returns json|http:NotFound|http:InternalServerError {
        meetups:EventCreationResult|error result = meetups:deleteMeetup(eventId);
        if result is error {
            return <http:InternalServerError>{
                body: {success: false, message: "Error deleting meetup: " + result.message()}
            };
        }

        if !result.success {
            return <http:NotFound>{
                body: result.toJson()
            };
        }

        return result.toJson();
    }

    resource function post event/create(http:Request req) returns json|error {
        meetups:EventCreationResult|error result = meetups:createMeetup(req);
        if result is error {
            return {success: false, message: "Error creating event: " + result.message()};
        }
        return result.toJson();
    }

    resource function post api/chat(@http:Payload city_guide:UserChatRequest chatRequest)
    returns json|http:BadRequest|http:InternalServerError {

        if chatRequest.message.trim() == "" {
            return <http:BadRequest>{
                body: {success: false, message: "Message cannot be empty"}
            };
        }

        city_guide:CityGuideResponse|error result = city_guide:askAnything(chatRequest.message);
        if result is error {
            return <http:InternalServerError>{
                body: {success: false, message: "Error processing chat request: " + result.message()}
            };
        }

        return result.toJson();
    }

    resource function post api/users(@http:Payload users:UserCreateRequest userRequest)
    returns json|http:BadRequest|http:InternalServerError {

        if userRequest.userId.trim() == "" || userRequest.email.trim() == "" ||
            userRequest.firstName.trim() == "" || userRequest.lastName.trim() == "" {
            return <http:BadRequest>{
                body: {success: false, message: "User ID, email, first name, and last name are required"}
            };
        }

        users:UserResponse|error result = users:createOrUpdateUser(userRequest);
        if result is error {
            return <http:InternalServerError>{
                body: {success: false, message: "Error creating/updating user: " + result.message()}
            };
        }

        return result.toJson();
    }

    resource function get api/users() returns json|http:InternalServerError {
        users:UserListResponse|error result = users:getAllUsers();
        if result is error {
            return <http:InternalServerError>{
                body: {success: false, message: "Error fetching users: " + result.message()}
            };
        }
        return result.toJson();
    }

    resource function get api/users/[string userId]() returns json|http:NotFound|http:InternalServerError {
        users:UserResponse|error result = users:getUserById(userId);
        if result is error {
            return <http:InternalServerError>{
                body: {success: false, message: "Error fetching user: " + result.message()}
            };
        }

        if !result.success {
            return <http:NotFound>{
                body: {success: false, message: result.message}
            };
        }

        return result.toJson();
    }

    resource function put api/users/[string userId](@http:Payload users:UserUpdateRequest updateRequest)
    returns json|http:BadRequest|http:InternalServerError {

        if userId.trim() == "" {
            return <http:BadRequest>{
                body: {success: false, message: "User ID is required"}
            };
        }

        users:UserResponse|error result = users:updateUserProfile(userId, updateRequest);
        if result is error {
            return <http:InternalServerError>{
                body: {success: false, message: "Error updating user profile: " + result.message()}
            };
        }

        return result.toJson();
    }

    // chat api ( chat mean ws not ai chat)
    resource function get api/chat/history/[string meetupId]() returns json|http:NotFound|http:InternalServerError {
        chat:ChatHistoryResponse|error result = chat:getChatHistory(meetupId);
        if result is error {
            return <http:InternalServerError>{
                body: {success: false, message: "Error fetching chat history: " + result.message()}
            };
        }

        if !result.success {
            return <http:NotFound>{
                body: {success: false, message: result.message}
            };
        }

        return result.toJson();
    }

}

public function main() returns error? {
    log:printInfo("Event Management Service started on port " + port.toString());
    log:printInfo("WebSocket Chat Service started on port 9090");
}
