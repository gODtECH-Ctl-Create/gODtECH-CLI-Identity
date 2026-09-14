import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
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

test("ASCII fallback contains no Unicode block characters", () => {
  const result = composeLogo("GODTECH", "FORGE", { targetCols: 80, unicode: false });
  assert.ok(result.includes("#"));
  assert.ok(!/[█▀▄]/u.test(result));
  assert.ok(lines(result).every((line) => line.length <= 80));
});

test("all registered CLI products render successfully", () => {
  for (const product of ["forge", "steward", "stackpilot"]) {
    const result = spawnSync(process.execPath, ["dist/src/cli.js", product, "--width", "80"], {
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    assert.ok(result.stdout.length > 0);
  }
});

test("quiet mode produces no output", () => {
  const result = spawnSync(process.execPath, ["dist/src/cli.js", "forge", "--quiet"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "");
});

test("JSON mode is machine readable and contains no banner", () => {
  const result = spawnSync(process.execPath, ["dist/src/cli.js", "steward", "--json"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout) as { id: string; name: string };
  assert.equal(parsed.id, "steward");
  assert.equal(parsed.name, "STEWARD");
  assert.ok(!/[█▀▄]/u.test(result.stdout));
});

test("ASCII CLI mode avoids Unicode blocks", () => {
  const result = spawnSync(process.execPath, ["dist/src/cli.js", "stackpilot", "--ascii"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes("#"));
  assert.ok(!/[█▀▄]/u.test(result.stdout));
});

test("invalid CLI options fail with exit code 2", () => {
  const result = spawnSync(process.execPath, ["dist/src/cli.js", "forge", "--wat"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Unknown option/u);
});

test("missing width values fail with exit code 2", () => {
  const result = spawnSync(process.execPath, ["dist/src/cli.js", "forge", "--width"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Missing value/u);
});
