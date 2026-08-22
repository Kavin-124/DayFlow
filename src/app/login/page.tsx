"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center py-12 px-4">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#714B67]">
            Day<span className="text-[#00A09D]">Flow</span>
          </h1>
          <p className="mt-1.5 text-xs text-gray-500 font-medium">
            Sign in to access your Human Capital Management dashboard.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 p-3 rounded-lg text-xs border border-rose-200 font-medium">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#714B67] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#714B67] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-[#714B67] hover:bg-[#5c3d54] transition disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div 
          onClick={() => {
            setEmail("admin@dayflow.com");
            setPassword("admin123");
          }}
          className="cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg p-2.5 text-center text-xs text-slate-600 transition font-medium flex items-center justify-center gap-1"
          title="Click to auto-fill demo credentials"
        >
          <span className="font-bold text-[#714B67]">Demo Admin:</span> admin@dayflow.com / admin123
        </div>

        <p className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          New employee?{" "}
          <Link href="/register" className="font-semibold text-[#714B67] hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
