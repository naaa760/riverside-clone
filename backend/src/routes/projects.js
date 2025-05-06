import express from "express";
import { auth } from "../middleware/auth.js";
import Project from "../models/Project.js";
import Recording from "../models/Recording.js";

const router = express.Router();

// Get all projects for a user
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      "collaborators.userId": req.user.clerkId,
    }).sort({ updatedAt: -1 });

    // Get recording counts for each project
    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        const recordingsCount = await Recording.countDocuments({
          projectId: project._id,
        });
        const recordings = await Recording.find({ projectId: project._id })
          .sort({ createdAt: -1 })
          .limit(1);

        return {
          ...project.toObject(),
          episodes: recordingsCount,
          recentRecording: recordings[0] || null,
        };
      })
    );

    res.json(projectsWithDetails);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Add other routes...

export default router;
