import Pool from "pg-pool";
import { getDBConnectionConfig } from "../configs/envConfig.js";

const env = process.env.NODE_ENV;
const poolConfig = getDBConnectionConfig(env);

export const userDBPool = new Pool(poolConfig);
