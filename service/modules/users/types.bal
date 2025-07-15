public type User record {|
    string userId;
    string username;
    string firstName;
    string lastName;
    string email;
    string? country?;
    string? mobileNumber?;
    string? birthdate?;
    string? bio?;
    string createdAt;
    string updatedAt;
|};

public type UserCreateRequest record {|
    string userId;
    string username;
    string firstName;
    string lastName;
    string email;
    string? country?;
    string? mobileNumber?;
    string? birthdate?;
|};

public type UserUpdateRequest record {|
    string? firstName?;
    string? lastName?;
    string? country?;
    string? mobileNumber?;
    string? birthdate?;
    string? bio?;
|};

public type UserResponse record {|
    boolean success;
    string message;
    User? data?;
|};

public type UserListResponse record {|
    boolean success;
    string message;
    User[]? data?;
|};

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
