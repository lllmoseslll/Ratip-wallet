import dotenv from "dotenv";
dotenv.config();

import { neon } from "@neondatabase/serverless";


if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in your environment variables.");
}

export const sql = neon(process.env.DATABASE_URL);
