import express from "express";
import { auth } from "../middleware/auth.js";
import ScheduledRecording from "../models/ScheduledRecording.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import Room from "../models/Room.js";

const router = express.Router();

// Get all scheduled recordings for a user
router.get("/", auth, async (req, res) => {
  try {
    // Find scheduled recordings where user is either host or participant
    const scheduledRecordings = await ScheduledRecording.find({
      $or: [
        { hostId: req.user.clerkId },
        { "participants.email": req.user.email },
      ],
    }).sort({ dateTime: 1 });

    res.json(scheduledRecordings);
  } catch (error) {
    console.error("Error fetching scheduled recordings:", error);
    res.status(500).json({ error: "Failed to fetch scheduled recordings" });
  }
});

// Get a specific scheduled recording
router.get("/:id", auth, async (req, res) => {
  try {
    const scheduledRecording = await ScheduledRecording.findById(req.params.id);

    if (!scheduledRecording) {
      res.status(404).json({ error: "Scheduled recording not found" });
      return;
    }

    // Check if user has access
    const isHost = scheduledRecording.hostId === req.user.clerkId;
    const isParticipant = scheduledRecording.participants.some(
      (p) => p.email === req.user.email
    );

    if (!isHost && !isParticipant) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    res.json(scheduledRecording);
  } catch (error) {
    console.error("Error fetching scheduled recording:", error);
    res.status(500).json({ error: "Failed to fetch scheduled recording" });
  }
});

// Create a new scheduled recording
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, dateTime, duration, participants, projectId } =
      req.body;

    if (!title || !dateTime) {
      res.status(400).json({ error: "Title and date/time are required" });
      return;
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

    const scheduledRecording = new ScheduledRecording({
      title,
      description,
      dateTime,
      duration: duration || 60,
      hostId: req.user.clerkId,
      projectId,
      participants: participants || [],
      status: "scheduled",
    });

    await scheduledRecording.save();
    res.status(201).json(scheduledRecording);
  } catch (error) {
    console.error("Error creating scheduled recording:", error);
    res.status(500).json({ error: "Failed to create scheduled recording" });
  }
});

// Update a scheduled recording
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, dateTime, duration, participants, status } =
      req.body;
    const scheduledRecording = await ScheduledRecording.findById(req.params.id);

    if (!scheduledRecording) {
      res.status(404).json({ error: "Scheduled recording not found" });
      return;
    }

    // Only host can update
    if (scheduledRecording.hostId !== req.user.clerkId) {
      res.status(403).json({ error: "Only the host can update the recording" });
      return;
    }

    // Update fields
    if (title) scheduledRecording.title = title;
    if (description !== undefined) scheduledRecording.description = description;
    if (dateTime) scheduledRecording.dateTime = new Date(dateTime);
    if (duration) scheduledRecording.duration = duration;
    if (participants) scheduledRecording.participants = participants;
    if (status && ["scheduled", "completed", "cancelled"].includes(status)) {
      scheduledRecording.status = status;
    }

    await scheduledRecording.save();
    res.json(scheduledRecording);
  } catch (error) {
    console.error("Error updating scheduled recording:", error);
    res.status(500).json({ error: "Failed to update scheduled recording" });
  }
});

// Delete a scheduled recording
router.delete("/:id", auth, async (req, res) => {
  try {
    const scheduledRecording = await ScheduledRecording.findById(req.params.id);

    if (!scheduledRecording) {
      res.status(404).json({ error: "Scheduled recording not found" });
      return;
    }

    // Only host can delete
    if (scheduledRecording.hostId !== req.user.clerkId) {
      res.status(403).json({ error: "Only the host can delete the recording" });
      return;
    }

    await ScheduledRecording.deleteOne({ _id: req.params.id });
    res.json({ message: "Scheduled recording deleted successfully" });
  } catch (error) {
    console.error("Error deleting scheduled recording:", error);
    res.status(500).json({ error: "Failed to delete scheduled recording" });
  }
});

// Start a scheduled recording (creates a room)
router.post("/:id/start", auth, async (req, res) => {
  try {
    const scheduledRecording = await ScheduledRecording.findById(req.params.id);

    if (!scheduledRecording) {
      res.status(404).json({ error: "Scheduled recording not found" });
      return;
    }

    // Only host can start
    if (scheduledRecording.hostId !== req.user.clerkId) {
      res
        .status(403)
        .json({ error: "Only the host can start the scheduled recording" });
      return;
    }

    // Create a room for this scheduled recording
    const room = new Room({
      name: scheduledRecording.title,
      type: "audio-video",
      ownerId: req.user.clerkId,
      projectId: scheduledRecording.projectId,
      participants: [
        {
          userId: req.user.clerkId,
          joinedAt: new Date(),
        },
      ],
    });

    await room.save();

    // Update scheduled recording with room id and status
    scheduledRecording.roomId = room._id;
    scheduledRecording.status = "completed";
    await scheduledRecording.save();

    res.json({
      scheduledRecording,
      room,
      joinUrl: `${process.env.FRONTEND_URL}/room/${room._id}`,
    });
  } catch (error) {
    console.error("Error starting scheduled recording:", error);
    res.status(500).json({ error: "Failed to start scheduled recording" });
  }
});

// RSVP to a scheduled recording (for participants)
router.post("/:id/rsvp", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const scheduledRecording = await ScheduledRecording.findById(req.params.id);

    if (!scheduledRecording) {
      res.status(404).json({ error: "Scheduled recording not found" });
      return;
    }

    // Validate status
    if (!["confirmed", "declined"].includes(status)) {
      res
        .status(400)
        .json({ error: "Invalid status. Use 'confirmed' or 'declined'" });
      return;
    }

    // Find participant by email
    const participantIndex = scheduledRecording.participants.findIndex(
      (p) => p.email === req.user.email
    );

    if (participantIndex === -1) {
      res.status(404).json({
        error: "You are not a participant in this scheduled recording",
      });
      return;
    }

    // Update participant status
    scheduledRecording.participants[participantIndex].status = status;
    await scheduledRecording.save();

    res.json({
      message: `Successfully ${
        status === "confirmed" ? "accepted" : "declined"
      } the invitation`,
      scheduledRecording,
    });
  } catch (error) {
    console.error("Error responding to invitation:", error);
    res.status(500).json({ error: "Failed to respond to invitation" });
  }
});

export default router;
