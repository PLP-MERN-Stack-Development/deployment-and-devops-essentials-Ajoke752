import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      // In development we allow running without a database to make local frontend/backend
      // integration easier. In production this should be set and the process should fail.
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "⚠️  MONGO_URI not set — skipping MongoDB connection in development"
        );
        return;
      }
      throw new Error("MONGO_URI is not defined");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    // Only exit in production — allow local dev to continue without DB
    if (process.env.NODE_ENV === "production") process.exit(1);
  }
};

export default connectDB;
