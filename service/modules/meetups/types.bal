public type EventCreationRequest record {
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
};

public type EventCreationResult record {
    boolean success;
    string message;
};

public type EventData record {
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
    string? imageUrl?;
    string createdAt;
};

public type MeetupResponse record {
    boolean success;
    string message;
    EventData? data?;
};

public type MeetupListResponse record {
    boolean success;
    string message;
    EventData[]? data?;
};

public type EventUpdateRequest record {
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
};
