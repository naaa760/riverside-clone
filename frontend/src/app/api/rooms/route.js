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

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // In a real app, fetch from database
  // Filter rooms for this user
  const userRooms = rooms.filter((room) => room.userId === "user123"); // For demo, hardcoded

  return NextResponse.json(userRooms);
}

export async function POST(request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Room name is required" },
        { status: 400 }
      );
    }

    // In a real app, save to database
    const newRoom = {
      id: `room-${rooms.length + 1}`,
      name,
      userId,
      createdAt: new Date().toISOString(),
    };

    // Add to mock data
    rooms.push(newRoom);

    return NextResponse.json(newRoom);
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json({ error: "Error creating room" }, { status: 500 });
  }
}
