import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "./badge";

describe("Badge component", () => {
  it("renders correctly with default variant", () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-primary/10 text-primary");
  });

  it("applies secondary variant correctly", () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const badge = screen.getByText("Secondary");
    expect(badge).toHaveClass("bg-secondary text-secondary-foreground");
  });

  it("applies destructive variant correctly", () => {
    render(<Badge variant="destructive">Destructive</Badge>);
    const badge = screen.getByText("Destructive");
    expect(badge).toHaveClass("bg-destructive/10 text-destructive");
  });

  it("applies outline variant correctly", () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText("Outline");
    expect(badge).toHaveClass("text-foreground");
  });

  it("applies success variant correctly", () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText("Success");
    expect(badge).toHaveClass("bg-emerald-500/10 text-emerald-500");
  });

  it("merges custom classes properly", () => {
    render(<Badge className="test-badge-class">Custom Class</Badge>);
    const badge = screen.getByText("Custom Class");
    expect(badge).toHaveClass("test-badge-class");
  });
});
