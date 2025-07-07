public type Job record {|
    string url;
    string title;
    string description;
    string company_name;
    string category_name;
    string tags;
    string location;
    string pub_date;
|};

public enum PositionType {
    FULL_TIME = "Full Time",
    PART_TIME = "Part Time",
    CONTRACT = "Contract"
}

public enum Category {
    ADMINISTRATION = "Administration",
    CONSULTING = "Consulting",
    CUSTOMER_SUCCESS = "Customer Success",
    DESIGN = "Design",
    DEVELOPMENT = "Development",
    EDUCATION = "Education",
    FINANCE = "Finance",
    HEALTHCARE = "Healthcare",
    HUMAN_RESOURCES = "Human Resources",
    LEGAL = "Legal",
    MARKETING = "Marketing",
    MANAGEMENT = "Management",
    SALES = "Sales",
    SYSTEM_ADMINISTRATION = "System Administration",
    WRITING = "Writing"
}

public type JobFilters record {|
    PositionType? positionType = ();
    int? minSalary = ();
    int? maxSalary = ();
    Category? category = ();
|};
