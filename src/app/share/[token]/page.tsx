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
    return (
      <div className="min-h-screen bg-white flex justify-center items-center font-sans text-black">
        <div className="text-xl font-black uppercase tracking-widest animate-pulse border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Decrypting...
        </div>
      </div>
    );
  }

  if (error && !note) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6 font-sans text-black">
        <div className="max-w-md w-full border-4 border-black bg-red-100 p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-red-600">Access Denied</h2>
          <p className="font-bold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (note?.accessType === "PASSWORD" && !note.content) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center p-6 font-sans text-black">
        <div className="max-w-md w-full border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="mb-8 border-b-4 border-black pb-4 text-center">
            <h1 className="text-3xl font-black uppercase tracking-tight">Protected Note</h1>
            <p className="text-sm font-bold uppercase mt-2 text-gray-600">Password Required</p>
          </div>
          
          <form onSubmit={unlockNote} className="space-y-6">
            {error && (
              <div className="p-3 border-2 border-black bg-red-50 text-red-600 font-semibold text-sm text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold uppercase mb-2">Enter Password</label>
              <input
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full border-2 border-black p-4 text-center tracking-widest text-lg focus:outline-none focus:ring-0 transition-all focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={unlocking || !accessKey}
              className="w-full bg-black text-white font-bold uppercase tracking-widest p-4 border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors disabled:opacity-50"
            >
              {unlocking ? "Unlocking..." : "Unlock Note"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-black">
      <div className="max-w-3xl mx-auto border-2 border-black p-8 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mt-10">
        <header className="mb-8 border-b-4 border-black pb-4">
          <h1 className="text-4xl font-black uppercase tracking-tight break-words">{note.title}</h1>
        </header>
        
        {note.shareType === "ONE_TIME" && (
          <div className="mb-8 border-4 border-black bg-orange-100 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black uppercase text-orange-600 flex items-center gap-2">
              <span className="text-xl">⚠️</span> Warning: One-Time Link
            </h3>
            <p className="font-bold mt-1 text-sm">
              This note has self-destructed and cannot be viewed again. Save its contents now.
            </p>
          </div>
        )}

        <div>
          <h2 className="text-sm font-black uppercase mb-2 text-gray-500">Secure Message</h2>
          <div className="border-2 border-black p-6 bg-gray-50 whitespace-pre-wrap font-medium text-lg leading-relaxed">
            {note.content}
          </div>
        </div>
      </div>
    </div>
  );
}