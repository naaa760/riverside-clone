import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import routes
import projectRoutes from "./routes/projects.js";
import recordingRoutes from "./routes/recordings.js";
import roomRoutes from "./routes/rooms.js";
import scheduledRoutes from "./routes/scheduled.js";

// Import services
import { setupSignalingServer } from "./services/signalingServer.js";

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/recordstudio")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API routes
app.use("/api/projects", projectRoutes);
app.use("/api/recordings", recordingRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/scheduled", scheduledRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Setup WebRTC signaling server
const io = setupSignalingServer(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, server };
