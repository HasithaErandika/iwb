public type City record {|
    string cityId;
    string name;
    string slug;
    string province;
    string description;
    string category;
    decimal latitude;
    decimal longitude;
    int? costOfLiving?;
    int? temperature?;
    int? population?;
    string[]? amenities?;
    string[]? imageUrls?;
    decimal overallRating;
    int totalRatings;
    int rankPosition;
    string createdAt;
    string updatedAt;
    CityRatingBreakdown? ratingsBreakdown?;
|};

public type CityBasic record {|
    string cityId;
    string name;
    string slug;
    decimal overallRating;
    string category;
    string description;
    string? firstImageUrl?;
    int rankPosition;
|};

public type CityRatingBreakdown record {|
    decimal costOfLivingAvg;
    decimal safetyAvg;
    decimal transportationAvg;
    decimal healthcareAvg;
    decimal foodAvg;
    decimal nightlifeAvg;
    decimal cultureAvg;
    decimal outdoorActivitiesAvg;
|};

// City creation types
public type CityCreateRequest record {|
    string name;
    string province;
    string description;
    string category;
    decimal latitude;
    decimal longitude;
    string amenities; // JSON string array
|};

// Rating types
public type CityRating record {|
    string ratingId;
    string cityId;
    string userId;
    int costOfLivingRating;
    int safetyRating;
    int transportationRating;
    int healthcareRating;
    int foodRating;
    int nightlifeRating;
    int cultureRating;
    int outdoorActivitiesRating;
    string? reviewText?;
    string createdAt;
|};

public type RatingData record {|
    int costOfLiving;
    int safety;
    int transportation;
    int healthcare;
    int food;
    int nightlife;
    int culture;
    int outdoorActivities;
|};

public type CityRatingRequest record {|
    string userId;
    RatingData ratings;
    string? reviewText?;
|};

// Chat types for cities
public type CityChatMessage record {|
    string messageId;
    string cityId;
    string userId;
    string userName;
    string message;
    string createdAt;
|};

public type CityChatRequest record {|
    string userId;
    string userName;
    string message;
|};

// Response types
public type CityResponse record {|
    boolean success;
    string message;
    City? data?;
|};

public type CityListResponse record {|
    boolean success;
    string message;
    CityBasic[]? data?;
|};

public type CityCreationResult record {|
    boolean success;
    string message;
    string? cityId?;
|};

public type CityRatingResponse record {|
    boolean success;
    string message;
|};

public type CityChatResponse record {|
    boolean success;
    string message;
    CityChatMessage[]? data?;
|};

// Database record types
public type CityRecord record {|
    string city_id;
    string name;
    string slug;
    string province;
    string description;
    string category;
    decimal latitude;
    decimal longitude;
    int? cost_of_living;
    int? temperature;
    int? population;
    string? amenities;
    string? image_urls;
    decimal overall_rating;
    int total_ratings;
    int rank_position;
    string created_at;
    string updated_at;
|};

public type CityInsert record {|
    string cityId;
    string name;
    string slug;
    string province;
    string description;
    string category;
    decimal latitude;
    decimal longitude;
    int? costOfLiving;
    int? temperature;
    int? population;
    string? amenities;
    string? imageUrls;
    string createdAt;
    string updatedAt;
|};

public type CityRatingRecord record {|
    string rating_id;
    string city_id;
    string user_id;
    int cost_of_living_rating;
    int safety_rating;
    int transportation_rating;
    int healthcare_rating;
    int food_rating;
    int nightlife_rating;
    int culture_rating;
    int outdoor_activities_rating;
    string? review_text;
    string created_at;
|};

public type CityRatingInsert record {|
    string ratingId;
    string cityId;
    string userId;
    int costOfLivingRating;
    int safetyRating;
    int transportationRating;
    int healthcareRating;
    int foodRating;
    int nightlifeRating;
    int cultureRating;
    int outdoorActivitiesRating;
    string? reviewText;
    string createdAt;
|};

public type CityChatRecord record {|
    string message_id;
    string city_id;
    string user_id;
    string user_name;
    string message;
    string created_at;
|};

public type CityChatInsert record {|
    string messageId;
    string cityId;
    string userId;
    string userName;
    string message;
    string createdAt;
|};

public type CityRatingAverages record {|
    decimal cost_of_living_avg;
    decimal safety_avg;
    decimal transportation_avg;
    decimal healthcare_avg;
    decimal food_avg;
    decimal nightlife_avg;
    decimal culture_avg;
    decimal outdoor_activities_avg;
|};
