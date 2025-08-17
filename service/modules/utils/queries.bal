import ballerina/sql;

//meetups
public isolated function insertMeetup(MeetupInsert meetupData) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery insertQuery = `
        INSERT INTO meetups (
            event_id, event_name, event_description, event_start_date, 
            event_start_time, event_end_date, event_end_time, venue_name, 
            venue_google_maps_url, is_paid_event, event_cost, 
            has_limited_capacity, event_capacity, require_approval, 
            image_url, created_at
        ) VALUES (
            ${meetupData.eventId}, ${meetupData.eventName}, ${meetupData.eventDescription}, 
            ${meetupData.eventStartDate}, ${meetupData.eventStartTime}, ${meetupData.eventEndDate}, 
            ${meetupData.eventEndTime}, ${meetupData.venueName}, ${meetupData.venueGoogleMapsUrl}, 
            ${meetupData.isPaidEvent}, ${meetupData.eventCost}, ${meetupData.hasLimitedCapacity}, 
            ${meetupData.eventCapacity}, ${meetupData.requireApproval}, ${meetupData.imageUrl}, 
            ${meetupData.createdAt}
        )
    `;

    return dbClient->execute(insertQuery);
}

public isolated function getMeetupById(string eventId) returns MeetupRecord|sql:Error {
    sql:ParameterizedQuery selectQuery = `
        SELECT event_id, event_name, event_description, event_start_date, 
               event_start_time, event_end_date, event_end_time, venue_name, 
               venue_google_maps_url, is_paid_event, event_cost, 
               has_limited_capacity, event_capacity, require_approval, 
               image_url, created_at
        FROM meetups 
        WHERE event_id = ${eventId}
    `;

    return dbClient->queryRow(selectQuery);
}

public isolated function getAllMeetups() returns MeetupRecord[]|sql:Error {
    sql:ParameterizedQuery selectQuery = `
        SELECT event_id, event_name, event_description, event_start_date, 
               event_start_time, event_end_date, event_end_time, venue_name, 
               venue_google_maps_url, is_paid_event, event_cost, 
               has_limited_capacity, event_capacity, require_approval, 
               image_url, created_at
        FROM meetups 
        ORDER BY created_at DESC
    `;

    stream<MeetupRecord, sql:Error?> meetupStream = dbClient->query(selectQuery);
    return from MeetupRecord meetup in meetupStream
        select meetup;
}

public function updateMeetup(string eventId, MeetupUpdate updateData) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery updateQuery = `
        UPDATE meetups SET 
            event_name = ${updateData.eventName},
            event_description = ${updateData.eventDescription},
            event_start_date = ${updateData.eventStartDate},
            event_start_time = ${updateData.eventStartTime},
            event_end_date = ${updateData.eventEndDate},
            event_end_time = ${updateData.eventEndTime},
            venue_name = ${updateData.venueName},
            venue_google_maps_url = ${updateData.venueGoogleMapsUrl},
            is_paid_event = ${updateData.isPaidEvent},
            event_cost = ${updateData.eventCost},
            has_limited_capacity = ${updateData.hasLimitedCapacity},
            event_capacity = ${updateData.eventCapacity},
            require_approval = ${updateData.requireApproval},
            image_url = ${updateData.imageUrl}
        WHERE event_id = ${eventId}
    `;

    return dbClient->execute(updateQuery);
}

public isolated function deleteMeetup(string eventId) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery deleteQuery = `DELETE FROM meetups WHERE event_id = ${eventId}`;
    return dbClient->execute(deleteQuery);
}

/// =======================

// user operations

public isolated function insertUser(UserInsert userData) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery insertQuery = `
        INSERT INTO users (
            user_id, username, first_name, last_name, email, 
            country, mobile_number, birthdate, created_at, updated_at
        ) VALUES (
            ${userData.userId}, ${userData.username}, ${userData.firstName}, 
            ${userData.lastName}, ${userData.email}, ${userData.country}, 
            ${userData.mobileNumber}, ${userData.birthdate}, 
            ${userData.createdAt}, ${userData.updatedAt}
        )
    `;

    return dbClient->execute(insertQuery);
}

public isolated function getUserById(string userId) returns UserRecord|sql:Error {
    sql:ParameterizedQuery selectQuery = `
        SELECT user_id, username, first_name, last_name, email, 
               country, mobile_number, birthdate, bio, created_at, updated_at
        FROM users 
        WHERE user_id = ${userId}
    `;

    return dbClient->queryRow(selectQuery);
}

