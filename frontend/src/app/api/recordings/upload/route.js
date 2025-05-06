import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";

export async function POST(request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { roomId } = await request.json();

    // In a real app, this would generate a presigned URL for direct upload
    // For demo purposes, we'll return a mock upload URL

    const uploadId = nanoid();
    const uploadUrl = `https://example.com/upload/${uploadId}`;

    return NextResponse.json({
      uploadUrl,
      recordingId: uploadId,
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
