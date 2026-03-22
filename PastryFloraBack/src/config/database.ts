import mysql from 'mysql2/promise';
import { env } from './env';

export const db = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+00:00' // Ensure mysql2 driver treats DB timestamps as UTC
});
