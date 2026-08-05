import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export type AppUser = User & { role?: "admin" | "employee" };

type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
  demoLogin: (role?: "admin" | "employee") => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  demoLogin: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if demo user is stored in session
    const isDemo = sessionStorage.getItem("demo_user") === "true";
    const demoRole = sessionStorage.getItem("demo_role") as "admin" | "employee" | null;
    if (isDemo) {
      setUser({
        uid: "demo-123",
        email: demoRole === "employee" ? "employee@assetflow.local" : "admin@assetflow.local",
        displayName: demoRole === "employee" ? "Demo Employee" : "Demo Admin",
        role: demoRole || "admin",
      } as AppUser);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // For a real app, you would fetch the role from Firestore here
          setUser({ ...firebaseUser, role: "admin" } as AppUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } catch (err) {
      console.warn("Firebase Auth init failed, check config.", err);
      setLoading(false);
    }
  }, []);

  const demoLogin = (role: "admin" | "employee" = "admin") => {
    sessionStorage.setItem("demo_user", "true");
    sessionStorage.setItem("demo_role", role);
    setUser({
      uid: "demo-123",
      email: role === "employee" ? "employee@assetflow.local" : "admin@assetflow.local",
      displayName: role === "employee" ? "Demo Employee" : "Demo Admin",
      role,
    } as AppUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, demoLogin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
