import jwt from "jsonwebtoken";

export function generateToken(
  userId: string
) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );
}

export function verifyToken(
  token: string
) {
  return jwt.verify(
    token,
    process.env.JWT_SECRET!
  );
}

export function getUserIdFromToken(
  authHeader?: string
) {
  if (!authHeader) {
    throw new Error(
      "Authorization header missing"
    );
  }

  const token =
    authHeader.replace(
      "Bearer ",
      ""
    );

  const payload =
    verifyToken(token) as {
      userId: string;
    };

  return payload.userId;
}