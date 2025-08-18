import 'service.utils;

import ballerina/log;
import ballerina/sql;
import ballerina/time;
import ballerina/uuid;
import ballerina/websocket;

// active websocket connections
map<websocket:Caller[]> meetupConnections = {};
map<websocket:Caller[]> cityConnections = {};

listener websocket:Listener chatListener = new (9090);

service /chat on chatListener {
    resource function get .() returns websocket:Service|websocket:UpgradeError {
        log:printInfo("WebSocket upgrade request received for /chat/");
        return new ChatWebSocketService();
    }
}

service class ChatWebSocketService {
    *websocket:Service;
    private string? meetupId = ();
    private string? cityId = ();
    private string? userId = ();
    private string? userName = ();

    public function init() {
    }

    remote function onOpen(websocket:Caller caller) returns websocket:Error? {
        log:printInfo("WebSocket connection opened successfully");
        return;
    }

    remote function onTextMessage(websocket:Caller caller, string text) returns websocket:Error? {
        log:printInfo("Received message: " + text);

        json|error messageJson = text.fromJsonString();
        if messageJson is error {
            log:printError("Invalid JSON message: " + messageJson.message());
            return;
        }

        WebSocketMessage|error wsMessage = messageJson.cloneWithType();
        if wsMessage is error {
            log:printError("Invalid message format: " + wsMessage.message());
            return;
        }

        if wsMessage.'type == "join" {
            check self.handleJoinRoom(caller, wsMessage.data);
        } else if wsMessage.'type == "message" {
            check self.handleChatMessage(caller, wsMessage.data);
        }

        return;
    }

    remote function onClose(websocket:Caller caller, int statusCode, string reason) returns websocket:Error? {
        if self.meetupId is string {
            self.removeMeetupConnection(self.meetupId ?: "", caller);
        }
        if self.cityId is string {
            self.removeCityConnection(self.cityId ?: "", caller);
        }
        log:printInfo("WebSocket connection closed with status: " + statusCode.toString());
        return;
    }

    remote function onError(websocket:Caller caller, websocket:Error err) returns websocket:Error? {
        log:printError("WebSocket error: " + err.message());
        return;
    }

    private function handleJoinRoom(websocket:Caller caller, json data) returns websocket:Error? {
        JoinRoomMessage|error joinMessage = data.cloneWithType();
        if joinMessage is error {
            log:printError("Invalid join message: " + joinMessage.message());
            return;
        }

        self.userId = joinMessage.userId;
        self.userName = joinMessage.userName;

        if joinMessage.meetupId is string {
            self.meetupId = joinMessage.meetupId;
            self.addMeetupConnection(joinMessage.meetupId ?: "", caller);
            string confirmationMessage = string `{"type":"joined","data":{"meetupId":"${joinMessage.meetupId ?: ""}","message":"Successfully joined meetup chat"}}`;
            check caller->writeTextMessage(confirmationMessage);
            log:printInfo(string `User ${joinMessage.userName} joined meetup ${joinMessage.meetupId ?: ""} chat`);
        } else if joinMessage.cityId is string {
            self.cityId = joinMessage.cityId;
            self.addCityConnection(joinMessage.cityId ?: "", caller);
            string confirmationMessage = string `{"type":"joined","data":{"cityId":"${joinMessage.cityId ?: ""}","message":"Successfully joined city chat"}}`;
            check caller->writeTextMessage(confirmationMessage);
            log:printInfo(string `User ${joinMessage.userName} joined city ${joinMessage.cityId ?: ""} chat`);
        }

        return;
    }

    private function handleChatMessage(websocket:Caller caller, json data) returns websocket:Error? {
        ChatMessageData|error chatData = data.cloneWithType();
        if chatData is error {
            log:printError("Invalid chat message: " + chatData.message());
            return;
        }
        ChatMessage|error savedMessage = saveChatMessage(chatData);
        if savedMessage is error {
            log:printError("Failed to save chat message: " + savedMessage.message());
            return;
        }

        if chatData.meetupId is string {
            self.broadcastToMeetup(chatData.meetupId ?: "", savedMessage);
        } else if chatData.cityId is string {
            self.broadcastToCity(chatData.cityId ?: "", savedMessage);
        }
        return;
    }

    private function addMeetupConnection(string meetupId, websocket:Caller caller) {
        if meetupConnections.hasKey(meetupId) {
            websocket:Caller[] connections = meetupConnections.get(meetupId);
            connections.push(caller);
            meetupConnections[meetupId] = connections;
        } else {
            meetupConnections[meetupId] = [caller];
        }
    }

    private function removeMeetupConnection(string meetupId, websocket:Caller caller) {
        if meetupConnections.hasKey(meetupId) {
            websocket:Caller[] connections = meetupConnections.get(meetupId);
            websocket:Caller[] updatedConnections = [];

            foreach websocket:Caller conn in connections {
                if conn !== caller {
                    updatedConnections.push(conn);
                }
            }

            if updatedConnections.length() > 0 {
                meetupConnections[meetupId] = updatedConnections;
            } else {
                _ = meetupConnections.remove(meetupId);
            }
        }
    }

    private function addCityConnection(string cityId, websocket:Caller caller) {
        if cityConnections.hasKey(cityId) {
            websocket:Caller[] connections = cityConnections.get(cityId);
            connections.push(caller);
            cityConnections[cityId] = connections;
        } else {
            cityConnections[cityId] = [caller];
        }
    }

    private function removeCityConnection(string cityId, websocket:Caller caller) {
        if cityConnections.hasKey(cityId) {
            websocket:Caller[] connections = cityConnections.get(cityId);
            websocket:Caller[] updatedConnections = [];

            foreach websocket:Caller conn in connections {
                if conn !== caller {
                    updatedConnections.push(conn);
                }
            }

            if updatedConnections.length() > 0 {
                cityConnections[cityId] = updatedConnections;
            } else {
                _ = cityConnections.remove(cityId);
            }
        }
    }

    private function broadcastToMeetup(string meetupId, ChatMessage message) {
        if meetupConnections.hasKey(meetupId) {
            websocket:Caller[] connections = meetupConnections.get(meetupId);
            string messageJson = string `{"type":"message","data":${message.toJsonString()}}`;

            foreach websocket:Caller conn in connections {
                var result = conn->writeTextMessage(messageJson);
                if result is websocket:Error {
                    log:printError("Failed to send message to client: " + result.message());
                }
            }
        }
    }

    private function broadcastToCity(string cityId, ChatMessage message) {
        if cityConnections.hasKey(cityId) {
            websocket:Caller[] connections = cityConnections.get(cityId);
            string messageJson = string `{"type":"message","data":${message.toJsonString()}}`;

            foreach websocket:Caller conn in connections {
                var result = conn->writeTextMessage(messageJson);
                if result is websocket:Error {
                    log:printError("Failed to send message to client: " + result.message());
                }
            }
        }
    }
}

