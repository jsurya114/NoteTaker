import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";

// Ensure key is exactly 32 bytes long for aes-256
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY 
  ? crypto.createHash("sha256").update(String(process.env.ENCRYPTION_KEY)).digest("base64").substring(0, 32)
  : "default-secret-key-must-be-32-by"; // 32 chars fallback for dev

const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string): string {
  const textParts = text.split(":");
  const ivPart = textParts.shift();
  const encryptedTextPart = textParts.join(":");

  if (!ivPart || !encryptedTextPart) {
    throw new Error("Invalid encrypted format");
  }

  const iv = Buffer.from(ivPart, "hex");
  const encryptedText = Buffer.from(encryptedTextPart, "hex");
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
