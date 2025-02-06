import { queryDb } from "@/db/connect";

// Function to connect to the database and create the table
export const createTable = async (createTableQuery: string) => {
  try {
    // Execute the query
    // const {rows}=await queryDb(createTableQuery);
    const { rows } = await queryDb(
      `
        SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;

      `
    );
    console.log(rows);

    console.log("Table  created successfully");
  } catch (err) {
    console.error("Error creating table:", err);
  }
};

// Call the function to create the table
