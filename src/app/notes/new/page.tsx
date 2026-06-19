"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      setError("Please provide a password.");
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
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-black">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/notes" className="font-bold uppercase underline hover:no-underline text-sm border-2 border-black px-4 py-2 bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all inline-block">
            &larr; Back to Dashboard
          </Link>
        </div>

        <div className="border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="mb-8 border-b-4 border-black pb-4">
            <h1 className="text-3xl font-black uppercase tracking-tight">Create Note</h1>
            <p className="text-sm font-medium mt-2 text-gray-600">Secure your secret message</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 border-2 border-black bg-red-50 text-red-600 font-semibold text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold uppercase mb-2">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0 transition-all focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-2">Content</label>
              <textarea
                required
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0 transition-all focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold uppercase mb-2">Share Type</label>
                <select
                  value={shareType}
                  onChange={(e) => setShareType(e.target.value)}
                  className="w-full border-2 border-black p-3 bg-white focus:outline-none cursor-pointer appearance-none rounded-none"
                >
                  <option value="TIME_BASED">Time Based</option>
                  <option value="ONE_TIME">One Time View</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-2">Access Type</label>
                <select
                  value={accessType}
                  onChange={(e) => setAccessType(e.target.value)}
                  className="w-full border-2 border-black p-3 bg-white focus:outline-none cursor-pointer appearance-none rounded-none"
                >
                  <option value="PUBLIC">Public</option>
                  <option value="PASSWORD">Password Protected</option>
                </select>
              </div>
            </div>

            {accessType === "PASSWORD" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-bold uppercase mb-2">Custom Password</label>
                <input
                  type="text"
                  required
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0 transition-all focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold uppercase mb-2">Expiry Date & Time</label>
              <input
                type="datetime-local"
                required
                value={expiryAt}
                onChange={(e) => setExpiryAt(e.target.value)}
                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0 transition-all focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold uppercase tracking-widest p-4 border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? "Creating..." : "Create Secure Note"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}