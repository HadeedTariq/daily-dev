import { env } from "@/common/utils/envConfig";
import { Pool } from "pg";

export const pool = new Pool({
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: false,
  },
});

export const queryDb = async (query: string, params: any[] = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
};

export const deleteUnverifiedUsers = async () => {
  try {
    // const query = `
    //   DELETE FROM users
    //   WHERE created_at < NOW() - INTERVAL '24 hours'
    //   AND is_verified = false;
    // `;
    const query = `
      DELETE FROM users
      WHERE email = $1;
    `;
    const result = await queryDb(query, ["hadeedtariq12@gmail.com"]);
    console.log(`Deleted ${result.rowCount} unverified users.`);
  } catch (error) {
    console.error("Error deleting unverified users:", error);
  }
};

export const runIndependentTransaction = async (
  queries: {
    query: string;
    params: any[];
  }[]
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await Promise.all(queries.map((q) => client.query(q.query, q.params)));

    await client.query("COMMIT");
    console.log("Transaction committed successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction failed and rolled back:", error);
    throw error;
  } finally {
    client.release();
    console.log("Database client released");
  }
};
