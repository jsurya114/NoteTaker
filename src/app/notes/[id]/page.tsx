"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { 
  ArrowLeft, FileText, Clock, Eye, Copy, 
  Ban, Shield, Link as LinkIcon, CheckCircle2 
} from "lucide-react";

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
    if (!confirm("Are you sure you want to revoke this note? It will immediately become inaccessible.")) {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center mb-4 border border-red-200 shadow-sm max-w-md w-full">
          <Ban className="mr-2" /> {error || "Note not found."}
        </div>
        <Link href="/notes" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
          <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const isExpired = new Date(note.expiryAt) < new Date();
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${note.shareToken}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/notes" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 p-6 sm:p-8 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock size={16} className="mr-1 text-gray-400" />
                    Expires: {format(new Date(note.expiryAt), "PPp")}
                  </span>
                  <span className="flex items-center">
                    <Eye size={16} className="mr-1 text-gray-400" />
                    Views: {note.viewCount}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {note.isRevoked ? (
                  <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                    <Ban size={14} className="mr-1.5" /> Revoked
                  </span>
                ) : isExpired ? (
                  <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                    <Clock size={14} className="mr-1.5" /> Expired
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    <CheckCircle2 size={14} className="mr-1.5" /> Active
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
              <FileText size={18} className="mr-2 text-indigo-500" /> Content
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[150px] whitespace-pre-wrap text-gray-800">
              {note.content}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <LinkIcon size={16} className="mr-2 text-indigo-500" /> Share Link
                </h4>
                <div className="flex mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="block w-full rounded-none rounded-l-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 bg-gray-50"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Shield size={16} className="mr-2 text-indigo-500" /> Security Info
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Access Type:</span>
                    <span className="font-medium text-gray-900">{note.accessType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Share Type:</span>
                    <span className="font-medium text-gray-900">{note.shareType}</span>
                  </div>
                  {note.accessType === "PASSWORD" && note.accessKey && (
                    <div className="flex justify-between border-t border-gray-100 pt-3 mt-3">
                      <span className="text-gray-500">Password:</span>
                      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-900 select-all">
                        {note.accessKey}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!note.isRevoked && (
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleRevoke}
                  disabled={revoking}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Ban size={16} className="mr-2" />
                  {revoking ? "Revoking..." : "Revoke Access"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
