import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(request, { params }) {
  try {
    const { userId } = auth();
    const { id } = params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json(
        { error: "Recording ID is required" },
        { status: 400 }
      );
    }

    // In a real app, update the recording status in your database
    // and trigger the transcoding process

    return NextResponse.json({
      success: true,
      message: "Recording marked as complete and queued for processing",
    });
  } catch (error) {
    console.error("Error completing recording:", error);
    return NextResponse.json(
      { error: "Failed to process recording" },
      { status: 500 }
    );
  }
}
