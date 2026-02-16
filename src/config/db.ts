import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URI;

    if (!mongoUrl) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(mongoUrl);

    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
};

