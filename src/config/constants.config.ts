import { config } from 'dotenv';

config();

export const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_USER = 'docker',
  DB_PASS = 'docker',
  DB_NAME = 'concrete',
} = process.env;
