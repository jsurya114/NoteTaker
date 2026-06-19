"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Clock, Eye, Ban, Plus, LogOut } from "lucide-react";
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-indigo-600" /> NoteTaker
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/notes/new"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Plus size={16} /> New Note
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Notes</h2>
            <p className="mt-1 text-sm text-gray-500">Manage and share your secure notes.</p>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No notes</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new secure note.</p>
            <div className="mt-6">
              <Link
                href="/notes/new"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                New Note
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate pr-4" title={note.title}>
                      {note.title}
                    </h3>
                    {note.isRevoked ? (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 whitespace-nowrap">
                        Revoked
                      </span>
                    ) : new Date(note.expiryAt) < new Date() ? (
                      <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 whitespace-nowrap">
                        Expired
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 whitespace-nowrap">
                        Active
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4 text-gray-400" />
                      Expires: {format(new Date(note.expiryAt), "MMM d, yyyy h:mm a")}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="mr-2 h-4 w-4 text-gray-400" />
                      Views: {note.viewCount}
                    </div>
                    {note.shareType === "ONE_TIME" && (
                      <div className="flex items-center text-sm text-indigo-600 font-medium">
                        <FileText className="mr-2 h-4 w-4 text-indigo-500" />
                        One-Time View
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
