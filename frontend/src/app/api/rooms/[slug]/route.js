import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function GET(request, { params }) {
  try {
    const { userId } = auth();
    const { slug } = params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Room slug is required" },
        { status: 400 }
      );
    }

    // In a real app, fetch the room from your database
    // For now, return mock data
    return NextResponse.json({
      room: {
        id: "1",
        slug,
        name: `Room ${slug}`,
        createdAt: new Date().toISOString(),
        ownerId: userId,
        participants: [],
      },
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}
