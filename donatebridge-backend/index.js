import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import "dotenv/config";
import authRouter from "./routes/authRoutes.js";
import donationPostRouter from "./routes/donationPostRoutes.js";
import { log } from "./middlewares/logger.js";

const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected");
  } catch (err) {
    console.log(`Error connecting database ${err}`);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(log);

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/donation-posts", donationPostRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
