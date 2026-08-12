import app from "./app";
import { pool } from "./config/db";
import { initSql } from "./config/init";
import dotenv from "dotenv";
import { Server } from "http";

dotenv.config();

const PORT = process.env.PORT || 4001;
let server: Server;

// Database Initialization
const initDatabase = async () => {
  try {
    await pool.query(initSql);
    console.log("✅ Database schema verified/initialized successfully.");
  } catch (error) {
    console.error("❌ Failed to initialize database schema:", error);
    throw error;
  }
};

// Server Bootstrapper
const startServer = async () => {
  try {
    console.log("⏳ Starting Auth Service Boot sequence...");

    // 1. Verify Database connection & Schema
    const res = await pool.query("SELECT NOW() as current_time");
    console.log(`⏰ Database Time: ${res.rows[0].current_time}`);
    await initDatabase();

    // 2. Start Express Server
    server = app.listen(PORT, () => {
      console.log(
        `🚀 Auth Service is LIVE and listening on http://localhost:${PORT}`,
      );
      console.log(`🛡️  Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Fatal Error during server startup:", error);
    process.exit(1);
  }
};

// Execute Startup
startServer();


const shutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Starting Graceful Shutdown...`);

  // 1. Stop accepting new HTTP requests
  if (server) {
    server.close(() => {
      console.log(
        "💤 Express server closed. No longer accepting new connections.",
      );
    });
  }

  // 2. Close PostgreSQL connection pool safely
  try {
    console.log("⏳ Closing PostgreSQL connection pool...");
    await pool.end();
    console.log("✅ PostgreSQL pool closed cleanly.");
    process.exit(0); // Exit successfully
  } catch (err) {
    console.error("❌ Error during database disconnection:", err);
    process.exit(1); // Exit with failure
  }
};

// Listen for OS Signals (Docker/Kubernetes termination signals)
process.on("SIGTERM", () => shutdown("SIGTERM")); // Termination signal
process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C in terminal

// Catch Uncaught Exceptions & Rejections (Safety Net)
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...", err);
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION! Shutting down...", err);
  shutdown("unhandledRejection");
});
