import { NextResponse } from "next/server";

import { loginUser } from "@/features/auth/services/auth.service";
import { loginSchema } from "@/features/auth/validations/auth.validation";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const validatedData =
      loginSchema.parse(body);

    const user = await loginUser(
      validatedData.email,
      validatedData.password
    );

    return NextResponse.json(
      {
        success: true,
        user,
      },
      {
        status: 200,
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