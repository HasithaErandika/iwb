import ballerina/sql;

public function insertMeetup(MeetupInsert meetupData) returns sql:ExecutionResult|sql:Error {
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

public function getMeetupById(string eventId) returns MeetupRecord|sql:Error {
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

public function getAllMeetups() returns MeetupRecord[]|sql:Error {
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
