const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Connect to MongoDB if not already connected
if (mongoose.connection.readyState !== 1) {
  mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/recordstudio"
  );
}

// Define Recording model directly in this file for CommonJS
const recordingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerId: { type: String, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    participants: [{ userId: String, name: String }],
    duration: { type: Number, default: 0 },
    fileUrl: String,
    thumbnailUrl: String,
    fileSize: String,
    status: {
      type: String,
      enum: ["pending", "processing", "ready", "error"],
      default: "pending",
    },
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Use model or create if it doesn't exist
const Recording =
  mongoose.models.Recording || mongoose.model("Recording", recordingSchema);

const TEMP_DIR = path.join(__dirname, "../../temp");
const STORAGE_DIR = path.join(__dirname, "../../storage");

// Ensure directories exist
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Process a raw recording
async function processRecording(recordingId, rawFilePath) {
  try {
    // Update recording status
    await Recording.findByIdAndUpdate(recordingId, {
      status: "processing",
      progress: 10,
    });

    // 1. Generate a thumbnail from the video
    const thumbnailPath = await generateThumbnail(rawFilePath);
    await Recording.findByIdAndUpdate(recordingId, { progress: 30 });

    // 2. Convert video to standard format
    const processedFilePath = await convertVideo(rawFilePath);
    await Recording.findByIdAndUpdate(recordingId, { progress: 60 });

    // 3. Copy files to storage directory
    const storagePath = path.join(STORAGE_DIR, recordingId);
    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath, { recursive: true });
    }

    const fileDestination = path.join(
      storagePath,
      path.basename(processedFilePath)
    );
    const thumbnailDestination = path.join(
      storagePath,
      path.basename(thumbnailPath)
    );

    fs.copyFileSync(processedFilePath, fileDestination);
    fs.copyFileSync(thumbnailPath, thumbnailDestination);

    // 4. Update recording with file paths (relative to storage dir for security)
    const fileUrl = `/api/recordings/${recordingId}/download`;
    const thumbnailUrl = `/api/recordings/${recordingId}/thumbnail`;

    await Recording.findByIdAndUpdate(recordingId, {
      status: "ready",
      progress: 100,
      fileUrl,
      thumbnailUrl,
      fileSize: getFileSize(processedFilePath),
      updatedAt: new Date(),
    });

    // 5. Clean up temporary files
    fs.unlinkSync(rawFilePath);
    fs.unlinkSync(processedFilePath);
    fs.unlinkSync(thumbnailPath);

    console.log(`Successfully processed recording: ${recordingId}`);
    return { success: true };
  } catch (error) {
    console.error(`Error processing recording ${recordingId}:`, error);

    // Update recording with error status
    await Recording.findByIdAndUpdate(recordingId, {
      status: "error",
      progress: 0,
      updatedAt: new Date(),
    });

    return { success: false, error };
  }
}

// Generate thumbnail from video
function generateThumbnail(videoPath) {
  return new Promise((resolve, reject) => {
    const thumbnailPath = path.join(TEMP_DIR, `thumbnail-${Date.now()}.jpg`);

    const ffmpeg = spawn("ffmpeg", [
      "-i",
      videoPath,
      "-ss",
      "00:00:05", // Take screenshot at 5 seconds
      "-frames:v",
      "1",
      thumbnailPath,
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve(thumbnailPath);
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });

    ffmpeg.stderr.on("data", (data) => {
      console.log(`FFmpeg stderr: ${data}`);
    });
  });
}

// Convert video to standard format (MP4 with H.264 codec)
function convertVideo(videoPath) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(TEMP_DIR, `processed-${Date.now()}.mp4`);

    const ffmpeg = spawn("ffmpeg", [
      "-i",
      videoPath,
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      outputPath,
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });

    ffmpeg.stderr.on("data", (data) => {
      console.log(`FFmpeg stderr: ${data}`);
    });
  });
}

// Get file size in MB
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats.size;
  const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
  return `${fileSizeInMB.toFixed(2)}MB`;
}

module.exports = {
  processRecording,
};
