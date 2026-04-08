import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306
    });

    const [rows]: any = await connection.query('SELECT * FROM users WHERE email = ?', ['test@test.com']);
    if (rows.length > 0) {
      console.log('Test user already exists. Skipping insertion.');
      process.exit(0);
    }

    const hashed = await bcrypt.hash('password123', 10);
    
    await connection.query(
      'INSERT INTO users (first_name, last_name, email, password, role, salary) VALUES (?, ?, ?, ?, ?, ?)',
      ['Test', 'Admin', 'test@test.com', hashed, 'ADMIN', 5000]
    );
    console.log('Inserted test admin user (test@test.com / password123)');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting user:', error);
    process.exit(1);
  }
}
run();
