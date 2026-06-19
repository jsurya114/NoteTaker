import { NextResponse } from "next/server";

import { createNote, getUserNotes } from "@/features/notes/services/note.service";

import { createNoteSchema } from "@/features/notes/validations/note.validation";

import { getUserIdFromToken } from "@/lib/jwt";

export async function POST(
  request: Request
) {
  try {
    const authHeader =
      request.headers.get(
        "authorization"
      ) || undefined;

    const userId =
      getUserIdFromToken(
        authHeader
      );

    const body =
      await request.json();

    const validatedData =
      createNoteSchema.parse(
        body
      );

    const result =
      await createNote(
        userId,
        validatedData
      );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET(
  request: Request
) {
  try {
    const authHeader = request.headers.get("authorization") || undefined;
    const userId = getUserIdFromToken(authHeader);

    const notes = await getUserNotes(userId);

    return NextResponse.json({
      success: true,
      notes,
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