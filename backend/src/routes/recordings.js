import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { auth } from "../middleware/auth.js";
import Recording from "../models/Recording.js";
import Room from "../models/Room.js";
import Project from "../models/Project.js";

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use dynamic import for CommonJS module
const processRecordingPromise = import("../services/recordingProcessor.cjs");

const router = express.Router();
const STORAGE_DIR = path.join(__dirname, "../../storage");

// Get all recordings for a user
router.get("/", auth, async (req, res) => {
  try {
    // Find recordings where user is either owner or participant
    const recordings = await Recording.find({
      $or: [
        { ownerId: req.user.clerkId },
        { "participants.userId": req.user.clerkId },
      ],
    }).sort({ createdAt: -1 });

    res.json(recordings);
  } catch (error) {
    console.error("Error fetching recordings:", error);
    res.status(500).json({ error: "Failed to fetch recordings" });
  }
});

// Get a specific recording
router.get("/:id", auth, async (req, res) => {
  try {
    const recording = await Recording.findById(req.params.id);

    if (!recording) {
      res.status(404).json({ error: "Recording not found" });
      return;
    }

    // Check if user has access
    const isOwner = recording.ownerId === req.user.clerkId;
    const isParticipant = recording.participants.some(
      (p) => p.userId === req.user.clerkId
    );

    if (!isOwner && !isParticipant) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    res.json(recording);
  } catch (error) {
    console.error("Error fetching recording:", error);
    res.status(500).json({ error: "Failed to fetch recording" });
  }
});

// Download a recording
router.get("/:id/download", auth, async (req, res) => {
  try {
    const recording = await Recording.findById(req.params.id);

    if (!recording) {
      res.status(404).json({ error: "Recording not found" });
      return;
    }

    // Check if user has access
    const isOwner = recording.ownerId === req.user.clerkId;
    const isParticipant = recording.participants.some(
      (p) => p.userId === req.user.clerkId
    );

    if (!isOwner && !isParticipant) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    // Get the recording file path
    const recordingDir = path.join(STORAGE_DIR, recording._id.toString());
    const files = fs
      .readdirSync(recordingDir)
      .filter((file) => file.startsWith("processed-") && file.endsWith(".mp4"));

    if (files.length === 0) {
      res.status(404).json({ error: "Recording file not found" });
      return;
    }

    const filePath = path.join(recordingDir, files[0]);
    res.download(filePath, `${recording.name}.mp4`);
  } catch (error) {
    console.error("Error downloading recording:", error);
    res.status(500).json({ error: "Failed to download recording" });
  }
});

// Get recording thumbnail
router.get("/:id/thumbnail", auth, async (req, res) => {
  try {
    const recording = await Recording.findById(req.params.id);

    if (!recording) {
      res.status(404).json({ error: "Recording not found" });
      return;
    }

    // Check if user has access
    const isOwner = recording.ownerId === req.user.clerkId;
    const isParticipant = recording.participants.some(
      (p) => p.userId === req.user.clerkId
    );

    if (!isOwner && !isParticipant) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    // Get the thumbnail file path
    const recordingDir = path.join(STORAGE_DIR, recording._id.toString());
    const files = fs
      .readdirSync(recordingDir)
      .filter((file) => file.startsWith("thumbnail-") && file.endsWith(".jpg"));

    if (files.length === 0) {
      res.status(404).json({ error: "Thumbnail not found" });
      return;
    }

    const filePath = path.join(recordingDir, files[0]);
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error fetching thumbnail:", error);
    res.status(500).json({ error: "Failed to fetch thumbnail" });
  }
});

// Create a new recording
router.post("/", auth, async (req, res) => {
  try {
    const { name, roomId, projectId, participants, duration } = req.body;

    // Validate room if provided
    if (roomId) {
      const room = await Room.findById(roomId);
      if (!room) {
        res.status(400).json({ error: "Invalid room" });
        return;
      }
    }

    // Validate project if provided
    if (projectId) {
      const project = await Project.findById(projectId);
      if (!project) {
        res.status(400).json({ error: "Invalid project" });
        return;
      }

      // Check if user has access to the project
      const hasAccess = project.collaborators.some(
        (c) => c.userId === req.user.clerkId
      );
      if (!hasAccess) {
        res.status(403).json({ error: "Access denied to this project" });
        return;
      }
    }

    // Create recording document
    const recording = new Recording({
      name: name || `Recording ${new Date().toLocaleTimeString()}`,
      roomId,
      projectId,
      ownerId: req.user.clerkId,
      participants: participants || [
        { userId: req.user.clerkId, name: req.user.firstName },
      ],
      duration: duration || 0,
      status: "processing",
      progress: 0,
    });

    await recording.save();
    res.status(201).json(recording);
  } catch (error) {
    console.error("Error creating recording:", error);
    res.status(500).json({ error: "Failed to create recording" });
  }
});

// Update a recording
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, projectId } = req.body;
    const recording = await Recording.findById(req.params.id);

    if (!recording) {
      res.status(404).json({ error: "Recording not found" });
      return;
    }

    // Only owner can update
    if (recording.ownerId !== req.user.clerkId) {
      res
        .status(403)
        .json({ error: "Only the owner can update the recording" });
      return;
    }

    // Update fields
    if (name) recording.name = name;

    if (projectId) {
      // Validate project if changed
      const project = await Project.findById(projectId);
      if (!project) {
        res.status(400).json({ error: "Invalid project" });
        return;
      }

      // Check if user has access to the project
      const hasAccess = project.collaborators.some(
        (c) => c.userId === req.user.clerkId
      );
      if (!hasAccess) {
        res.status(403).json({ error: "Access denied to this project" });
        return;
      }

      recording.projectId = projectId;
    }

    recording.updatedAt = new Date();
    await recording.save();

    res.json(recording);
  } catch (error) {
    console.error("Error updating recording:", error);
    res.status(500).json({ error: "Failed to update recording" });
  }
});

// Delete a recording
router.delete("/:id", auth, async (req, res) => {
  try {
    const recording = await Recording.findById(req.params.id);

    if (!recording) {
      res.status(404).json({ error: "Recording not found" });
      return;
    }

    // Only owner can delete
    if (recording.ownerId !== req.user.clerkId) {
      res
        .status(403)
        .json({ error: "Only the owner can delete the recording" });
      return;
    }

    // Delete the recording document
    await Recording.deleteOne({ _id: req.params.id });

    // Delete the recording files if they exist
    const recordingDir = path.join(STORAGE_DIR, recording._id.toString());
    if (fs.existsSync(recordingDir)) {
      fs.rmSync(recordingDir, { recursive: true, force: true });
    }

    res.json({ message: "Recording deleted successfully" });
  } catch (error) {
    console.error("Error deleting recording:", error);
    res.status(500).json({ error: "Failed to delete recording" });
  }
});

// Upload recording data endpoint
router.post("/upload", auth, async (req, res) => {
  // Typically we'd integrate with a file upload library like multer here
  // For now we'll return a success response
  res.json({
    success: true,
    message: "Upload endpoint ready",
    uploadUrl: `/api/recordings/upload/${Date.now()}`,
  });
});

// Process a recording
router.post("/process/:id", auth, async (req, res) => {
  try {
    const recordingId = req.params.id;
    const rawFilePath = req.body.filePath;

    // Instead of directly calling processRecording, use:
    const { processRecording } = await processRecordingPromise;
    const result = await processRecording(recordingId, rawFilePath);

    res.json(result);
  } catch (error) {
    console.error("Error processing recording:", error);
    res.status(500).json({ error: "Failed to process recording" });
  }
});

export default router;
