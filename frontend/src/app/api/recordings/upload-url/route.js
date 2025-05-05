import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { nanoid } from "nanoid";

export async function GET(request) {
  try {
    const { userId } = auth();
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // In a real app, generate a presigned URL using Firebase Storage or other provider
    // For now, just mock it
    const recordingId = nanoid();

    // Mock upload URL - in real app this would be a Firebase Storage URL
    const uploadUrl = `https://example.com/mock-upload/${recordingId}`;

    return NextResponse.json({
      uploadUrl,
      recordingId,
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
