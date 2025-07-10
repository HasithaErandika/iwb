import ballerina/http;
import ballerina/lang.regexp;

final http:Client workingNomadsClient = check new ("https://www.workingnomads.com");

public function fetchJobs() returns Job[]|error {
    json response = check workingNomadsClient->get(path = "/api/exposed_jobs/");
    return check response.cloneWithType();
}

public function fetchFilteredJobs(JobFilters filters) returns Job[]|error {
    Job[] allJobs = check fetchJobs();
    return allJobs.filter(job => matchesFilters(job, filters));
}

function matchesFilters(Job job, JobFilters filters) returns boolean {
    return (filters.positionType is () || containsPositionType(job, <PositionType>filters.positionType)) &&
            (filters.category is () || job.category_name == <Category>filters.category) &&
            matchesSalaryRange(job, filters.minSalary, filters.maxSalary);
}

function containsPositionType(Job job, PositionType positionType) returns boolean {
    string combinedText = (job.title + " " + job.description).toLowerAscii();
    return combinedText.includes(positionType.toLowerAscii());
}

function matchesSalaryRange(Job job, int? minSalary, int? maxSalary) returns boolean {
    int?|error jobSalaryResult = extractSalaryFromJob(job);
    if jobSalaryResult is error {
        return true;
    }

    int? jobSalary = jobSalaryResult;
    return jobSalary is () ||
            (minSalary is () || jobSalary >= minSalary) &&
            (maxSalary is () || jobSalary <= maxSalary);
}

function extractSalaryFromJob(Job job) returns int?|error {
    string text = (job.title + " " + job.description).toLowerAscii();

    string:RegExp salaryPattern = re `\$(\d{1,3}(?:,\d{3})*k?|\d+k?)`;
    regexp:Span? matchResult = salaryPattern.find(text);

    if matchResult is () {
        return ();
    }

    string matchedText = text.substring(matchResult.startIndex, matchResult.endIndex);
    string salaryStr = matchedText.substring(1); // Remove the $ sign

    string cleanSalaryStr = "";
    foreach string char in salaryStr {
        if char != "," {
            cleanSalaryStr += char;
        }
    }
    salaryStr = cleanSalaryStr;

    if salaryStr.endsWith("k") {
        int|error baseNum = int:fromString(salaryStr.substring(0, salaryStr.length() - 1));
        return baseNum is int ? baseNum * 1000 : baseNum;
    }

    return int:fromString(salaryStr);
}
