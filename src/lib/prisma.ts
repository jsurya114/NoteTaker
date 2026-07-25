import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const client = new PrismaClient({
    log: ["error"],
  });

  // Add retry logic for Render's free-tier connection drops
  return client.$extends({
    query: {
      async $allOperations({ args, query }) {
        const MAX_RETRIES = 3;
        let lastError: unknown;

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
          try {
            return await query(args);
          } catch (error: any) {
            lastError = error;

            // Only retry on connection errors
            const isConnectionError =
              error?.message?.includes("Server has closed the connection") ||
              error?.message?.includes("Can't reach database server") ||
              error?.message?.includes("Connection refused") ||
              error?.message?.includes("connect ETIMEDOUT");

            if (!isConnectionError || attempt === MAX_RETRIES - 1) {
              throw error;
            }

            // Wait before retrying (exponential backoff)
            await new Promise((resolve) =>
              setTimeout(resolve, Math.pow(2, attempt) * 1000)
            );
          }
        }

        throw lastError;
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? (createPrismaClient() as unknown as PrismaClient);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}