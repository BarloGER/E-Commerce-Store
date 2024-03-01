import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { ErrorResponse } from "../utils/ErrorResponse.js";

export const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const testDBConnection = async () => {
  const command = new ListTablesCommand({});
  try {
    const results = await ddbClient.send(command);
    console.log("Connected to DynamoDB, tables:", results.TableNames);
  } catch (error) {
    console.error("Error connecting to DynamoDB", error);
    throw new ErrorResponse({
      message: "Fehler bei der Verbindung zur DynamoDB.",
      statusCode: 500,
      errorType: "DatabaseError",
      errorCode: "DB_001",
    });
  }
};
