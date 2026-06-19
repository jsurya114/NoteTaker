import { NextResponse } from "next/server";

import { getSharedNote } from "@/features/share/services/share.service";

type Params = Promise<{
  token: string;
}>;

export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { token } = await params;

    const note =
      await getSharedNote(token);

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


