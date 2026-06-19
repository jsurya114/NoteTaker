import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1),

  content: z.string().min(1),

  shareType: z.enum([
    "ONE_TIME",
    "TIME_BASED",
  ]),

  accessType: z.enum([
    "PUBLIC",
    "PASSWORD",
  ]),

  accessKey: z.string().optional(),
  expiryAt: z.string(),
});