"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SharePage() {
  const params = useParams();

  const [note, setNote] = useState<any>(null);
  const [error, setError] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    async function fetchNote() {
      try {
        const response = await fetch(`/api/share/${params.token}`);
        const data = await response.json();

        if (data.success) {
          setNote(data.note);
        } else {
          setError(data.message || "Failed to load shared note.");
        }
      } catch (err) {
        setError("Network error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [params.token]);

  async function unlockNote(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!accessKey) return;
    
    setUnlocking(true);
    setError("");
    
    try {
      const response = await fetch(`/api/share/${params.token}/unlock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessKey }),
      });

      const data = await response.json();

      if (data.success) {
        setNote(data.note);
        setAccessKey("");
      } else {
        setError(data.message || "Invalid password.");
      }
    } catch (err) {
      setError("Network error occurred while unlocking.");
    } finally {
      setUnlocking(false);
    }
  }

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  if (error && !note) {
    return (
      <div className="p-5 max-w-md mx-auto mt-10 border border-red-500">
        <h2 className="font-bold text-red-500 mb-2">Access Denied</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (note?.accessType === "PASSWORD" && !note.content) {
    return (
      <div className="max-w-md mx-auto mt-10 p-5 border">
        <h2 className="text-xl font-bold mb-4">Protected Note</h2>
        
        <form onSubmit={unlockNote} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          
          <input
            type="password"
            placeholder="Enter password"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            className="border p-2 w-full"
            required
          />

          <button
            type="submit"
            disabled={unlocking || !accessKey}
            className="border px-4 py-2 w-full"
          >
            {unlocking ? "Unlocking..." : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-5 border">
      <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
      
      {note.shareType === "ONE_TIME" && (
        <div className="mb-4 text-orange-600 border border-orange-300 p-2">
          Warning: This is a one-time link. The note has self-destructed and cannot be viewed again.
        </div>
      )}

      <div className="border p-4 whitespace-pre-wrap mt-4">
        {note.content}
      </div>
    </div>
  );
}