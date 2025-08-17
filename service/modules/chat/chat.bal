import 'service.utils;

import ballerina/log;
import ballerina/sql;
import ballerina/time;
import ballerina/uuid;
import ballerina/websocket;

// active websocket connection ( meetupId)
map<websocket:Caller[]> meetupConnections = {};

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
            self.removeConnection(self.meetupId ?: "", caller);
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

        self.meetupId = joinMessage.meetupId;
        self.userId = joinMessage.userId;
        self.userName = joinMessage.userName;

        self.addConnection(joinMessage.meetupId, caller);

        string confirmationMessage = string `{"type":"joined","data":{"meetupId":"${joinMessage.meetupId}","message":"Successfully joined chat"}}`;
        check caller->writeTextMessage(confirmationMessage);

        log:printInfo(string `User ${joinMessage.userName} joined meetup ${joinMessage.meetupId} chat`);
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

        self.broadcastToMeetup(chatData.meetupId, savedMessage);
        return;
    }

    private function addConnection(string meetupId, websocket:Caller caller) {
        if meetupConnections.hasKey(meetupId) {
            websocket:Caller[] connections = meetupConnections.get(meetupId);
            connections.push(caller);
            meetupConnections[meetupId] = connections;
        } else {
            meetupConnections[meetupId] = [caller];
        }
    }

    private function removeConnection(string meetupId, websocket:Caller caller) {
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
}

public function saveChatMessage(ChatMessageData chatData) returns ChatMessage|error {
    string messageId = uuid:createType1AsString();
    string timestamp = time:utcNow().toString();

    utils:ChatMessageInsert messageInsert = {
        messageId: messageId,
        meetupId: chatData.meetupId,
        userId: chatData.userId,
        userName: chatData.userName,
        message: chatData.message,
        createdAt: timestamp
    };

    sql:ExecutionResult|sql:Error dbResult = utils:insertChatMessage(messageInsert);
    if dbResult is sql:Error {
        return error("Failed to save chat message: " + dbResult.message());
    }

    return {
        messageId: messageId,
        meetupId: chatData.meetupId,
        userId: chatData.userId,
        userName: chatData.userName,
        message: chatData.message,
        timestamp: timestamp
    };
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
            meetupId: msgRecord.meetup_id,
            userId: msgRecord.user_id,
            userName: msgRecord.user_name,
            message: msgRecord.message,
            timestamp: msgRecord.created_at
        };
        messages.push(message);
    }

    return {success: true, message: "Chat history fetched successfully", data: messages};
}
