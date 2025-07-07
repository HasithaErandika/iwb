import ballerina/http;

final http:Client workingNomadsClient = check new ("https://www.workingnomads.com");

public function fetchJobs() returns Job[]|error {
    json response = check workingNomadsClient->get(path = "/api/exposed_jobs/");
    Job[] jobs = check response.cloneWithType();
    return jobs;
}

public function fetchFilteredJobs(JobFilters filters) returns Job[]|error {
    Job[] allJobs = check fetchJobs();
    Job[] filteredJobs = [];

    foreach Job job in allJobs {
        if matchesFilters(job, filters) {
            filteredJobs.push(job);
        }
    }

    return filteredJobs;
}

function matchesFilters(Job job, JobFilters filters) returns boolean {
    // Check position type
    if filters.positionType is PositionType {
        PositionType positionType = <PositionType>filters.positionType;
        if !containsPositionType(job, positionType) {
            return false;
        }
    }

    if filters.category is Category {
        Category category = <Category>filters.category;
        if !matchesCategory(job, category) {
            return false;
        }
    }

    if filters.minSalary is int || filters.maxSalary is int {
        if !matchesSalaryRange(job, filters.minSalary, filters.maxSalary) {
            return false;
        }
    }

    return true;
}

function containsPositionType(Job job, PositionType positionType) returns boolean {
    string titleLower = job.title.toLowerAscii();
    string descriptionLower = job.description.toLowerAscii();
    string positionTypeLower = positionType.toLowerAscii();

    return titleLower.includes(positionTypeLower) || descriptionLower.includes(positionTypeLower);
}

function matchesCategory(Job job, Category category) returns boolean {
    return job.category_name == category;
}

function matchesSalaryRange(Job job, int? minSalary, int? maxSalary) returns boolean {
    int? jobSalary = extractSalaryFromJob(job);

    if jobSalary is () {
        return true;
    }

    if minSalary is int && jobSalary < minSalary {
        return false;
    }

    if maxSalary is int && jobSalary > maxSalary {
        return false;
    }

    return true;
}

function extractSalaryFromJob(Job job) returns int? {
    string combinedText = job.title + " " + job.description;
    string textLower = combinedText.toLowerAscii();

    int? startIndex = textLower.indexOf("$");
    if startIndex is int {
        string afterDollar = textLower.substring(startIndex + 1);
        string numberStr = "";
        foreach int i in 0 ..< afterDollar.length() {
            string char = afterDollar.substring(i, i + 1);
            if char >= "0" && char <= "9" || char == "," || char == "k" {
                numberStr += char;
            } else {
                break;
            }
        }

        if numberStr.length() > 0 {
            if numberStr.endsWith("k") {
                string numPart = numberStr.substring(0, numberStr.length() - 1);
                numPart = numPart.trim();
                numPart = removeCommas(numPart);
                int|error baseNum = int:fromString(numPart);
                if baseNum is int {
                    return baseNum * 1000;
                }
            } else {
                numberStr = removeCommas(numberStr);
                int|error salary = int:fromString(numberStr);
                if salary is int {
                    return salary;
                }
            }
        }
    }

    return ();
}

function removeCommas(string input) returns string {
    string result = "";
    foreach int i in 0 ..< input.length() {
        string char = input.substring(i, i + 1);
        if char != "," {
            result += char;
        }
    }
    return result;
}
