import mongoose from "mongoose";

const scheduledRecordingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    dateTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      default: 60,
    },
    hostId: {
      type: String,
      required: true,
    },
    participants: [
      {
        email: String,
        name: String,
        status: {
          type: String,
          enum: ["pending", "confirmed", "declined"],
          default: "pending",
        },
      },
    ],
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ScheduledRecording", scheduledRecordingSchema);
