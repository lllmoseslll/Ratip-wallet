import dotenv from "dotenv";
dotenv.config();

import { neon } from "@neondatabase/serverless";


if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in your environment variables.");
}

export const sql = neon(process.env.DATABASE_URL);


async function initDB() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS transactions (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          title VARCHAR(255) NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          category VARCHAR(50) NOT NULL,
          created_at DATE NOT NULL DEFAULT CURRENT_DATE
        );
      `;

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

export default initDB;