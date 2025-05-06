import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// This would connect to your database in a real app
// Mock data for demonstration
const recordings = [
  {
    id: "rec-1",
    roomName: "Weekly Podcast",
    userId: "user123",
    date: new Date("2023-10-15").toISOString(),
    duration: 3720, // in seconds
    status: "ready",
    participants: [
      { id: "user-1", name: "You (Host)" },
      { id: "user-2", name: "John Smith" },
      { id: "user-3", name: "Sarah Johnson" },
    ],
    fileSize: "256MB",
    url: "https://example.com/download/recording.mp4",
    tracks: [
      {
        id: "track-1",
        participantName: "You (Host)",
        url: "https://example.com/download/track-1.mp4",
      },
      {
        id: "track-2",
        participantName: "John Smith",
        url: "https://example.com/download/track-2.mp4",
      },
      {
        id: "track-3",
        participantName: "Sarah Johnson",
        url: "https://example.com/download/track-3.mp4",
      },
    ],
  },
];

export async function GET(request, { params }) {
  const { recordingId } = params;
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the recording
  const recording = recordings.find((rec) => rec.id === recordingId);

  if (!recording) {
    return NextResponse.json({ error: "Recording not found" }, { status: 404 });
  }

  // Verify ownership (in a real app)
  if (recording.userId !== "user123") {
    // For demo, hardcoded
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.json(recording);
}
