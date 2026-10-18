import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config(); 

const connectDB = async () => {
  try {
    // process.env.MONGO_URI pulls the string from your .env file safely
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};

export default connectDB;
