"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Lock, FileText, Ban, Key } from "lucide-react";

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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading secure note...</p>
      </div>
    );
  }

  if (error && !note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8 max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <Ban className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  if (note?.accessType === "PASSWORD" && !note.content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
            <Lock className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Protected Note</h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            This note requires a password to view its contents.
          </p>

          <form onSubmit={unlockNote} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200 text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="Enter access password"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={unlocking || !accessKey}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {unlocking ? "Unlocking..." : "Unlock Note"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 p-6 sm:p-8 bg-white">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                <FileText size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  Secure Shared Note
                </p>
              </div>
            </div>
            {note.shareType === "ONE_TIME" && (
              <div className="mt-4 inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20">
                ⚠️ This is a one-time link. The note has self-destructed and cannot be viewed again.
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 min-h-[200px] whitespace-pre-wrap text-gray-800 text-base leading-relaxed">
              {note.content}
            </div>
            <div className="mt-8 text-center text-sm text-gray-400">
              Powered by NoteTaker
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}