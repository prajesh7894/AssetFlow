import { useState } from "react";
import { doc, setDoc, updateDoc, deleteDoc, collection } from "firebase/firestore";
import { db, isDemoMode } from "../lib/firebase";

export function useFirestoreMutation(collectionName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const triggerLocalUpdate = () => {
    window.dispatchEvent(new Event("demo_db_update"));
  };

  const getLocalData = () => {
    const raw = localStorage.getItem(`demo_${collectionName}`);
    return raw ? JSON.parse(raw) : [];
  };

  const saveLocalData = (data: any[]) => {
    localStorage.setItem(`demo_${collectionName}`, JSON.stringify(data));
    triggerLocalUpdate();
  };

  const createRecord = async (data: any, customId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const id = customId || `gen-${Date.now()}`;
      const payload = { id, ...data };

      if (isDemoMode) {
        const list = getLocalData();
        list.push(payload);
        saveLocalData(list);
      } else {
        const docRef = customId ? doc(db, collectionName, customId) : doc(collection(db, collectionName));
        await setDoc(docRef, { id: docRef.id, ...data });
      }
      setLoading(false);
      return payload;
    } catch (err: any) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const updateRecord = async (id: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      if (isDemoMode) {
        let list = getLocalData();
        list = list.map((item: any) => item.id === id ? { ...item, ...data } : item);
        saveLocalData(list);
      } else {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, data);
      }
      setLoading(false);
    } catch (err: any) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const deleteRecord = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (isDemoMode) {
        let list = getLocalData();
        list = list.filter((item: any) => item.id !== id);
        saveLocalData(list);
      } else {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
      }
      setLoading(false);
    } catch (err: any) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { createRecord, updateRecord, deleteRecord, loading, error };
}
