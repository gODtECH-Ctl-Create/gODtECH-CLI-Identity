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
export declare function composeLogo(primary: string, secondary: string, options?: ComposeOptions): string;
export declare function centerLine(text: string, targetCols?: number): string;
