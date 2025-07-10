import ballerina/sql;
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;

configurable string dbHost = ?;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable int dbPort = ?;
configurable string dbName = ?;

public final postgresql:Client dbClient = check new (
    host = dbHost,
    username = dbUser,
    password = dbPassword,
    port = dbPort,
    database = dbName
);

public function closeDbConnection() returns sql:Error? {
    return dbClient.close();
}
