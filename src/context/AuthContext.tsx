import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  demoLogin: () => void;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, demoLogin: () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if demo user is stored in session
    const isDemo = sessionStorage.getItem("demo_user") === "true";
    if (isDemo) {
      setUser({ uid: "demo-123", email: "demo@assetflow.local", displayName: "Demo Admin" } as User);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return unsubscribe;
    } catch (err) {
      console.warn("Firebase Auth init failed, check config.", err);
      setLoading(false);
    }
  }, []);

  const demoLogin = () => {
    sessionStorage.setItem("demo_user", "true");
    setUser({ uid: "demo-123", email: "demo@assetflow.local", displayName: "Demo Admin" } as User);
  };

  return (
    <AuthContext.Provider value={{ user, loading, demoLogin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
