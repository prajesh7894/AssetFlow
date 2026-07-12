import { useState, useEffect } from "react";
import { collection, query, onSnapshot, QueryConstraint } from "firebase/firestore";
import { db, isDemoMode } from "../lib/firebase";

export function useFirestoreQuery<T>(collectionName: string, ...queryConstraints: QueryConstraint[]) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Extract to separate variable for dependency array
  const constraintsString = JSON.stringify(queryConstraints);

  useEffect(() => {
    setLoading(true);

    if (isDemoMode) {
      // Demo Mode: read from localStorage to bypass Firebase hanging
      try {
        const localData = localStorage.getItem(`demo_${collectionName}`);
        if (localData) {
          setData(JSON.parse(localData));
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Local storage error:", err);
      }
      // Add a slight delay to simulate network
      setTimeout(() => setLoading(false), 500);
      
      // Setup a basic storage listener so cross-tab or updates reflect
      const handleStorageChange = () => {
        const updated = localStorage.getItem(`demo_${collectionName}`);
        if (updated) setData(JSON.parse(updated));
      };
      window.addEventListener("storage", handleStorageChange);
      // Dispatch a custom event for same-window updates
      window.addEventListener("demo_db_update", handleStorageChange);
      
      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("demo_db_update", handleStorageChange);
      };
    }

    // Real Firebase Mode
    const q = query(collection(db, collectionName), ...queryConstraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(results);
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, constraintsString]);

  return { data, loading, error };
}
