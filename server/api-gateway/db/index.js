import Pool from "pg-pool";
import { getDBConnectionConfig } from "../configs/envConfig.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

const env = process.env.NODE_ENV;
const poolConfig = getDBConnectionConfig(env);

export const userDBPool = new Pool(poolConfig);

export const testDBConnection = async () => {
  try {
    const result = await userDBPool.query("SELECT 1");
    if (result) {
      console.log("Connection to database successful");
    }
  } catch (error) {
    throw new ErrorResponse({
      message: "Fehler bei der Verbindung zur Datenbank.",
      statusCode: 500,
      errorType: "DatabaseError",
      errorCode: "DB_001",
    });
  }
};
