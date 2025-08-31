import ballerina/http;

final http:Client currencyClient = check new ("https://hexarate.paikama.co");

public type ConversionData record {|
    decimal amount;
    string base;
    string target;
    decimal rate;
    decimal result;
    string timestamp;
|};

public type CurrencyResponse record {|
    boolean success;
    string message;
    ConversionData? data?;
|};

public isolated function convertCurrency(decimal amount, string base, string target = "LKR") returns CurrencyResponse|error {
    string path = string `/api/rates/latest/${base}?target=${target}`;

    json response = check currencyClient->get(path);
    int statusCode = check response.status_code;

    if statusCode != 200 {
        return {
            success: false,
            message: "Failed to get exchange rate"
        };
    }

    json data = check response.data;
    decimal rate = check data.mid;
    decimal result = amount * rate;

    return {
        success: true,
        message: "Currency conversion successful",
        data: {
            amount: amount,
            base: check data.base,
            target: check data.target,
            rate: rate,
            result: result,
            timestamp: check data.timestamp
        }
    };
}
