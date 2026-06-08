const mysql = require('mysql2');
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error("❌ DB CONNECT ERROR:", err.message);
  } else {
    console.log("✅ DB CONNECTED");
    conn.release();
  }
});

module.exports = pool.promise();