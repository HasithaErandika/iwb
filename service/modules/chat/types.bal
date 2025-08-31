public type ChatMessage record {|
    string messageId;
    string meetupId?;
    string cityId?;
    string userId;
    string userName;
    string message;
    string timestamp;
|};

public type ChatMessageRequest record {|
    string meetupId;
    string userId;
    string userName;
    string message;
|};

public type ChatMessageResponse record {|
    boolean success;
    string message;
    ChatMessage? data?;
|};

public type ChatHistoryResponse record {|
    boolean success;
    string message;
    ChatMessage[]? data?;
|};

// ws message types
public type WebSocketMessage record {|
    string 'type;
    json data;
|};

public type JoinRoomMessage record {|
    string meetupId?;
    string cityId?;
    string userId;
    string userName;
|};

public type ChatMessageData record {|
    string meetupId?;
    string cityId?;
    string userId;
    string userName;
    string message;
|};

// db
public type ChatMessageRecord record {|
    string message_id;
    string meetup_id?;
    string city_id?;
    string user_id;
    string user_name;
    string message;
    string created_at;
|};

public type ChatMessageInsert record {|
    string messageId;
    string meetupId?;
    string cityId?;
    string userId;
    string userName;
    string message;
    string createdAt;
|};

// city chat db types
public type CityChatMessageRecord record {|
    string message_id;
    string city_id;
    string user_id;
    string user_name;
    string message;
    string created_at;
|};

public type CityChatMessageInsert record {|
    string messageId;
    string cityId;
    string userId;
    string userName;
    string message;
    string createdAt;
|};
