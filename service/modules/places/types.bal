public type Place record {|
    string placeId;
    string name;
    string location;
    string googleMapsUrl;
    PricingInfo pricing;
    string capacity;
    string[] workspaceTypes;
    string[] amenities;
    string phone;
    string email;
    string website;
    string[]? photoUrls?;
    string createdAt;
|};

public type PricingInfo record {|
    decimal price;
    string currency;
    string billing;
|};

public type PlaceCreateRequest record {|
    string name;
    string location;
    string googleMapsUrl;
    decimal price;
    string currency;
    string billing;
    string capacity;
    string[] workspaceTypes;
    string[] amenities;
    string phone;
    string email;
    string website;
|};

public type PlaceResponse record {|
    boolean success;
    string message;
    Place? data?;
|};

public type PlaceListResponse record {|
    boolean success;
    string message;
    Place[]? data?;
|};

public type PlaceCreationResult record {|
    boolean success;
    string message;
|};

public type PlaceRecord record {|
    string place_id;
    string name;
    string location;
    string google_maps_url;
    decimal price;
    string currency;
    string billing;
    string capacity;
    string workspace_types;
    string amenities;
    string phone;
    string email;
    string website;
    string? photo_urls;
    string created_at;
|};

public type PlaceInsert record {|
    string placeId;
    string name;
    string location;
    string googleMapsUrl;
    decimal price;
    string currency;
    string billing;
    string capacity;
    string workspaceTypes;
    string amenities;
    string phone;
    string email;
    string website;
    string? photoUrls;
    string createdAt;
|};
