import 'service.utils;

import ballerina/sql;
import ballerina/time;

public isolated function createOrUpdateUser(UserCreateRequest userRequest) returns UserResponse|error {
    string currentTime = time:utcNow().toString();

    UserRecord|sql:Error existingUser = utils:getUserById(userRequest.userId);

    if existingUser is UserRecord {
        UserUpdate userUpdate = {
            firstName: userRequest.firstName,
            lastName: userRequest.lastName,
            country: userRequest?.country,
            mobileNumber: userRequest?.mobileNumber,
            birthdate: userRequest?.birthdate,
            bio: existingUser?.bio,
            updatedAt: currentTime
        };

        sql:ExecutionResult|sql:Error updateResult = utils:updateUser(userRequest.userId, userUpdate);
        if updateResult is sql:Error {
            return {success: false, message: "Failed to update user: " + updateResult.message()};
        }

        UserRecord|sql:Error updatedUser = utils:getUserById(userRequest.userId);
        if updatedUser is sql:Error {
            return {success: false, message: "Failed to fetch updated user"};
        }

        User userData = mapUserRecordToUser(updatedUser);
        return {success: true, message: "User updated successfully", data: userData};
    } else {
        UserInsert userInsert = {
            userId: userRequest.userId,
            username: userRequest.username,
            firstName: userRequest.firstName,
            lastName: userRequest.lastName,
            email: userRequest.email,
            country: userRequest?.country,
            mobileNumber: userRequest?.mobileNumber,
            birthdate: userRequest?.birthdate,
            createdAt: currentTime,
            updatedAt: currentTime
        };

        sql:ExecutionResult|sql:Error insertResult = utils:insertUser(userInsert);
        if insertResult is sql:Error {
            return {success: false, message: "Failed to create user: " + insertResult.message()};
        }

        UserRecord|sql:Error newUser = utils:getUserById(userRequest.userId);
        if newUser is sql:Error {
            return {success: false, message: "Failed to fetch created user"};
        }

        User userData = mapUserRecordToUser(newUser);
        return {success: true, message: "User created successfully", data: userData};
    }
}

public isolated function updateUserProfile(string userId, UserUpdateRequest updateRequest) returns UserResponse|error {
    string currentTime = time:utcNow().toString();

    UserRecord|sql:Error existingUser = utils:getUserById(userId);
    if existingUser is sql:Error {
        return {success: false, message: "User not found"};
    }

    UserUpdate userUpdate = {
        firstName: updateRequest?.firstName ?: existingUser.first_name,
        lastName: updateRequest?.lastName ?: existingUser.last_name,
        country: updateRequest?.country ?: existingUser.country,
        mobileNumber: updateRequest?.mobileNumber ?: existingUser.mobile_number,
        birthdate: updateRequest?.birthdate ?: existingUser.birthdate,
        bio: updateRequest?.bio ?: existingUser.bio,
        updatedAt: currentTime
    };

    sql:ExecutionResult|sql:Error updateResult = utils:updateUser(userId, userUpdate);
    if updateResult is sql:Error {
        return {success: false, message: "Failed to update user profile: " + updateResult.message()};
    }

    UserRecord|sql:Error updatedUser = utils:getUserById(userId);
    if updatedUser is sql:Error {
        return {success: false, message: "Failed to fetch updated user"};
    }

    User userData = mapUserRecordToUser(updatedUser);
    return {success: true, message: "User profile updated successfully", data: userData};
}

public isolated function getAllUsers() returns UserListResponse|error {
    UserRecord[]|sql:Error dbResult = utils:getAllUsers();
    if dbResult is sql:Error {
        return {success: false, message: "Failed to fetch users: " + dbResult.message()};
    }

    User[] users = [];
    foreach UserRecord userRecord in dbResult {
        User userData = mapUserRecordToUser(userRecord);
        users.push(userData);
    }

    return {success: true, message: "Users fetched successfully", data: users};
}

public isolated function getUserById(string userId) returns UserResponse|error {
    UserRecord|sql:Error dbResult = utils:getUserById(userId);
    if dbResult is sql:Error {
        return {success: false, message: "User not found"};
    }

    User userData = mapUserRecordToUser(dbResult);
    return {success: true, message: "User fetched successfully", data: userData};
}

isolated function mapUserRecordToUser(UserRecord userRecord) returns User {
    return {
        userId: userRecord.user_id,
        username: userRecord.username,
        firstName: userRecord.first_name,
        lastName: userRecord.last_name,
        email: userRecord.email,
        country: userRecord.country,
        mobileNumber: userRecord.mobile_number,
        birthdate: userRecord.birthdate,
        bio: userRecord.bio,
        createdAt: userRecord.created_at,
        updatedAt: userRecord.updated_at
    };
}