public function saveChatMessage(ChatMessageData chatData) returns ChatMessage|error {
    string messageId = uuid:createType1AsString();
    string timestamp = time:utcNow().toString();

    if chatData.meetupId is string {
        // Save to meetup chat table
        string meetupIdVal = <string>chatData.meetupId;
        utils:ChatMessageInsert messageInsert = {
            messageId: messageId,
            meetupId: meetupIdVal,
            userId: chatData.userId,
            userName: chatData.userName,
            message: chatData.message,
            createdAt: timestamp
        };

        sql:ExecutionResult|sql:Error dbResult = utils:insertChatMessage(messageInsert);
        if dbResult is sql:Error {
            return error("Failed to save meetup chat message: " + dbResult.message());
        }

        return {
            messageId: messageId,
            meetupId: meetupIdVal,
            userId: chatData.userId,
            userName: chatData.userName,
            message: chatData.message,
            timestamp: timestamp
        };
    } else if chatData.cityId is string {
        // Save to city chat table
        string cityIdVal = <string>chatData.cityId;
        utils:CityChatMessageInsert messageInsert = {
            messageId: messageId,
            cityId: cityIdVal,
            userId: chatData.userId,
            userName: chatData.userName,
            message: chatData.message,
            createdAt: timestamp
        };

        sql:ExecutionResult|sql:Error dbResult = utils:insertCityChatMessage(messageInsert);
        if dbResult is sql:Error {
            return error("Failed to save city chat message: " + dbResult.message());
        }

        return {
            messageId: messageId,
            cityId: cityIdVal,
            userId: chatData.userId,
            userName: chatData.userName,
            message: chatData.message,
            timestamp: timestamp
        };
    }

    return error("Invalid chat data: neither meetupId nor cityId provided");
}

public isolated function getChatHistory(string meetupId) returns ChatHistoryResponse|error {
    utils:ChatMessageRecord[]|sql:Error dbResult = utils:getChatMessagesByMeetupId(meetupId);
    if dbResult is sql:Error {
        return {success: false, message: "Failed to fetch chat history: " + dbResult.message()};
    }

    ChatMessage[] messages = [];
    foreach utils:ChatMessageRecord msgRecord in dbResult {
        ChatMessage message = {
            messageId: msgRecord.message_id,
            meetupId: msgRecord?.meetup_id,
            userId: msgRecord.user_id,
            userName: msgRecord.user_name,
            message: msgRecord.message,
            timestamp: msgRecord.created_at
        };
        messages.push(message);
    }

    return {success: true, message: "Chat history fetched successfully", data: messages};
}

public isolated function getCityChatHistory(string cityId) returns ChatHistoryResponse|error {
    utils:CityChatMessageRecord[]|sql:Error dbResult = utils:getCityChatMessagesByCityId(cityId);
    if dbResult is sql:Error {
        return {success: false, message: "Failed to fetch city chat history: " + dbResult.message()};
    }

    ChatMessage[] messages = [];
    foreach utils:CityChatMessageRecord msgRecord in dbResult {
        ChatMessage message = {
            messageId: msgRecord.message_id,
            cityId: msgRecord.city_id,
            userId: msgRecord.user_id,
            userName: msgRecord.user_name,
            message: msgRecord.message,
            timestamp: msgRecord.created_at
        };
        messages.push(message);
    }

    return {success: true, message: "City chat history fetched successfully", data: messages};
}
