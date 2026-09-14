import { composeLogo, centerLine } from "./compose.js";
export function renderIdentity(product, options = {}) {
  const targetCols = options.targetCols ?? 80;
  const logo = composeLogo("GODTECH", product.name, { targetCols, unicode: options.unicode });
  if (options.showDescription === false) return logo;
  return `${logo}\n\n${centerLine(product.description, targetCols)}`;
}
