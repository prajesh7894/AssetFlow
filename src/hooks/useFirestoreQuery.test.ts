import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useFirestoreQuery } from "./useFirestoreQuery";

// Mock firebase config to always use demo mode
vi.mock("../lib/firebase", () => ({
  isDemoMode: true,
  db: {}, // dummy object
}));

describe("useFirestoreQuery", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should return empty array initially and then load data from localStorage", async () => {
    const mockData = [{ id: "1", name: "Asset A" }];
    localStorage.setItem("demo_assets", JSON.stringify(mockData));

    const { result } = renderHook(() => useFirestoreQuery("assets"));

    // Initially it should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual(mockData); // It sets data immediately from localStorage

    // Fast-forward timers for the setTimeout in the hook
    act(() => {
      vi.runAllTimers();
    });

    // After timer, loading is false
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
  });

  it("should update when localStorage 'demo_db_update' event is dispatched", () => {
    const { result } = renderHook(() => useFirestoreQuery("assets"));

    // Fast forward to resolve initial loading
    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.data).toEqual([]);

    // Simulate an external update
    const newData = [{ id: "2", name: "Asset B" }];
    localStorage.setItem("demo_assets", JSON.stringify(newData));

    act(() => {
      window.dispatchEvent(new Event("demo_db_update"));
    });

    // Hook should have the new data
    expect(result.current.data).toEqual(newData);
  });
});
