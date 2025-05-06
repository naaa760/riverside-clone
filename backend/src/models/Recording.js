import mongoose from "mongoose";

const recordingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    participants: [
      {
        userId: String,
        name: String,
      },
    ],
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    fileUrl: String,
    thumbnailUrl: String,
    fileSize: String,
    status: {
      type: String,
      enum: ["pending", "processing", "ready", "error"],
      default: "pending",
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Recording", recordingSchema);
