"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

let instance: Lenis | null = null;

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Smooth-scrolls to an element id ("top" for the page top). Falls back to native scrolling. */
export function scrollToTarget(id: string) {
  const target: HTMLElement | number | null = id === "top" ? 0 : document.getElementById(id);
  if (target === null) return;
  if (instance) {
    instance.scrollTo(target, { offset: id === "top" ? 0 : -84, duration: 1.2 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: 0, behavior: "auto" });
  else target.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
}

export function lockScroll() {
  instance?.stop();
  document.body.style.overflow = "hidden";
}

export function unlockScroll() {
  instance?.start();
  document.body.style.overflow = "";
}

/** Lenis smooth scrolling. Not started when the visitor prefers reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    instance = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      instance = null;
    };
  }, []);
  return <>{children}</>;
}
