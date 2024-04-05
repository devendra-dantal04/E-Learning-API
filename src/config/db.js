import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

console.log(PGHOST);
// Database Connection
const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

export default sql;
