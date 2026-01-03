const mysql = require('mysql2/promise');
require('dotenv').config();

// Only create pool if database credentials are provided
let pool = null;

if (process.env.DB_HOST && process.env.DB_NAME) {
  try {
    // Create connection pool
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'fms_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    pool.getConnection()
      .then(connection => {
        console.log('✓ Database connected successfully');
        connection.release();
      })
      .catch(err => {
        console.error('✗ Database connection failed:', err.message);
        console.log('⚠ Falling back to in-memory storage');
      });
  } catch (error) {
    console.error('✗ Could not create database pool:', error.message);
    console.log('⚠ Using in-memory storage');
  }
} else {
  console.log('⚠ Database not configured - using in-memory storage');
}

module.exports = pool;