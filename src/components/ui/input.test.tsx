import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Input } from "./input";

describe("Input component", () => {
  it("renders correctly", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("flex h-9 w-full rounded-md border border-input");
  });

  it("applies custom class names properly", () => {
    render(<Input placeholder="Test" className="custom-input-class" />);
    const input = screen.getByPlaceholderText("Test");
    expect(input).toHaveClass("custom-input-class");
  });

  it("handles user typing correctly", () => {
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText("Type here") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Hello world" } });
    expect(input.value).toBe("Hello world");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input placeholder="Disabled input" disabled />);
    const input = screen.getByPlaceholderText("Disabled input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:cursor-not-allowed");
  });

  it("supports different input types", () => {
    render(<Input placeholder="Password" type="password" />);
    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("type", "password");
  });
});
