import dotenv from 'dotenv'; dotenv.config();
import pg from 'pg';

const { Pool } = pg;

export const clientpg = new Pool({
    connectionString: process.env.DATABASE_URL,
  });