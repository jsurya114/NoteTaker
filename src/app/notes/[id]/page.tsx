"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

export default function NoteDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchNoteDetails() {
      try {
        const response = await fetch(`/api/notes/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setNote(data.note);
        } else {
          setError(data.message || "Failed to load note.");
          if (response.status === 401) {
            router.push("/login");
          }
        }
      } catch (err) {
        setError("Network error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchNoteDetails();
  }, [params.id, router]);

  const copyToClipboard = () => {
    if (!note) return;
    const url = `${window.location.origin}/share/${note.shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = async () => {
    if (!confirm("Are you sure you want to revoke this note?")) {
      return;
    }

    setRevoking(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/notes/${params.id}/revoke`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setNote({ ...note, isRevoked: true });
        alert("Note successfully revoked.");
      } else {
        alert(data.message || "Failed to revoke note.");
      }
    } catch (err) {
      alert("Network error while revoking.");
    } finally {
      setRevoking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center font-sans text-black">
        <div className="text-xl font-bold uppercase tracking-widest animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center font-sans text-black">
        <div className="max-w-md w-full border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <p className="text-xl font-bold uppercase text-red-600 mb-6">{error || "Note not found."}</p>
          <Link
            href="/notes"
            className="inline-block bg-black text-white font-bold uppercase tracking-widest px-6 py-3 border-2 border-black hover:bg-white hover:text-black transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${note.shareToken}`;

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-black">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/notes" className="font-bold uppercase underline hover:no-underline text-sm border-2 border-black px-4 py-2 bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all inline-block">
            &larr; Back to Dashboard
          </Link>
        </div>

        <div className="border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <header className="mb-8 border-b-4 border-black pb-4">
            <h1 className="text-3xl font-black uppercase tracking-tight break-words">{note.title}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold uppercase">
              <span className={`px-3 py-1 border-2 border-black ${note.isRevoked || new Date(note.expiryAt) < new Date() ? "bg-red-200" : "bg-green-200"}`}>
                {note.isRevoked ? "Revoked" : new Date(note.expiryAt) < new Date() ? "Expired" : "Active"}
              </span>
              <span className="px-3 py-1 border-2 border-black bg-blue-200">
                Views: {note.viewCount}
              </span>
              {note.shareType === "ONE_TIME" && (
                <span className="px-3 py-1 border-2 border-black bg-orange-200">
                  One-Time View
                </span>
              )}
            </div>
          </header>

          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-black uppercase mb-2">Content</h2>
              <div className="border-2 border-black p-6 bg-gray-50 whitespace-pre-wrap font-medium">
                {note.content}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-black uppercase mb-2">Share Link</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full border-2 border-black p-3 bg-gray-50 focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="whitespace-nowrap bg-black text-white font-bold uppercase tracking-widest px-6 py-3 border-2 border-black hover:bg-white hover:text-black transition-colors"
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </section>

            <section className="border-t-2 border-black pt-6">
              <h2 className="text-lg font-black uppercase mb-4">Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-bold uppercase">
                <div className="border-2 border-black p-4 bg-gray-50">
                  <span className="block text-gray-500 mb-1">Expires</span>
                  {format(new Date(note.expiryAt), "MMM d, yyyy h:mm a")}
                </div>
                <div className="border-2 border-black p-4 bg-gray-50">
                  <span className="block text-gray-500 mb-1">Access Type</span>
                  {note.accessType}
                </div>
                {note.accessType === "PASSWORD" && note.accessKey && (
                  <div className="border-2 border-black p-4 bg-gray-50 sm:col-span-2">
                    <span className="block text-gray-500 mb-1">Password</span>
                    {note.accessKey}
                  </div>
                )}
              </div>
            </section>

            {!note.isRevoked && (
              <div className="pt-6 border-t-2 border-black">
                <button
                  onClick={handleRevoke}
                  disabled={revoking}
                  className="w-full bg-red-500 text-white font-bold uppercase tracking-widest p-4 border-2 border-black hover:bg-white hover:text-red-600 hover:border-red-600 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none disabled:opacity-50"
                >
                  {revoking ? "Revoking..." : "Revoke Note Immediately"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
