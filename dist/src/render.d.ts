import type { ProductIdentity } from "./products.js";
export interface RenderOptions {
  targetCols?: number;
  showDescription?: boolean;
  unicode?: boolean;
}
export declare function renderIdentity(product: ProductIdentity, options?: RenderOptions): string;
