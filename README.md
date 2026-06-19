# NoteTaker

A secure, modern note-sharing application built with Next.js App Router, Prisma, PostgreSQL, and Tailwind CSS.

## Features

- **User Authentication**: Secure JWT-based registration and login system.
- **Secure Note Creation**: Create private notes visible only to the owner.
- **Share Notes Securely**:
  - **Time-Based Access**: Share notes that expire after a set date/time.
  - **One-Time Access**: Share notes that self-destruct after being viewed once.
  - **Password Protection**: Optionally secure your shared links with a custom password.
- **Note Management**:
  - Dashboard to view all your notes, their view counts, and statuses.
  - Revoke access to any note instantly.
- **Modern UI**: Clean, responsive design built purely with Tailwind CSS and Lucide React icons.

## Folder Structure

```
src/
├── app/
│   ├── (auth)/             # Login and Registration routes
│   ├── api/                # Next.js API Routes (Backend)
│   ├── notes/              # Note Dashboard, Creation, and Details routes
│   └── share/              # Public Share routes
├── features/               # Domain-driven feature modules (notes, share)
│   ├── notes/
│   │   ├── services/       # Database interactions for notes
│   │   ├── types/          # TypeScript definitions
│   │   └── validations/    # Zod validation schemas
│   └── share/
│       └── services/       # Database interactions for sharing/unlocking
└── lib/                    # Shared utilities (prisma client, jwt, tokens)
```

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/notetaker?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
```

### 4. Database Setup
Initialize the database using Prisma:
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Application
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user and receive a JWT

### Notes (Protected)
- `GET /api/notes` - Fetch all notes for the authenticated user
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Fetch details of a specific note
- `PATCH /api/notes/:id/revoke` - Revoke a shared note

### Sharing (Public)
- `GET /api/share/:token` - View a shared note
- `POST /api/share/:token/unlock` - Unlock a password-protected note

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub.
2. Import the project in [Vercel](https://vercel.com/).
3. Add the `DATABASE_URL` and `JWT_SECRET` environment variables.
4. Deploy.

### Backend (Railway / Render)
Next.js handles both frontend and backend in one deployment on Vercel. However, you will need a managed PostgreSQL database. 
1. Create a PostgreSQL database on [Railway](https://railway.app/) or [Render](https://render.com/).
2. Copy the connection string and set it as `DATABASE_URL` in your Vercel deployment settings.
