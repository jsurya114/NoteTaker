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
    return <div className="p-5">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Your Notes</h1>
        <div>
          <Link href="/notes/new" className="border px-4 py-2 mr-2">
            New Note
          </Link>
          <button onClick={handleLogout} className="border px-4 py-2">
            Logout
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="border p-4">
              <h2 className="text-xl font-bold mb-2">
                <Link href={`/notes/${note.id}`} className="underline">
                  {note.title}
                </Link>
              </h2>
              <p>Status: {note.isRevoked ? "Revoked" : new Date(note.expiryAt) < new Date() ? "Expired" : "Active"}</p>
              <p>Expires: {format(new Date(note.expiryAt), "MMM d, yyyy h:mm a")}</p>
              <p>Views: {note.viewCount}</p>
              {note.shareType === "ONE_TIME" && <p>Type: One-Time View</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
