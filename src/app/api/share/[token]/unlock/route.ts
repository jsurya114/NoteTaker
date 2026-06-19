import { NextResponse } from "next/server";

import { unlockNote } from "@/features/share/services/share.service";

type Params = Promise<{
  token: string;
}>;

export async function POST(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { token } =
      await params;

    const body =
      await request.json();

    const note =
      await unlockNote(
        token,
        body.accessKey
      );

    return NextResponse.json({
      success: true,
      note,
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