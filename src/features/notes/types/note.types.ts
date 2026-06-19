export type CreateNoteInput = {
  title: string;
  content: string;
  shareType: "ONE_TIME" | "TIME_BASED";
  accessType: "PUBLIC" | "PASSWORD";
   accessKey?: string;
  expiryAt: string;
};