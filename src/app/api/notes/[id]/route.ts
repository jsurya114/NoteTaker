import { NextResponse } from "next/server";
import { getNoteById } from "@/features/notes/services/note.service";
import { getUserIdFromToken } from "@/lib/jwt";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization") || undefined;
    const userId = getUserIdFromToken(authHeader);
    const { id } = await params;

    const note = await getNoteById(id, userId);

    return NextResponse.json({
      success: true,
      note,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 400 }
    );
  }
}
