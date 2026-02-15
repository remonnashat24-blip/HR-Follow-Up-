"use client";

import { createContext, useContext, useState, useCallback, useSyncExternalStore, ReactNode } from "react";

export type UserRole = "admin" | "user";

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  role: "user",
  setRole: () => {},
  isAdmin: false,
});

function getStoredRole(): UserRole {
  if (typeof window === "undefined") return "user";
  const saved = localStorage.getItem("userRole");
  return saved === "admin" ? "admin" : "user";
}

let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): UserRole {
  return getStoredRole();
}

function getServerSnapshot(): UserRole {
  return "user";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const role = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setRole = useCallback((newRole: UserRole) => {
    localStorage.setItem("userRole", newRole);
    // Notify all subscribers
    listeners.forEach((listener) => listener());
  }, []);

  return (
    <AuthContext.Provider value={{ role, setRole, isAdmin: role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
