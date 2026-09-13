import assert from "node:assert/strict";
import test from "node:test";
import { composeLogo } from "../src/compose.js";

function lines(value: string): string[] {
  return value.split("\n");
}

test("GODTECH + FORGE is deterministic and fits the requested width", () => {
  const first = composeLogo("GODTECH", "FORGE", { targetCols: 80 });
  const second = composeLogo("GODTECH", "FORGE", { targetCols: 80 });
  assert.equal(first, second);
  assert.ok(lines(first).length > 0);
  assert.ok(lines(first).every((line) => line.length <= 80));
});

test("long secondary names are fitted without exceeding the primary canvas", () => {
  const result = composeLogo("GODTECH", "STACKPILOT", { targetCols: 80 });
  assert.ok(lines(result).every((line) => line.length <= 80));
  assert.ok(result.includes("█") || result.includes("▀") || result.includes("▄"));
});

test("narrow terminals stay within the supported minimum width", () => {
  const result = composeLogo("GODTECH", "STEWARD", { targetCols: 40 });
  assert.ok(lines(result).every((line) => line.length <= 40));
});
