import { composeLogo, centerLine } from "./compose.js";
import type { ProductIdentity } from "./products.js";

export interface RenderOptions {
  targetCols?: number;
  showDescription?: boolean;
}

export function renderIdentity(product: ProductIdentity, options: RenderOptions = {}): string {
  const targetCols = options.targetCols ?? 80;
  const logo = composeLogo("GODTECH", product.name, { targetCols });
  if (options.showDescription === false) return logo;
  return `${logo}\n\n${centerLine(product.description, targetCols)}`;
}
