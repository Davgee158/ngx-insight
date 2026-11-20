import "server-only";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL_POOLED;

if (!databaseUrl) {
  throw new Error("DATABASE_URL_POOLED is not set");
}

export const sql = neon(databaseUrl);