import express from "express";
import { auth } from "../middleware/auth.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

const router = express.Router();

// Get all rooms for a user
router.get("/", auth, async (req, res) => {
  try {
    // Find rooms where user is either owner or participant
    const rooms = await Room.find({
      $or: [
        { ownerId: req.user.clerkId },
        { "participants.userId": req.user.clerkId },
      ],
    }).sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// Get a specific room
router.get("/:id", auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if user has access
    const isOwner = room.ownerId === req.user.clerkId;
    const isParticipant = room.participants.some(
      (p) => p.userId === req.user.clerkId
    );

    if (!isOwner && !isParticipant) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ error: "Failed to fetch room" });
  }
});

// Create a new room
router.post("/", auth, async (req, res) => {
  try {
    const { name, type, projectId } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Room name is required" });
    }

    const room = new Room({
      name,
      type: type || "audio-video",
      ownerId: req.user.clerkId,
      projectId: projectId || null,
      participants: [
        {
          userId: req.user.clerkId,
          joinedAt: new Date(),
        },
      ],
    });

    await room.save();

    // Generate a join URL
    const joinUrl = `${process.env.FRONTEND_URL}/room/${room._id}`;

    res.status(201).json({
      ...room.toObject(),
      joinUrl,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// Update a room
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Only owner can update
    if (room.ownerId !== req.user.clerkId) {
      return res
        .status(403)
        .json({ error: "Only the owner can update the room" });
    }

    if (name) room.name = name;
    if (isActive !== undefined) room.isActive = isActive;

    await room.save();
    res.json(room);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "Failed to update room" });
  }
});

// Delete a room
router.delete("/:id", auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Only owner can delete
    if (room.ownerId !== req.user.clerkId) {
      return res
        .status(403)
        .json({ error: "Only the owner can delete the room" });
    }

    await Room.deleteOne({ _id: req.params.id });
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

// Add a participant to a room
router.post("/:id/participants", auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Validate user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }

    // Check if user is already a participant
    const isAlreadyParticipant = room.participants.some(
      (p) => p.userId === userId && !p.leftAt
    );

    if (isAlreadyParticipant) {
      return res.status(400).json({ error: "User is already a participant" });
    }

    // Add participant
    room.participants.push({
      userId,
      joinedAt: new Date(),
    });

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    console.error("Error adding participant:", error);
    res.status(500).json({ error: "Failed to add participant" });
  }
});

export default router;
