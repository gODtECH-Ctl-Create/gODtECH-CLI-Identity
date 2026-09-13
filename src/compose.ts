import { renderWord } from "./font.js";

export interface ComposeOptions {
  targetCols?: number;
  scale?: number;
  maxSecondaryWidthFrac?: number;
  threshold?: number;
  secondaryThreshold?: number;
  paddingFrac?: number;
  glyphSpacing?: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function areaResize(input: boolean[][], outputRows: number, outputCols: number, threshold: number): boolean[][] {
  const inRows = input.length;
  const inCols = input[0]?.length ?? 0;
  const output = Array.from({ length: outputRows }, () => Array(outputCols).fill(false));

  if (!inRows || !inCols) return output;

  for (let y = 0; y < outputRows; y += 1) {
    const y0 = (y * inRows) / outputRows;
    const y1 = ((y + 1) * inRows) / outputRows;
    const ys = Math.max(0, Math.floor(y0));
    const ye = Math.min(inRows - 1, Math.ceil(y1) - 1);

    for (let x = 0; x < outputCols; x += 1) {
      const x0 = (x * inCols) / outputCols;
      const x1 = ((x + 1) * inCols) / outputCols;
      const xs = Math.max(0, Math.floor(x0));
      const xe = Math.min(inCols - 1, Math.ceil(x1) - 1);

      let weighted = 0;
      let area = 0;
      for (let iy = ys; iy <= ye; iy += 1) {
        const wy = Math.max(0, Math.min(y1, iy + 1) - Math.max(y0, iy));
        for (let ix = xs; ix <= xe; ix += 1) {
          const wx = Math.max(0, Math.min(x1, ix + 1) - Math.max(x0, ix));
          const weight = wy * wx;
          area += weight;
          if (input[iy]?.[ix]) weighted += weight;
        }
      }
      output[y]![x] = area > 0 && weighted / area >= threshold;
    }
  }

  return output;
}

function toHalfBlocks(mask: boolean[][]): string {
  let rows = mask;
  if (rows.length % 2 === 1) rows = [...rows, Array(rows[0]?.length ?? 0).fill(false)];
  const output: string[] = [];

  for (let y = 0; y < rows.length; y += 2) {
    const top = rows[y]!;
    const bottom = rows[y + 1]!;
    let line = "";
    for (let x = 0; x < top.length; x += 1) {
      const t = top[x] === true;
      const b = bottom[x] === true;
      line += t && b ? "█" : t ? "▀" : b ? "▄" : " ";
    }
    output.push(line.replace(/\s+$/u, ""));
  }

  return output.join("\n");
}

function widthOf(mask: boolean[][]): number {
  return mask.reduce((max, row) => Math.max(max, row.length), 0);
}

function normalize(mask: boolean[][]): boolean[][] {
  const width = widthOf(mask);
  return mask.map((row) => [...row, ...Array(Math.max(0, width - row.length)).fill(false)]);
}

export function composeLogo(primary: string, secondary: string, options: ComposeOptions = {}): string {
  const targetCols = Math.round(clamp(options.targetCols ?? 80, 40, 128));
  const scale = clamp(options.scale ?? 0.55, 0.30, 0.70);
  const maxSecondaryWidthFrac = clamp(options.maxSecondaryWidthFrac ?? 0.58, 0.35, 0.80);
  const threshold = clamp(options.threshold ?? 0.35, 0.05, 0.95);
  const secondaryThreshold = clamp(options.secondaryThreshold ?? 0.25, 0.05, 0.95);
  const paddingFrac = clamp(options.paddingFrac ?? 0.08, 0.02, 0.25);
  const spacing = Math.max(0, Math.floor(options.glyphSpacing ?? 1));

  const primaryRaw = normalize(renderWord(primary, spacing));
  const primaryAspect = primaryRaw.length / Math.max(1, widthOf(primaryRaw));
  const textRows = Math.max(5, Math.round((primaryAspect * targetCols) / 2));
  const miniRows = textRows * 2;
  const primaryGrid = areaResize(primaryRaw, miniRows, targetCols, threshold);

  const secondaryRaw = normalize(renderWord(secondary, spacing));
  const rawSecondaryRows = Math.max(4, Math.round(scale * miniRows));
  const rawSecondaryCols = Math.max(
    4,
    Math.round((rawSecondaryRows * widthOf(secondaryRaw)) / Math.max(1, secondaryRaw.length))
  );

  let secondaryRows = rawSecondaryRows;
  let secondaryCols = rawSecondaryCols;
  let paddingHorizontal = Math.max(2, Math.round(secondaryCols * paddingFrac));
  const maxSecondaryWidth = Math.max(8, Math.floor(targetCols * maxSecondaryWidthFrac));

  if (secondaryCols + paddingHorizontal * 2 > maxSecondaryWidth) {
    const fit = (maxSecondaryWidth - paddingHorizontal * 2) / Math.max(1, secondaryCols);
    secondaryCols = Math.max(4, Math.floor(secondaryCols * fit));
    secondaryRows = Math.max(4, Math.floor(secondaryRows * fit));
    paddingHorizontal = Math.max(2, Math.round(secondaryCols * paddingFrac));
  }

  const secondaryMask = areaResize(secondaryRaw, secondaryRows, secondaryCols, secondaryThreshold);
  const paddingVertical = Math.max(1, Math.round(secondaryRows * paddingFrac));
  const bandRows = secondaryRows + paddingVertical * 2;
  const bandCols = secondaryCols + paddingHorizontal * 2;
  const startRow = Math.max(0, Math.floor((miniRows - bandRows) / 2));
  const startCol = Math.max(0, Math.floor((targetCols - bandCols) / 2));

  for (let y = startRow; y < Math.min(miniRows, startRow + bandRows); y += 1) {
    for (let x = startCol; x < Math.min(targetCols, startCol + bandCols); x += 1) {
      primaryGrid[y]![x] = false;
    }
  }

  const secondaryStartRow = startRow + paddingVertical;
  const secondaryStartCol = startCol + paddingHorizontal;
  for (let y = 0; y < secondaryRows; y += 1) {
    for (let x = 0; x < secondaryCols; x += 1) {
      if (secondaryMask[y]?.[x]) {
        const targetY = secondaryStartRow + y;
        const targetX = secondaryStartCol + x;
        if (targetY < miniRows && targetX < targetCols) primaryGrid[targetY]![targetX] = true;
      }
    }
  }

  return toHalfBlocks(primaryGrid);
}

export function centerLine(text: string, targetCols = 80): string {
  const width = Math.max(0, targetCols - text.length);
  const left = Math.floor(width / 2);
  return `${" ".repeat(left)}${text}`;
}
