import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["audio-only", "audio-video"],
      default: "audio-video",
    },
    ownerId: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    participants: [
      {
        userId: String,
        joinedAt: Date,
        leftAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
