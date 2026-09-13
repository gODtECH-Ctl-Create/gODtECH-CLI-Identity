export interface ProductIdentity {
  id: string;
  name: string;
  symbol: string;
  description: string;
}

export const PRODUCTS: Record<string, ProductIdentity> = {
  forge: {
    id: "forge",
    name: "FORGE",
    symbol: "AXE",
    description: "Framework for Orchestrated Reasoning, Governance & Engineering",
  },
  steward: {
    id: "steward",
    name: "STEWARD",
    symbol: "DIAMOND",
    description: "Deterministic software and repository housekeeping",
  },
  stackpilot: {
    id: "stackpilot",
    name: "STACKPILOT",
    symbol: "DIAMOND-HOLLOW",
    description: "Opinionated project scaffolding for production-minded repositories",
  },
};

export function getProduct(id: string): ProductIdentity | undefined {
  return PRODUCTS[id.trim().toLowerCase()];
}
