import { env } from "@/common/utils/envConfig";
import { Pool } from "pg";

const pool = new Pool({
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

export const runDependentTransaction = async (
  queries: {
    query: string;
    params: any[];
  }[]
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const q of queries) {
      await client.query(q.query, q.params);
    }

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
