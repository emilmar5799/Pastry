"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
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
        const hashed = await bcrypt_1.default.hash('password123', 10);
        await connection.query('INSERT INTO users (first_name, last_name, email, password, role, salary) VALUES (?, ?, ?, ?, ?, ?)', ['Test', 'Admin', 'test@test.com', hashed, 'ADMIN', 5000]);
        console.log('Inserted test admin user (test@test.com / password123)');
        process.exit(0);
    }
    catch (error) {
        console.error('Error inserting user:', error);
        process.exit(1);
    }
}
run();
