# gODtECH CLI Identity

Shared terminal identity renderer for gODtECH command-line products.

The renderer keeps GODTECH as the primary family mark and places the product name inside a centered cutout using the same block glyph system at a smaller scale.

First consumers:

- FORGE
- STEWARD
- STACKPILOT

## Library

```ts
import { composeLogo } from "@godtech/cli-identity";

console.log(composeLogo("GODTECH", "FORGE", { targetCols: 80 }));
```

Use the ASCII fallback when Unicode block glyphs are unsuitable:

```ts
console.log(
  composeLogo("GODTECH", "STEWARD", {
    targetCols: 80,
    unicode: false,
  })
);
```

## CLI

```bash
godtech-identity forge
godtech-identity steward --width 100
godtech-identity stackpilot --width 80
```

Supported output modes:

```bash
# ASCII-only rendering
godtech-identity forge --ascii

# No decorative banner; metadata only
godtech-identity steward --no-banner

# Machine-readable metadata only
godtech-identity stackpilot --json

# No output at all
godtech-identity forge --quiet
```

Run `godtech-identity --help` for the complete option list.

## Integration contract

Interactive gODtECH products may display the shared identity at startup. Automation and machine-readable paths must remain decoration-free.

Recommended behavior for consumers:

- interactive terminal: render the normal Unicode identity
- limited terminal: render with `unicode: false` or use `--ascii`
- JSON or machine output: use structured output without the banner
- quiet mode: do not render identity output
- piped or CI output: consumers should explicitly disable decorative output when it would interfere with parsing or logs

FORGE is the first consumer integration, followed by STEWARD and STACKPILOT.

## Design rules

1. GODTECH stays recognizable.
2. The product uses the same block typography.
3. The product is smaller but remains bold and readable.
4. Long product names shrink proportionally to fit.
5. Machine-readable and quiet modes skip decorative output.
6. Unicode-limited terminals can use the ASCII fallback.
7. New products are added as profiles and reuse the same renderer.

## Development

```bash
npm ci
npm run check
npm test
```

CI validates Node.js 20 and 22.

Apache License 2.0.
