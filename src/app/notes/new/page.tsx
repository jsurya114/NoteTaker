"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Lock, Globe, Save } from "lucide-react";

export default function NewNotePage() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [shareType, setShareType] = useState("TIME_BASED");
  const [accessType, setAccessType] = useState("PUBLIC");
  const [expiryAt, setExpiryAt] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (!title || !content || !expiryAt) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (accessType === "PASSWORD" && !accessKey) {
      setError("Please provide a password for protected access.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          shareType,
          accessType,
          accessKey: accessType === "PASSWORD" ? accessKey : undefined,
          expiryAt: new Date(expiryAt).toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/notes/${data.note.id}`);
      } else {
        setError(data.message || "Failed to create note.");
      }
    } catch (err) {
      setError("Network error occurred while creating the note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/notes" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="mr-2 text-indigo-600" /> Create New Note
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create a secure note and share it with customized access rules.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content <span className="text-red-500">*</span></label>
              <textarea
                required
                rows={6}
                placeholder="Write your note content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Share Type</label>
                <div className="relative">
                  <select
                    value={shareType}
                    onChange={(e) => setShareType(e.target.value)}
                    className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 appearance-none bg-white"
                  >
                    <option value="TIME_BASED">Time Based (Multiple views)</option>
                    <option value="ONE_TIME">One Time (Self-destructs after view)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Type</label>
                <div className="relative">
                  <select
                    value={accessType}
                    onChange={(e) => setAccessType(e.target.value)}
                    className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 appearance-none bg-white"
                  >
                    <option value="PUBLIC">Public (Anyone with link)</option>
                    <option value="PASSWORD">Password Protected</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {accessType === "PASSWORD" && (
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <label className="block text-sm font-medium text-indigo-900 mb-1 flex items-center">
                  <Lock size={14} className="mr-1" /> Custom Password <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter a secure password..."
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-indigo-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                required
                value={expiryAt}
                onChange={(e) => setExpiryAt(e.target.value)}
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Create Secure Note
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}