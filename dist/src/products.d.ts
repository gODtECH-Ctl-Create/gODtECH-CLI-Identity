export interface ProductIdentity {
  id: string;
  name: string;
  symbol: string;
  description: string;
}
export declare const PRODUCTS: Record<string, ProductIdentity>;
export declare function getProduct(id: string): ProductIdentity | undefined;
