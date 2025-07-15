public type UserChatRequest record {|
    string message;
|};

public type CityGuideResponse record {|
    boolean success;
    string message;
    string? response?;
|};

public type PerplexityMessage record {|
    string role;
    string content;
|};

public type PerplexityRequest record {|
    string model;
    PerplexityMessage[] messages;
|};

public type PerplexityChoice record {|
    int index?;
    string finish_reason?;
    PerplexityMessage message;
    PerplexityMessage delta?;
|};

public type PerplexityUsage record {|
    int prompt_tokens?;
    int completion_tokens?;
    int total_tokens?;
|};

public type PerplexityResponse record {|
    string id?;
    string 'object?;
    int created?;
    string model?;
    PerplexityChoice[] choices;
    PerplexityUsage usage?;
|};