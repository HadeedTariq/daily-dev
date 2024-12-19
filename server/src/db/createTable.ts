import { queryDb } from "@/db/connect";

// Function to connect to the database and create the table
export const createTable = async (createTableQuery: string) => {
  try {
    // Execute the query
    await queryDb(createTableQuery);
    console.log("Table  created successfully");
  } catch (err) {
    console.error("Error creating table:", err);
  }
};

// Call the function to create the table
