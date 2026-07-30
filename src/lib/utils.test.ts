import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge tailwind classes correctly", () => {
    const result = cn("bg-red-500", "text-white");
    expect(result).toBe("bg-red-500 text-white");
  });

  it("should resolve tailwind conflicts", () => {
    const result = cn("p-4", "p-8");
    expect(result).toBe("p-8");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const isError = false;
    const result = cn("base-class", isActive && "active-class", isError && "error-class");
    expect(result).toBe("base-class active-class");
  });
});
