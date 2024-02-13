import Pool from "pg-pool";

const baseConnectionString = process.env.PG_BASE_CONNECTIONSTRING;

export const userDBPool = new Pool({
  connectionString: `${baseConnectionString}/userDB`,
  ssl: {
    rejectUnauthorized: false,
  },
});
