import { pool } from './config/db';
import { initSql } from  "./config/init" // Imported as a TS variable!

const initDatabase = async () => {
  try {
    // Direct execute, no file reading needed
    await pool.query(initSql);
    console.log('✅ Database schema initialized successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize database schema:', error);
    throw error;
  }
};

const startServer = async () => {
  try {
    // Test connection
    const res = await pool.query('SELECT NOW() as current_time');
    console.log(`⏰ Database Time: ${res.rows[0].current_time}`);
    
    // Initialize tables
    await initDatabase();
    
    console.log(`🚀 Auth Service DB Layer is READY! (Port configured for ${process.env.PORT})`);
  } catch (error) {
    console.error('Failed to start Auth Service DB Layer:', error);
    process.exit(1);
  }
};

startServer();