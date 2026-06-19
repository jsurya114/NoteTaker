import { prisma } from "@/lib/prisma";

export async function getSharedNote(
  token: string
) {
  const note = await prisma.note.findUnique({
    where: {
      shareToken: token,
    },
  });

  if (!note) {
    throw new Error("Invalid share link");
  }

  if (note.isRevoked) {
    throw new Error("Link revoked");
  }

  if (new Date() > note.expiryAt) {
    throw new Error("Link expired");
  }

  
  
  if (
    note.shareType === "ONE_TIME" &&
    note.isUsed
  ) {
    throw new Error(
      "One-time link already used"
    );
  }

  if (note.accessType === "PUBLIC") {
    await prisma.note.update({
      where: {
        id: note.id,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

 if (note.shareType === "ONE_TIME") {
  await markOneTimeLinkAsUsed(
    note.id
  );
}

  const {
    accessKey,
    ...safeNote
  } = note;

  return safeNote;
}

export async function unlockNote(
  token: string,
  accessKey: string
) {
  const note =
    await prisma.note.findUnique({
      where: {
        shareToken: token,
      },
    });

  if (!note) {
    throw new Error(
      "Invalid share link"
    );
  }

  if (note.isRevoked) {
    throw new Error(
      "Link revoked"
    );
  }

  if (
    new Date() > note.expiryAt
  ) {
    throw new Error(
      "Link expired"
    );
  }

  if (
    note.accessType === "PASSWORD"
  ) {
    if (
      note.accessKey !== accessKey
    ) {
      throw new Error(
        "Invalid access key"
      );
    }
  }

  if (note.shareType === "ONE_TIME") {
  await markOneTimeLinkAsUsed(
    note.id
  );
}
  await prisma.note.update({
    where: {
      id: note.id,
    },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });

  const {
    accessKey: _,
    ...safeNote
  } = note;

  return safeNote;
}

async function markOneTimeLinkAsUsed(
  noteId: string
) {
  await prisma.$transaction(
    async (tx) => {
      const note =
        await tx.note.findUnique({
          where: {
            id: noteId,
          },
        });

      if (!note) {
        throw new Error(
          "Note not found"
        );
      }

      if (note.isUsed) {
        throw new Error(
          "One-time link already used"
        );
      }

      await tx.note.update({
        where: {
          id: noteId,
        },
        data: {
          isUsed: true,
        },
      });
    }
  );
}