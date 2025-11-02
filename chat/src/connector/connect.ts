import mysql from "mysql2/promise";
import fs from "fs";

const dbName = "Meow"; // 👈 your database name

const baseConfig = {
  host: "student-mentor-protege-system.mysql.database.azure.com",
  user: "",
  password: "",
  port: 3306,
  ssl: {
    rejectUnauthorized: false,
    // ca: fs.readFileSync("./ssl/BaltimoreCyberTrustRoot.crt.pem"), // optional for Azure
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool: mysql.Pool | null = null;

export async function connectMaster(): Promise<mysql.Pool> {
  if (pool) return pool;

  // 1️⃣ Connect *without* selecting a DB
  const tempConnection = await mysql.createConnection(baseConfig);
  console.log("🌐 Connected to Azure MySQL (no DB yet)");

  // 2️⃣ Create DB if not exists
  await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  console.log(`✅ Database "${dbName}" is ready!`);

  await tempConnection.end();

  // 3️⃣ Now create pool *with* the DB
  pool = mysql.createPool({ ...baseConfig, database: dbName });
  const connection = await pool.getConnection();
  console.log(`📂 Connected to database "${dbName}"`);
  connection.release();

  return pool;
}