public isolated function getAllUsers() returns UserRecord[]|sql:Error {
    sql:ParameterizedQuery selectQuery = `
        SELECT user_id, username, first_name, last_name, email, 
               country, mobile_number, birthdate, bio, created_at, updated_at
        FROM users 
        ORDER BY first_name ASC, last_name ASC
    `;

    stream<UserRecord, sql:Error?> userStream = dbClient->query(selectQuery);
    return from UserRecord user in userStream
        select user;
}

public isolated function updateUser(string userId, UserUpdate updateData) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery updateQuery = `
        UPDATE users SET 
            first_name = ${updateData.firstName},
            last_name = ${updateData.lastName},
            country = ${updateData.country},
            mobile_number = ${updateData.mobileNumber},
            birthdate = ${updateData.birthdate},
            bio = ${updateData.bio},
            updated_at = ${updateData.updatedAt}
        WHERE user_id = ${userId}
    `;

    return dbClient->execute(updateQuery);
}

public type UserRecord record {|
    string user_id;
    string username;
    string first_name;
    string last_name;
    string email;
    string? country;
    string? mobile_number;
    string? birthdate;
    string? bio;
    string created_at;
    string updated_at;
|};

public type UserInsert record {|
    string userId;
    string username;
    string firstName;
    string lastName;
    string email;
    string? country;
    string? mobileNumber;
    string? birthdate;
    string createdAt;
    string updatedAt;
|};

public type UserUpdate record {|
    string firstName;
    string lastName;
    string? country;
    string? mobileNumber;
    string? birthdate;
    string? bio;
    string updatedAt;
|};

public type MeetupRecord record {|
    string event_id;
    string event_name;
    string event_description;
    string event_start_date;
    string event_start_time;
    string event_end_date;
    string event_end_time;
    string venue_name;
    string venue_google_maps_url;
    boolean is_paid_event;
    decimal? event_cost;
    boolean has_limited_capacity;
    int? event_capacity;
    boolean require_approval;
    string? image_url;
    string created_at;
|};

public type MeetupInsert record {|
    string eventId;
    string eventName;
    string eventDescription;
    string eventStartDate;
    string eventStartTime;
    string eventEndDate;
    string eventEndTime;
    string venueName;
    string venueGoogleMapsUrl;
    boolean isPaidEvent;
    decimal? eventCost;
    boolean hasLimitedCapacity;
    int? eventCapacity;
    boolean requireApproval;
    string? imageUrl;
    string createdAt;
|};

public type MeetupUpdate record {|
    string eventName;
    string eventDescription;
    string eventStartDate;
    string eventStartTime;
    string eventEndDate;
    string eventEndTime;
    string venueName;
    string venueGoogleMapsUrl;
    boolean isPaidEvent;
    decimal? eventCost;
    boolean hasLimitedCapacity;
    int? eventCapacity;
    boolean requireApproval;
    string? imageUrl;
|};

// chat types
public type ChatMessageRecord record {|
    string message_id;
    string meetup_id;
    string user_id;
    string user_name;
    string message;
    string created_at;
|};

public type ChatMessageInsert record {|
    string messageId;
    string meetupId;
    string userId;
    string userName;
    string message;
    string createdAt;
|};

// chat
public function insertChatMessage(ChatMessageInsert messageData) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery insertQuery = `
        INSERT INTO chat_messages (
            message_id, meetup_id, user_id, user_name, message, created_at
        ) VALUES (
            ${messageData.messageId}, ${messageData.meetupId}, ${messageData.userId}, 
            ${messageData.userName}, ${messageData.message}, ${messageData.createdAt}
        )
    `;

    return dbClient->execute(insertQuery);
}

public isolated function getChatMessagesByMeetupId(string meetupId) returns ChatMessageRecord[]|sql:Error {
    sql:ParameterizedQuery selectQuery = `
        SELECT message_id, meetup_id, user_id, user_name, message, created_at
        FROM chat_messages 
        WHERE meetup_id = ${meetupId}
        ORDER BY created_at ASC
    `;

    stream<ChatMessageRecord, sql:Error?> messageStream = dbClient->query(selectQuery);
    return from ChatMessageRecord message in messageStream
        select message;
}

// TODO : need to cleanup this
