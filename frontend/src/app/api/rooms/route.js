import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function GET(request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real app, this would fetch from your database via Prisma
    // For now, return mock data
    return NextResponse.json({
      rooms: [
        {
          id: "1",
          slug: "demo-room",
          name: "Demo Room",
          createdAt: new Date().toISOString(),
          participantCount: 2,
          recordings: [{ id: "1" }],
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
