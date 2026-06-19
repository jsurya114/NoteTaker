import { prisma } from "@/lib/prisma";


import { generateShareToken } from "@/lib/generateShareToken";

import { CreateNoteInput } from "../types/note.types";

export async function createNote(
  userId: string,
  data: CreateNoteInput
) {
  const shareToken =
    generateShareToken();

const accessKey =
  data.accessType === "PASSWORD"
    ? data.accessKey
    : null;
  const note = await prisma.note.create({
    data: {
      title: data.title,
      content: data.content,

      shareType: data.shareType,
      accessType: data.accessType,

      shareToken,
      accessKey,

      expiryAt: new Date(
        data.expiryAt
      ),

      ownerId: userId,
    },
  });

  return {
    note,
    shareUrl:
      `/share/${shareToken}`,
    accessKey,
  };
}

export async function revokeNote(
  noteId: string,
  userId: string
) {
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      ownerId: userId,
    },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  const updatedNote = await prisma.note.update({
    where: {
      id: noteId,
    },
    data: {
      isRevoked: true,
    },
  });

  const {
    accessKey,
    ...safeNote
  } = updatedNote;

  return safeNote;
}


export async function getNoteById(
  noteId: string,
  userId: string
) {
  const note =
    await prisma.note.findFirst({
      where: {
        id: noteId,
        ownerId: userId,
      },
    });

  if (!note) {
    throw new Error(
      "Note not found"
    );
  }

  return note;
}

export async function getUserNotes(
  userId: string
) {
  const notes = await prisma.note.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return notes;
}