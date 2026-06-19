# NoteTaker - Secure Note Sharing App

A simple MERN/PERN stack web application to create secure, self-destructing, and password-protected notes.

## Tech Stack Used
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless Functions)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Custom JWT Authentication

## Database Schema
```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  notes     Note[]
}

model Note {
  id         String   @id @default(cuid())
  title      String
  content    String
  shareType  ShareType // ONE_TIME | TIME_BASED
  accessType AccessType // PUBLIC | PASSWORD
  shareToken String   @unique
  accessKey  String?
  expiryAt   DateTime
  isUsed     Boolean  @default(false)
  isRevoked  Boolean  @default(false)
  viewCount  Int      @default(0)
  createdAt  DateTime @default(now())
  
  ownerId    String
  owner      User     @relation(fields: [ownerId], references: [id])
}
```

## Setup Instructions
1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file with `DATABASE_URL` and `JWT_SECRET`
4. Run `npx prisma db push` to initialize the database
5. Run `npm run dev` to start the application locally on `localhost:3000`

## Core Logic & Flows

### Share Link Flow
When a user creates a note, a 12-character random, secure `shareToken` is generated. This token is used in the URL (`/share/[token]`). The backend looks up the note by this unique token rather than the database ID to prevent enumeration attacks.

### Password/Key Generation Logic
If the user selects "Password Protected" (`PASSWORD` access type) during note creation, the backend dynamically generates a random 8-character string (e.g. `Math.random().toString(36).slice(-8)`). This key is saved to the database as the `accessKey` and is only revealed to the creator on the Note Details page. The recipient must enter this exact key to unlock the note.

### Expiry Logic
For `TIME_BASED` notes, the user selects an `expiryAt` timestamp. When a shared note is accessed, the backend checks `if (new Date() > note.expiryAt)`. If true, it immediately rejects the request with a "Link expired" error. For `ONE_TIME` notes, the expiry logic still applies, but they ALSO expire instantly upon the first successful read.

### Invalidate/Revoke Logic
The creator of the note can view their notes on the dashboard and click "Revoke Note Immediately". This sends a PATCH request to the backend that sets `isRevoked: true` on the record. Any subsequent attempts to access the note will check this boolean flag and return a "Link revoked" error.

### View Count Logic
When a note is successfully fetched and validated (not expired, not revoked, password correct), the backend safely increments the `viewCount` by 1.

---

## Technical Edge Cases & Explanations

### How do you prevent two users from using a one-time link at the same time?
We prevent race conditions using an **atomic database update query** rather than a standard read-then-write approach. 
When marking a one-time link as used, the Prisma query is:
```typescript
const result = await prisma.note.updateMany({
  where: { id: noteId, isUsed: false },
  data: { isUsed: true },
});
if (result.count === 0) throw new Error("One-time link already used");
```
By strictly filtering `isUsed: false` within the exact `UPDATE` execution, the PostgreSQL engine guarantees that even if two concurrent requests hit the database simultaneously, only the first transaction will find a matching row and update it. The second transaction will return a `count` of 0, throwing the appropriate error.

### How do you update view count safely?
Instead of reading the current count into memory and writing it back (`count = count + 1`), we use Prisma's atomic increment feature:
```typescript
await prisma.note.update({
  where: { id: note.id },
  data: { viewCount: { increment: 1 } },
});
```
This translates directly to an atomic SQL command (`UPDATE "Note" SET viewCount = viewCount + 1`), ensuring perfect accuracy even under heavy concurrent load.

### How would this work if 1 million people opened the link?
If 1 million people opened the link simultaneously, our serverless backend (Next.js on Vercel) would auto-scale to handle the HTTP requests. Our PostgreSQL database would handle the atomic increment locks efficiently. However, to scale cost-effectively and prevent DB connection limits from blowing up, we would implement **connection pooling** (like PgBouncer or Prisma Accelerate). For extreme scale, we could also decouple the view count by dumping raw access logs into a message queue (like Kafka or Redis) and batch-updating the database asynchronously.

### How would you prevent brute-force attempts on password-protected links?
Currently, if someone inputs the wrong password, we throw an "Invalid access key" error. To prevent automated brute-forcing, we would implement **Rate Limiting** tracking by IP Address or Share Token. For example, using a tool like Upstash Redis, we could restrict unlocking attempts to 5 per minute per IP. Additionally, after 10 consecutive failed attempts on a single note, we could temporarily "lock" the note for 15 minutes to deter attackers.
