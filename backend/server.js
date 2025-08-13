import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import resumeRouter from "./routes/resumeRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// CONNECT DB
connectDB();

app.use(express.json());

// Routes
app.use("/api/auth", userRouter);
app.use("/api/resume", resumeRouter);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, _path) => {
      res.set("Access-Control-Allow-Origin", "http://localhost:5173");
    },
  })
);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server listening
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
