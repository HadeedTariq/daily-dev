import { env } from "@/common/utils/envConfig";
import pg from "pg";

const config = {
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: false,
  },
};

export const connectToDb = () => {
  const client = new pg.Client(config);

  // Connect to the database
  client
    .connect()
    .then(() => console.log("Connected to the database successfully"))
    .catch((err) => console.error("Error connecting to the database:", err));

  return client;
};
