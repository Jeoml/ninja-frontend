import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Make database optional for development/demo purposes
let client: ReturnType<typeof postgres> | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

if (process.env.POSTGRES_URL) {
  client = postgres(process.env.POSTGRES_URL);
  db = drizzle(client, { schema });
} else {
  console.warn('POSTGRES_URL environment variable is not set. Database operations will be disabled.');
}

export { client, db };
