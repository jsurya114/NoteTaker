"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

export default function DashboardPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchNotes() {
      try {
        const response = await fetch("/api/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setNotes(data.notes);
        } else {
          if (response.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center font-sans text-black">
        <div className="text-xl font-bold uppercase tracking-widest animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-black">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b-4 border-black pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight">Your Notes</h1>
            <p className="text-sm font-bold text-gray-600 uppercase mt-1">Dashboard</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/notes/new"
              className="bg-black text-white font-bold uppercase tracking-widest px-6 py-3 border-2 border-black hover:bg-white hover:text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none"
            >
              New Note
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-black font-bold uppercase tracking-widest px-6 py-3 border-2 border-black hover:bg-red-500 hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none"
            >
              Logout
            </button>
          </div>
        </header>

        {notes.length === 0 ? (
          <div className="border-2 border-black p-8 bg-gray-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <p className="text-lg font-bold uppercase">No notes found.</p>
            <p className="mt-2 text-gray-600">Create your first secure note to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {notes.map((note) => (
              <div
                key={note.id}
                className="border-2 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-2xl font-black uppercase mb-4 truncate" title={note.title}>
                    <Link href={`/notes/${note.id}`} className="hover:underline">
                      {note.title}
                    </Link>
                  </h2>
                  <div className="space-y-2 text-sm font-bold">
                    <p className="flex justify-between border-b border-black pb-1">
                      <span>Status:</span>
                      <span
                        className={
                          note.isRevoked || new Date(note.expiryAt) < new Date()
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        {note.isRevoked ? "REVOKED" : new Date(note.expiryAt) < new Date() ? "EXPIRED" : "ACTIVE"}
                      </span>
                    </p>
                    <p className="flex justify-between border-b border-black pb-1">
                      <span>Expires:</span>
                      <span>{format(new Date(note.expiryAt), "MMM d, yyyy h:mm a")}</span>
                    </p>
                    <p className="flex justify-between border-b border-black pb-1">
                      <span>Views:</span>
                      <span>{note.viewCount}</span>
                    </p>
                    {note.shareType === "ONE_TIME" && (
                      <p className="flex justify-between border-b border-black pb-1 text-orange-600">
                        <span>Type:</span>
                        <span>ONE-TIME VIEW</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/notes/${note.id}`}
                    className="block text-center w-full bg-white text-black font-bold uppercase tracking-widest p-3 border-2 border-black hover:bg-black hover:text-white transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
