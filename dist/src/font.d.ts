export type Glyph = readonly string[];
export declare const FONT_HEIGHT = 7;
export declare function glyphFor(character: string): Glyph;
export declare function renderWord(text: string, spacing?: number): boolean[][];
