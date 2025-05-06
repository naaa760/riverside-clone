import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Mock data for demonstration
const recordings = [
  {
    id: "rec-1",
    roomName: "Weekly Podcast",
    userId: "user123",
    date: new Date("2023-10-15").toISOString(),
    duration: 3720, // in seconds
    status: "ready",
    participants: ["You", "John Smith", "Sarah Johnson"],
    fileSize: "256MB",
    url: "https://example.com/download/recording.mp4",
  },
  {
    id: "rec-2",
    roomName: "Interview with Sarah",
    userId: "user123",
    date: new Date("2023-10-18").toISOString(),
    duration: 1860, // in seconds
    status: "ready",
    participants: ["You", "Sarah Johnson"],
    fileSize: "128MB",
    url: "https://example.com/download/recording2.mp4",
  },
  {
    id: "rec-3",
    roomName: "Marketing Meeting",
    userId: "user123",
    date: new Date("2023-10-20").toISOString(),
    duration: 5400, // in seconds
    status: "processing",
    participants: ["You", "Alex Brown", "Emma Wilson", "James Taylor"],
    progress: 65, // processing progress in percent
  },
];

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // In a real app, fetch from database
  // Filter recordings for this user
  const userRecordings = recordings.filter((rec) => rec.userId === "user123"); // For demo, hardcoded

  return NextResponse.json(userRecordings);
}

export async function POST(request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { roomId, filename } = await request.json();

    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // In a real app:
    // 1. Generate a presigned URL for the client to upload the file
    // 2. Return the URL to the client
    // 3. Client uploads the file directly to storage
    // 4. Client notifies server when upload is complete

    // For demo, just return a mock URL
    return NextResponse.json({
      uploadUrl: `https://example.com/upload/${roomId}/${filename}`,
      recordingId: `rec-${recordings.length + 1}`,
    });
  } catch (error) {
    console.error("Error creating upload URL:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
