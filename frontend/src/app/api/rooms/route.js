import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Mock data for demonstration
const rooms = [
  {
    id: "room-1",
    name: "Weekly Podcast",
    userId: "user123",
    createdAt: new Date("2023-10-15").toISOString(),
  },
  {
    id: "room-2",
    name: "Interview with Sarah",
    userId: "user123",
    createdAt: new Date("2023-10-18").toISOString(),
  },
];

export async function GET(request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real app, you would fetch rooms from database
    // For the demo, we'll return mock rooms

    const rooms = [
      {
        id: "room-1",
        name: "Weekly Team Sync",
        type: "audio-video",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: userId,
        inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/room/room-1`,
      },
      {
        id: "room-2",
        name: "Podcast Recording",
        type: "audio-only",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: userId,
        inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/room/room-2`,
      },
    ];

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
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
    if (!data.name) {
      return NextResponse.json(
        { error: "Room name is required" },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Save room to database
    // 2. Create signaling setup for WebRTC
    // 3. Return room details

    // For the demo, we'll return a mock room
    const roomId = `room-${Date.now()}`;

    const room = {
      id: roomId,
      name: data.name,
      type: data.type || "audio-video",
      createdAt: new Date().toISOString(),
      createdBy: userId,
      inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/room/${roomId}`,
    };

    return NextResponse.json({ room });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
