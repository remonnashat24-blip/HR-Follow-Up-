"use client";

import { createContext, useContext, useState, useCallback, useSyncExternalStore, ReactNode } from "react";

export type UserRole = "admin" | "user";

export interface UserPermissions {
  userName: string;
  department: string | null; // null means all departments
  canAddEmployees: boolean;
  canEditEmployees: boolean;
  canDeleteEmployees: boolean;
  canAddProbations: boolean;
  canEvaluateProbations: boolean;
  canDeleteProbations: boolean;
  canAddContracts: boolean;
  canRenewContracts: boolean;
  canDeleteContracts: boolean;
  canImportData: boolean;
}

const defaultPermissions: UserPermissions = {
  userName: "مستخدم",
  department: null,
  canAddEmployees: true,
  canEditEmployees: true,
  canDeleteEmployees: false,
  canAddProbations: true,
  canEvaluateProbations: true,
  canDeleteProbations: false,
  canAddContracts: true,
  canRenewContracts: true,
  canDeleteContracts: false,
  canImportData: true,
};

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  userName: string;
  setUserName: (name: string) => void;
  permissions: UserPermissions;
  setPermissions: (perms: UserPermissions) => void;
}

const AuthContext = createContext<AuthContextType>({
  role: "user",
  setRole: () => {},
  isAdmin: false,
  userName: "مستخدم",
  setUserName: () => {},
  permissions: defaultPermissions,
  setPermissions: () => {},
});

function getStoredRole(): UserRole {
  if (typeof window === "undefined") return "user";
  const saved = localStorage.getItem("userRole");
  return saved === "admin" ? "admin" : "user";
}

function getStoredUserName(): string {
  if (typeof window === "undefined") return "مستخدم";
  return localStorage.getItem("userName") || "مستخدم";
}

function getStoredPermissions(): UserPermissions {
  if (typeof window === "undefined") return defaultPermissions;
  const saved = localStorage.getItem("userPermissions");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultPermissions;
    }
  }
  return defaultPermissions;
}

let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): { role: UserRole; userName: string; permissions: UserPermissions } {
  return {
    role: getStoredRole(),
    userName: getStoredUserName(),
    permissions: getStoredPermissions(),
  };
}

function getServerSnapshot(): { role: UserRole; userName: string; permissions: UserPermissions } {
  return { role: "user", userName: "مستخدم", permissions: defaultPermissions };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { role, userName, permissions } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const setRole = useCallback((newRole: UserRole) => {
    localStorage.setItem("userRole", newRole);
    listeners.forEach((listener) => listener());
  }, []);

  const setUserName = useCallback((name: string) => {
    localStorage.setItem("userName", name);
    listeners.forEach((listener) => listener());
  }, []);

  const setPermissions = useCallback((perms: UserPermissions) => {
    localStorage.setItem("userPermissions", JSON.stringify(perms));
    listeners.forEach((listener) => listener());
  }, []);

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        isAdmin: role === "admin",
        userName,
        setUserName,
        permissions,
        setPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
