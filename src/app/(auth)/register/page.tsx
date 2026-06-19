"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4 font-sans text-black">
      <div className="w-full max-w-sm border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tight">Register</h1>
          <p className="text-sm font-medium mt-2 text-gray-600">Join NoteTaker today</p>
        </div>

        {error && (
          <div className="mb-6 p-3 border-2 border-black bg-red-50 text-red-600 font-semibold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0 transition-all focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0 transition-all focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0 transition-all focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-bold uppercase tracking-widest p-4 border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center border-t-2 border-black pt-6">
          <p className="text-sm font-medium">
            Already have an account?{" "}
            <Link href="/login" className="font-bold underline hover:no-underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}