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

    const [rows]: any = await connection.query('SELECT * FROM branches WHERE name = ?', ['pastryflora 8']);
    if (rows.length > 0) {
      console.log('Sucursales ya existen. Omitiendo inserción.');
      process.exit(0);
    }

    await connection.query(
      'INSERT INTO branches (name, address) VALUES (?, ?)',
      ['pastryflora 8', 'Dirección sucursal 8']
    );
    
    await connection.query(
      'INSERT INTO branches (name, address) VALUES (?, ?)',
      ['PastryFlra 13', 'Dirección sucursal 13']
    );
    
    console.log('Sucursales insertadas con exito.');
    process.exit(0);
  } catch (error) {
    console.error('Error al insertar sucursales:', error);
    process.exit(1);
  }
}
run();
