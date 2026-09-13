# gODtECH CLI Identity

Shared terminal identity renderer for gODtECH command-line products.

The renderer keeps GODTECH as the primary family mark and places the product name inside a centered cutout using the same block glyph system at a smaller scale.

First consumers:

- FORGE
- STEWARD
- STACKPILOT

Library:

```ts
import { composeLogo } from "@godtech/cli-identity";
console.log(composeLogo("GODTECH", "FORGE", { targetCols: 80 }));
```

CLI:

```bash
godtech-identity forge
godtech-identity steward --width 100
godtech-identity stackpilot --width 80
```

Design rules:

1. GODTECH stays recognizable.
2. The product uses the same block typography.
3. The product is smaller but remains bold and readable.
4. Long product names shrink proportionally to fit.
5. Machine-readable and quiet modes should skip decorative output.
6. New products are added as profiles and reuse the same renderer.

Development:

```bash
npm ci
npm run check
npm test
```

Apache License 2.0.
