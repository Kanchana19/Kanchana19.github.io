import type { CSSProperties } from "react";

/** Typed helper for CSS custom properties in React style objects. */
export const cv = (vars: Record<string, string | number>) => vars as CSSProperties;
