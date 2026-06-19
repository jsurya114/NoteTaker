import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

import { RegisterInput } from "../types/auth.types";
import { generateToken } from "@/lib/jwt";

export async function registerUser(
  data: RegisterInput
) {
  const existingUser =
    await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword =
    await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  const { password, ...safeUser } = user;

  return safeUser;
}

export async function loginUser(
  email: string,
  password: string
) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }
 const token = generateToken(user.id);

  const { password: _, ...safeUser } = user;

  return{ user: safeUser, token};
}