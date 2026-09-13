import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const files = (await readdir("dist/test"))
  .filter((name) => name.endsWith(".test.js"))
  .sort()
  .map((name) => `dist/test/${name}`);

if (files.length === 0) {
  console.error("No compiled tests were found.");
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--test", ...files], {
  stdio: "inherit",
  shell: false,
});

process.exit(result.status ?? 1);
