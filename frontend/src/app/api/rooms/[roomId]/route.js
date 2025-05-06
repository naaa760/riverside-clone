import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// This would connect to your database in a real app
// For demo, we're using a placeholder array
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

export async function GET(request, { params }) {
  const { roomId } = params;
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the room
  const room = rooms.find((room) => room.id === roomId);

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  // Verify ownership
  if (room.userId !== "user123") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.json(room);
}

export async function DELETE(request, { params }) {
  const { roomId } = params;
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the room
  const roomIndex = rooms.findIndex((room) => room.id === roomId);

  if (roomIndex === -1) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  // Verify ownership (in a real app)
  if (rooms[roomIndex].userId !== "user123") {
    // For demo, hardcoded
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Remove the room
  rooms.splice(roomIndex, 1);

  return NextResponse.json({ success: true });
}
