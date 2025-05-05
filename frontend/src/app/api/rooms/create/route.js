import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { nanoid } from "nanoid";

export async function POST(request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a unique slug for the room
    const slug = nanoid(10);

    // In a real app, you would create this in your database using Prisma
    // For now, just return the slug
    return NextResponse.json({
      slug,
      success: true,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
