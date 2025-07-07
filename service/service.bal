import 'service.jobs;

import ballerina/http;

service / on new http:Listener(9090) {
    resource function get api/jobs(string? positionType = (), int? minSalary = (), int? maxSalary = (), string? category = ()) returns jobs:Job[]|http:BadRequest|http:InternalServerError {

        jobs:JobFilters filters = {};

        if positionType is string {
            jobs:PositionType|error posType = positionType.ensureType();
            if posType is error {
                return <http:BadRequest>{
                    body: {
                        message: "Invalid position type",
                        details: "Valid values are: Full Time, Part Time, Contract"
                    }
                };
            }
            filters.positionType = posType;
        }

        if minSalary is int {
            filters.minSalary = minSalary;
        }

        if maxSalary is int {
            filters.maxSalary = maxSalary;
        }

        if category is string {
            jobs:Category|error cat = category.ensureType();
            if cat is error {
                return <http:BadRequest>{
                    body: {
                        message: "Invalid category",
                        details: "Valid categories are: Administration, Consulting, Customer Success, Design, Development, Education, Finance, Healthcare, Human Resources, Legal, Marketing, Management, Sales, System Administration, Writing"
                    }
                };
            }
            filters.category = cat;
        }

        jobs:Job[]|error jobsResult = jobs:fetchFilteredJobs(filters);

        if jobsResult is error {
            return <http:InternalServerError>{
                body: {
                    message: "Failed to fetch jobs",
                    details: jobsResult.message()
                }
            };
        }

        return jobsResult;
    }
}
