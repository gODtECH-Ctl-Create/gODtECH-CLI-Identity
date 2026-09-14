#!/usr/bin/env node
import { composeLogo } from "./compose.js";
import { getProduct, PRODUCTS } from "./products.js";
const args = process.argv.slice(2);
const valueFlags = new Set(["--width"]);
const supportedFlags = new Set(["--help", "--quiet", "--no-banner", "--ascii", "--json", "--width"]);
function readProductArg(values) {
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (valueFlags.has(value)) {
      index += 1;
      continue;
    }
    if (!value.startsWith("-")) return value;
  }
  return undefined;
}
function readFlagValue(values, flag) {
  const index = values.indexOf(flag);
  return index >= 0 ? values[index + 1] : undefined;
}
function printHelp() {
  console.log("gODtECH CLI Identity");
  console.log("");
  console.log("Usage: godtech-identity <forge|steward|stackpilot> [options]");
  console.log("");
  console.log("Options:");
  console.log("  --width <cols>  Fit the identity to a terminal width (40-128)");
  console.log("  --ascii         Use ASCII-only rendering instead of Unicode blocks");
  console.log("  --no-banner     Skip decorative art and print product metadata only");
  console.log("  --json          Print machine-readable product metadata only");
  console.log("  --quiet         Produce no output");
  console.log("  --help          Show this help text");
  console.log("");
  console.log("Registered products:");
  for (const item of Object.values(PRODUCTS)) console.log(`  ${item.id.padEnd(10)} ${item.name}`);
}
for (let index = 0; index < args.length; index += 1) {
  const value = args[index];
  if (!value.startsWith("-")) continue;
  if (!supportedFlags.has(value)) {
    console.error(`Unknown option: ${value}`);
    process.exit(2);
  }
  if (valueFlags.has(value)) {
    if (index + 1 >= args.length || args[index + 1].startsWith("-")) {
      console.error(`Missing value for ${value}`);
      process.exit(2);
    }
    index += 1;
  }
}
const productArg = readProductArg(args);
if (args.includes("--help")) {
  printHelp();
  process.exit(0);
}
if (!productArg) {
  printHelp();
  process.exit(1);
}
const product = getProduct(productArg);
if (!product) {
  console.error(`Unknown product: ${productArg}`);
  process.exit(2);
}
if (args.includes("--quiet")) process.exit(0);
if (args.includes("--json")) {
  console.log(JSON.stringify(product));
  process.exit(0);
}
if (args.includes("--no-banner")) {
  console.log(`${product.symbol} ${product.description}`);
  process.exit(0);
}
const widthValue = readFlagValue(args, "--width");
const width = widthValue === undefined ? 80 : Number(widthValue);
if (!Number.isFinite(width)) {
  console.error(`Invalid width: ${widthValue}`);
  process.exit(2);
}
console.log(composeLogo("GODTECH", product.name, {
  targetCols: width,
  unicode: !args.includes("--ascii"),
}));
console.log("");
console.log(`${product.symbol} ${product.description}`);
