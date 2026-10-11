import type { ReactNode } from "react";
import { BRAND_HEX } from "@/lib/logos.generated";
import type { ConceptId, Skill } from "@/lib/data";

/**
 * Thin line icons for concepts and for marks that are not available as brand SVGs.
 * Drawn on a 24×24 grid, stroke only, so they match each other.
 */
const CONCEPT: Record<ConceptId, ReactNode> = {
  api: (
    <>
      <path d="M4 8h13" />
      <path d="M14 4l4 4-4 4" />
      <path d="M20 16H7" />
      <path d="M10 12l-4 4 4 4" />
    </>
  ),
  micro: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M8.5 6h7M7.2 8.2l3.7 7.6M16.8 8.2l-3.7 7.6" />
    </>
  ),
  clean: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.5" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  ddd: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M3 12h4M17 12h4M12 3v4M12 17v4" />
    </>
  ),
  cqrs: (
    <>
      <path d="M4 6h7l3 3" />
      <path d="M20 6h-6" />
      <path d="M4 18h16" />
      <path d="M16 15l3 3-3 3" />
    </>
  ),
  mvc: (
    <>
      <rect x="3" y="4" width="6" height="6" rx="1" />
      <rect x="15" y="4" width="6" height="6" rx="1" />
      <rect x="9" y="14" width="6" height="6" rx="1" />
      <path d="M9 7h6M12 14v-3" />
    </>
  ),
  table: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 4v16" />
    </>
  ),
  db: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
      <path d="M3 17.5l9 5 9-5" />
    </>
  ),
  cloud: <path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4 4 0 0 1 0 9z" />,
  pipeline: (
    <>
      <path d="M4 12a8 8 0 0 1 14-5.3" />
      <path d="M20 12a8 8 0 0 1-14 5.3" />
      <path d="M18 3v4h-4" />
      <path d="M6 21v-4h4" />
    </>
  ),
};

type Props = {
  skill: Pick<Skill, "logo" | "concept">;
  size: number;
};

/** Brand mark when one exists (official colour), otherwise a line icon. */
export function TechLogo({ skill, size }: Props) {
  if (skill.concept) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {CONCEPT[skill.concept]}
      </svg>
    );
  }
  if (!skill.logo) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/logos/${skill.logo}.svg`} alt="" width={size} height={size} loading="lazy" decoding="async" />
  );
}

export function isBrand(skill: Pick<Skill, "logo">): boolean {
  return Boolean(skill.logo);
}

export function brandHex(skill: Pick<Skill, "logo">): string | undefined {
  return skill.logo ? BRAND_HEX[skill.logo] : undefined;
}
