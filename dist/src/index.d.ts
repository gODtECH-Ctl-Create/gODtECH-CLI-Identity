export interface ComposeOptions {
  targetCols?: number;
  scale?: number;
  maxSecondaryWidthFrac?: number;
  threshold?: number;
  secondaryThreshold?: number;
  paddingFrac?: number;
  glyphSpacing?: number;
  unicode?: boolean;
}
export interface ProductIdentity {
  id: string;
  name: string;
  symbol: string;
  description: string;
}
export interface RenderOptions {
  targetCols?: number;
  showDescription?: boolean;
  unicode?: boolean;
}
export declare function composeLogo(primary: string, secondary: string, options?: ComposeOptions): string;
export declare function centerLine(text: string, targetCols?: number): string;
export declare function renderIdentity(product: ProductIdentity, options?: RenderOptions): string;
export declare const PRODUCTS: Record<string, ProductIdentity>;
export declare function getProduct(id: string): ProductIdentity | undefined;
