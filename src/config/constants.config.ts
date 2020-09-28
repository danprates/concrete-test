import { config } from 'dotenv';

config();

export const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_USER = 'docker',
  DB_PASS = 'docker',
  DB_NAME = 'concrete',
  ENCRIPTION_SALT = 'salt',
  JWT_SECRET = 'secret',
} = process.env;
