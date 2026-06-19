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
    <div className="max-w-xl mx-auto mt-10 p-5">
      <Link href="/notes" className="underline mb-5 inline-block">
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-5">Create Note</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}

        <input
          type="text"
          required
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />

        <textarea
          required
          rows={6}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-full"
        />

        <select
          value={shareType}
          onChange={(e) => setShareType(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="TIME_BASED">Time Based</option>
          <option value="ONE_TIME">One Time View</option>
        </select>

        <select
          value={accessType}
          onChange={(e) => setAccessType(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="PUBLIC">Public</option>
          <option value="PASSWORD">Password Protected</option>
        </select>

        {accessType === "PASSWORD" && (
          <input
            type="text"
            required
            placeholder="Custom Password"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            className="border p-2 w-full"
          />
        )}

        <input
          type="datetime-local"
          required
          value={expiryAt}
          onChange={(e) => setExpiryAt(e.target.value)}
          className="border p-2 w-full"
        />

        <button type="submit" disabled={loading} className="border px-4 py-2 w-full">
          {loading ? "Creating..." : "Create Secure Note"}
        </button>
      </form>
    </div>
  );
}