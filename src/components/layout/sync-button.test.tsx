import { render, screen } from "@testing-library/react";
import SyncButton from "./sync-button";
import { test, expect } from "vitest";

test("Sync button exists", () => {
  render(<SyncButton />);

  const element = screen.getByText("Sync");
  expect(element).toBeDefined();
});
