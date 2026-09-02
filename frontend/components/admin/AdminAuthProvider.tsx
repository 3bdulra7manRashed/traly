"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminUser, api } from "@/lib/api";

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: AdminUser) => void;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("traly_admin_token");
      const storedUser = localStorage.getItem("traly_admin_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn("Error restoring admin auth:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Route protection guard
  useEffect(() => {
    if (isLoading) return;

    const isLoginPage = pathname === "/admin/login";

    if (!token && !isLoginPage && pathname.startsWith("/admin")) {
      router.replace("/admin/login");
    } else if (token && isLoginPage) {
      router.replace("/admin");
    }
  }, [token, isLoading, pathname, router]);

  const login = (newToken: string, newUser: AdminUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("traly_admin_token", newToken);
    localStorage.setItem("traly_admin_user", JSON.stringify(newUser));
    router.replace("/admin");
  };

  const logout = async () => {
    try {
      if (token) {
        await api.logout().catch(() => {});
      }
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("traly_admin_token");
      localStorage.removeItem("traly_admin_user");
      router.replace("/admin/login");
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
