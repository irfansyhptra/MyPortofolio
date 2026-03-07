"use client";

import React, { useState } from "react";
import { useAdmin } from "./AdminContext";

export default function AdminLogin() {
  const { login } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(password);
    if (!success) {
      setError("Password salah. Coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
            Admin Panel
          </h1>
          <p className="text-white/40 text-sm">Masukkan password untuk melanjutkan</p>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-5"
        >
          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-white/60 mb-2"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              required
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/[0.1] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#d10000]/50 focus:ring-1 focus:ring-[#d10000]/30 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-gradient-to-r from-[#d10000] to-[#ff4500] text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          Default password: admin123
        </p>
      </div>
    </div>
  );
}
