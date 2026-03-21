import 'dotenv/config';
import { db } from '../config/database';
import { hashPassword } from '../utils/hash';

const run = async () => {
  console.log('🔎 Database connection config:');
  console.log({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    passwordLength: process.env.DB_PASSWORD?.length,
  });

  console.log('-------------------------------');

  const plainPassword = 'Admin123';
  console.log('🔐 Plain password:', plainPassword);

  const password = await hashPassword(plainPassword);
  console.log('🔐 Hashed password:', password);

  console.log('-------------------------------');
  console.log('👤 User data to insert:');
  console.log({
    first_name: 'Admin',
    last_name: 'Principal',
    email: 'admin@pastryflora.com',
    role: 'ADMIN',
  });

  await db.query(
    `INSERT INTO users (first_name, last_name, email, password, role)
     VALUES (?, ?, ?, ?, 'ADMIN')`,
    ['Admin', 'Principal', 'admin@pastryflora.com', password]
  );

  console.log('✅ Admin user created successfully');
  process.exit(0);
};

run().catch(err => {
  console.error('❌ Error running seed-admin:', err);
  process.exit(1);
});
