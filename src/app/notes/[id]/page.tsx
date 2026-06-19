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
    return <div className="p-5">Loading...</div>;
  }

  if (error || !note) {
    return (
      <div className="p-5">
        <p className="text-red-500 mb-4">{error || "Note not found."}</p>
        <Link href="/notes" className="underline">Back to Dashboard</Link>
      </div>
    );
  }

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${note.shareToken}`;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-5">
      <Link href="/notes" className="underline mb-5 inline-block">
        Back to Dashboard
      </Link>

      <div className="border p-5">
        <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
        
        <div className="mb-4 text-sm text-gray-600">
          <p>Status: {note.isRevoked ? "Revoked" : new Date(note.expiryAt) < new Date() ? "Expired" : "Active"}</p>
          <p>Expires: {format(new Date(note.expiryAt), "MMM d, yyyy h:mm a")}</p>
          <p>Views: {note.viewCount}</p>
        </div>

        <div className="mb-4">
          <h2 className="font-bold">Content:</h2>
          <div className="border p-3 whitespace-pre-wrap">{note.content}</div>
        </div>

        <div className="mb-4">
          <h2 className="font-bold">Share Link:</h2>
          <div className="flex gap-2">
            <input type="text" readOnly value={shareUrl} className="border p-2 w-full" />
            <button onClick={copyToClipboard} className="border px-4 py-2">
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-bold">Settings:</h2>
          <p>Access Type: {note.accessType}</p>
          <p>Share Type: {note.shareType}</p>
          {note.accessType === "PASSWORD" && note.accessKey && (
            <p>Password: {note.accessKey}</p>
          )}
        </div>

        {!note.isRevoked && (
          <button 
            onClick={handleRevoke} 
            disabled={revoking}
            className="border px-4 py-2 bg-red-100 text-red-700 w-full mt-4"
          >
            {revoking ? "Revoking..." : "Revoke Note"}
          </button>
        )}
      </div>
    </div>
  );
}
