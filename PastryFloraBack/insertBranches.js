"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function run() {
    try {
        const connection = await promise_1.default.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT) || 3306
        });
        await connection.query('INSERT INTO branches (name, address) VALUES (?, ?)', ['pastryflora 8', 'Dirección sucursal 8']);
        await connection.query('INSERT INTO branches (name, address) VALUES (?, ?)', ['PastryFlra 13', 'Dirección sucursal 13']);
        console.log('Sucursales insertadas con exito.');
        process.exit(0);
    }
    catch (error) {
        console.error('Error al insertar sucursales:', error);
        process.exit(1);
    }
}
run();
