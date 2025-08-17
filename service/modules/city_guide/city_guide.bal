import ballerina/http;

configurable string perplexityApiKey = ?;

final http:Client perplexityClient = check new ("https://api.perplexity.ai",
    config = {
        timeout: 30
    }
);

public isolated function askAnything(string userMessage) returns CityGuideResponse|error {
    PerplexityRequest requestPayload = {
        model: "sonar-pro",
        messages: [
            {
                role: "system",
                content: "Be precise and concise."
            },
            {
                role: "user",
                content: userMessage
            }
        ]
    };

    map<string|string[]> headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": "Bearer " + perplexityApiKey
    };

    json|error response = perplexityClient->post(path = "/chat/completions",
        message = requestPayload,
        headers = headers);

    if response is error {
        return {
            success: false,
            message: "Failed to get response from Perplexity AI: " + response.message()
        };
    }

    // First extract the choices array directly from JSON
    json|error choicesJson = response.choices;
    if choicesJson is error {
        return {
            success: false,
            message: "Invalid response format: missing choices array"
        };
    }

    json[]|error choicesArray = choicesJson.ensureType();
    if choicesArray is error {
        return {
            success: false,
            message: "Invalid response format: choices is not an array"
        };
    }

    if choicesArray.length() == 0 {
        return {
            success: false,
            message: "No response received from Perplexity AI"
        };
    }

    // Extract the message content from the first choice
    json firstChoice = choicesArray[0];
    json|error messageJson = firstChoice.message;
    if messageJson is error {
        return {
            success: false,
            message: "Invalid response format: missing message in choice"
        };
    }

    json|error contentJson = messageJson.content;
    if contentJson is error {
        return {
            success: false,
            message: "Invalid response format: missing content in message"
        };
    }

    string|error aiResponse = contentJson.ensureType();
    if aiResponse is error {
        return {
            success: false,
            message: "Invalid response format: content is not a string"
        };
    }

    return {
        success: true,
        message: "Chat response generated successfully",
        response: aiResponse
    };
}

