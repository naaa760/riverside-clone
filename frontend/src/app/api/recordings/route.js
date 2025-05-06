import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

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

export async function GET(request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real app, we'd query the database for recordings
    // Here we'll return mock data

    const recordings = [
      {
        id: "rec-1",
        name: "Weekly Podcast #42",
        date: "2023-10-20T14:30:00Z",
        duration: 3720, // seconds
        status: "ready",
        participants: ["You", "John Smith", "Sarah Johnson"],
        thumbnail: "/placeholder-recording.jpg",
        fileSize: "256MB",
        projectId: "proj-1",
      },
      {
        id: "rec-2",
        name: "Interview with Alex",
        date: "2023-10-18T10:15:00Z",
        duration: 1860, // seconds
        status: "ready",
        participants: ["You", "Alex Williams"],
        thumbnail: "/placeholder-recording.jpg",
        fileSize: "128MB",
        projectId: "proj-2",
      },
      {
        id: "rec-3",
        name: "Marketing Strategy Session",
        date: "2023-10-16T09:00:00Z",
        duration: 5400, // seconds
        status: "processing",
        participants: ["You", "Emma Davis", "Michael Brown", "David Lee"],
        thumbnail: "/placeholder-recording.jpg",
        progress: 65, // processing progress in percent
        projectId: "proj-3",
      },
    ];

    return NextResponse.json({ recordings });
  } catch (error) {
    console.error("Error fetching recordings:", error);
    return NextResponse.json(
      { error: "Failed to fetch recordings" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Check if the user has access to the room
    // 2. Create a recording entry in the database
    // 3. Return recording details

    // For the demo, we'll return a mock recording
    const recordingId = `rec-${Date.now()}`;

    const recording = {
      id: recordingId,
      name: data.name || `Recording ${new Date().toLocaleString()}`,
      date: new Date().toISOString(),
      duration: data.duration || 0,
      status: "processing",
      participants: data.participants || ["You"],
      thumbnail: "/placeholder-recording.jpg",
      progress: 0,
      projectId: data.projectId || null,
      createdBy: userId,
    };

    return NextResponse.json({ recording });
  } catch (error) {
    console.error("Error creating recording:", error);
    return NextResponse.json(
      { error: "Failed to create recording" },
      { status: 500 }
    );
  }
}

// Endpoint to update a recording
export async function PATCH(request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.id) {
      return NextResponse.json(
        { error: "Recording ID is required" },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Check if the user has access to the recording
    // 2. Update the recording in the database
    // 3. Return updated recording details

    // For the demo, we'll return a mock updated recording
    const recording = {
      id: data.id,
      name: data.name || `Recording ${new Date().toLocaleString()}`,
      date: data.date || new Date().toISOString(),
      duration: data.duration || 0,
      status: data.status || "processing",
      participants: data.participants || ["You"],
      thumbnail: data.thumbnail || "/placeholder-recording.jpg",
      progress: data.progress || 0,
      fileSize: data.fileSize || null,
      projectId: data.projectId || null,
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ recording });
  } catch (error) {
    console.error("Error updating recording:", error);
    return NextResponse.json(
      { error: "Failed to update recording" },
      { status: 500 }
    );
  }
}
