"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { SiteData } from "@/app/data/siteDataManager";

interface AdminContextType {
  token: string | null;
  isLoggedIn: boolean;
  siteData: SiteData | null;
  loading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  fetchData: () => Promise<void>;
  updateSection: (section: keyof SiteData, value: unknown) => Promise<boolean>;
  uploadFile: (file: File, folder: string) => Promise<string | null>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(false);

  // Restore token from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) return false;
      const { token: t } = await res.json();
      setToken(t);
      localStorage.setItem("admin_token", t);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setSiteData(null);
    localStorage.removeItem("admin_token");
  };

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSiteData(data);
      }
    } catch {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateSection = async (section: keyof SiteData, value: unknown): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch("/api/admin/data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ section, value }),
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    if (!token) return null;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const { url } = await res.json();
        return url;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Auto-fetch when logged in
  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);

  return (
    <AdminContext.Provider
      value={{
        token,
        isLoggedIn: !!token,
        siteData,
        loading,
        login,
        logout,
        fetchData,
        updateSection,
        uploadFile,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
