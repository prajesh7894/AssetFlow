import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFirestoreMutation } from "./useFirestoreMutation";

// Mock firebase config to always use demo mode
vi.mock("../lib/firebase", () => ({
  isDemoMode: true,
  db: {}, // dummy object
}));

describe("useFirestoreMutation", () => {
  beforeEach(() => {
    localStorage.clear();
    // Spy on window.dispatchEvent to ensure events are fired
    vi.spyOn(window, "dispatchEvent");
  });

  it("should create a new record and update localStorage", async () => {
    const { result } = renderHook(() => useFirestoreMutation("assets"));

    const newRecord = { name: "Test Asset", value: 100 };

    await act(async () => {
      await result.current.createRecord(newRecord, "test-id-123");
    });

    // Check localStorage
    const localData = JSON.parse(localStorage.getItem("demo_assets") || "[]");
    expect(localData).toHaveLength(1);
    expect(localData[0]).toEqual({ id: "test-id-123", ...newRecord });

    // Ensure the event was fired
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(Event));
  });

  it("should update an existing record in localStorage", async () => {
    // Setup initial data
    const initialData = [{ id: "test-id-123", name: "Old Asset", value: 50 }];
    localStorage.setItem("demo_assets", JSON.stringify(initialData));

    const { result } = renderHook(() => useFirestoreMutation("assets"));

    await act(async () => {
      await result.current.updateRecord("test-id-123", { name: "Updated Asset" });
    });

    // Check localStorage
    const localData = JSON.parse(localStorage.getItem("demo_assets") || "[]");
    expect(localData).toHaveLength(1);
    expect(localData[0].name).toBe("Updated Asset");
    expect(localData[0].value).toBe(50); // Kept old field
  });

  it("should delete a record from localStorage", async () => {
    // Setup initial data
    const initialData = [
      { id: "1", name: "Keep Me" },
      { id: "2", name: "Delete Me" },
    ];
    localStorage.setItem("demo_assets", JSON.stringify(initialData));

    const { result } = renderHook(() => useFirestoreMutation("assets"));

    await act(async () => {
      await result.current.deleteRecord("2");
    });

    // Check localStorage
    const localData = JSON.parse(localStorage.getItem("demo_assets") || "[]");
    expect(localData).toHaveLength(1);
    expect(localData[0].id).toBe("1");
  });
});
