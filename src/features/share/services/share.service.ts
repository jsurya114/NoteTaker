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

  if (note.accessType === "PASSWORD") {
    return {
      id: note.id,
      title: note.title,
      shareType: note.shareType,
      accessType: note.accessType,
      isRevoked: note.isRevoked,
      viewCount: note.viewCount,
      expiryAt: note.expiryAt,
      content: "", // Hide content until unlocked
    };
  }

  if (note.shareType === "ONE_TIME") {
    await markOneTimeLinkAsUsed(note.id);
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

async function markOneTimeLinkAsUsed(noteId: string) {
  const result = await prisma.note.updateMany({
    where: {
      id: noteId,
      isUsed: false,
    },
    data: {
      isUsed: true,
    },
  });

  if (result.count === 0) {
    throw new Error("One-time link already used");
  }
}