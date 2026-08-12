import app from './app';
import { pool } from './config/db';
import { initSql } from './config/init';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4001;

const initDatabase = async () => {
  try {
    await pool.query(initSql);
    console.log('✅ Database schema initialized successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize database schema:', error);
    throw error;
  }
};

const startServer = async () => {
  try {
    // Test DB connection and create schema
    const res = await pool.query('SELECT NOW() as current_time');
    console.log(`⏰ Database Time: ${res.rows[0].current_time}`);
    await initDatabase();
    
    // Start Express Server
    app.listen(PORT, () => {
      console.log(`🚀 Auth Service is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start Auth Service:', error);
    process.exit(1);
  }
};

startServer();