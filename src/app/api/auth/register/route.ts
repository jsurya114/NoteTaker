import { NextResponse } from "next/server";

import { registerUser } from "@/features/auth/services/auth.service";

import { registerSchema } from "@/features/auth/validations/auth.validation";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const validatedData =
      registerSchema.parse(body);

    const user =
      await registerUser(validatedData);

    return NextResponse.json(
      {
        success: true,
        user,
      },
      {
        status: 201,
      }
    );
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