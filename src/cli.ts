#!/usr/bin/env node
import { composeLogo } from "./compose.js";
import { getProduct, PRODUCTS } from "./products.js";

const args = process.argv.slice(2);
const productArg = args.find((value) => !value.startsWith("-"));
const widthArg = args.findIndex((value) => value === "--width");
const width = widthArg >= 0 ? Number(args[widthArg + 1]) : 80;
const product = productArg ? getProduct(productArg) : undefined;

if (!productArg || args.includes("--help")) {
  console.log("gODtECH CLI Identity");
  console.log("");
  console.log("Usage: godtech-identity <forge|steward|stackpilot> [--width <cols>]");
  console.log("");
  console.log("Registered products:");
  for (const item of Object.values(PRODUCTS)) console.log(`  ${item.id.padEnd(10)} ${item.name}`);
  process.exit(productArg ? 0 : 1);
}

if (!product) {
  console.error(`Unknown product: ${productArg}`);
  process.exit(2);
}

const safeWidth = Number.isFinite(width) ? width : 80;
console.log(composeLogo("GODTECH", product.name, { targetCols: safeWidth }));
console.log("");
console.log(`${product.symbol} ${product.description}`);
