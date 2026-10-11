"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget, unlockScroll } from "@/lib/scroll";
import { cv } from "./ui/cssvars";

const CSS = `
.progress{position:fixed;left:0;top:0;height:2px;width:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(0);z-index:70;pointer-events:none}
.hdr{position:fixed;top:14px;left:0;right:0;z-index:50;pointer-events:none}
.hdr-inner{max-width:none;display:flex;align-items:center;justify-content:space-between;gap:16px}
.hdr a,.hdr button{pointer-events:auto}
.brand{margin-left:-6px;display:inline-flex;align-items:center;gap:12px;padding:6px 12px 6px 6px;border-radius:999px;transition:background-color .6s var(--ease),box-shadow .6s var(--ease),backdrop-filter .6s var(--ease)}
.mark{width:44px;height:44px;flex:none;border-radius:50%;box-shadow:inset 0 0 0 1px var(--ink);display:grid;place-items:center;font:600 13px/1 var(--font-mono);letter-spacing:.04em;transition:background-color .6s var(--ease),color .6s var(--ease),transform 1s var(--ease)}
.brand:hover .mark{transform:rotate(360deg)}
.is-scrolled .mark{background:var(--ink);color:#fff}
.brand-name{font-weight:600;font-size:15px;letter-spacing:-.01em;white-space:nowrap;transition:opacity .5s var(--ease),transform .6s var(--ease)}
.is-scrolled .brand-name{opacity:0;transform:translateX(-8px);pointer-events:none}
.pill{position:relative;display:flex;align-items:center;padding:5px;border-radius:999px;transition:background-color .6s var(--ease),box-shadow .6s var(--ease),backdrop-filter .6s var(--ease)}
.is-scrolled .pill{background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 12px 30px -18px rgba(0,0,0,.25)}
.pill ul{display:flex;gap:2px}
.pill a{position:relative;z-index:1;display:block;padding:9px 16px;border-radius:999px;font-size:14px;font-weight:500;color:var(--ink-2);transition:color .5s var(--ease)}
.pill a[aria-current="true"]{color:#fff}
.ind{position:absolute;top:5px;bottom:5px;left:0;width:var(--w);transform:translateX(var(--x));border-radius:999px;background:var(--ink);transition:transform .8s var(--ease),width .8s var(--ease),opacity .4s var(--ease)}
.menu-btn{display:none;align-items:center;height:44px;padding:0 20px;border-radius:999px;background:var(--ink);color:#fff;font-weight:600;font-size:14px}
.overlay{position:fixed;inset:0;z-index:60;background:var(--paper);visibility:hidden;clip-path:circle(0px at calc(100% - 58px) 36px);transition:clip-path 1s var(--ease),visibility 0s linear 1s;display:flex;flex-direction:column;padding:22px 0 40px;overflow-y:auto}
.overlay.is-open{visibility:visible;clip-path:circle(150% at calc(100% - 58px) 36px);transition:clip-path 1s var(--ease),visibility 0s}
.ov-top{display:flex;justify-content:space-between;align-items:center;height:48px}
.ov-close{height:44px;padding:0 18px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);font-weight:600;font-size:14px}
.ov-links{margin-top:auto;padding-top:48px;display:grid;gap:6px}
.ov-links a{display:flex;align-items:baseline;gap:16px;font-weight:700;font-size:clamp(44px,13vw,76px);letter-spacing:-.04em;line-height:1.08;opacity:0;transform:translateY(24px);transition:opacity .8s var(--ease),transform .8s var(--ease);transition-delay:calc(.2s + var(--i,0) * 70ms)}
.overlay.is-open .ov-links a{opacity:1;transform:none}
.ov-links .mono{font-size:12px;color:var(--mute)}
@media (max-width:899px){
  .nav-desktop{display:none}
  .menu-btn{display:inline-flex}
}
`;

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [ind, setInd] = useState({ x: 0, w: 0 });
  const progressRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // Frosted state and page progress bar.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Active section: the section that crosses the middle band of the viewport.
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Indicator pill follows the active link.
  useEffect(() => {
    const place = () => {
      const el = linkRefs.current[active];
      setInd(el ? { x: el.offsetLeft, w: el.offsetWidth } : { x: 0, w: 0 });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  // Mobile menu: lock scrolling, Esc closes.
  useEffect(() => {
    if (!open) return;
    lockScroll();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
    // closeMenu is stable for this component's purposes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    menuBtnRef.current?.focus();
  };

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (open) {
      setOpen(false);
      window.setTimeout(() => scrollToTarget(id), 350);
    } else {
      scrollToTarget(id);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div ref={progressRef} className="progress" aria-hidden="true" />

      <header className={`hdr${scrolled ? " is-scrolled" : ""}`}>
        <div className="hdr-inner wrap">
          <a href="#top" className="brand" onClick={go("top")}>
            <span className="mark" aria-hidden="true">
              {PROFILE.initials}
            </span>
            <span className="brand-name">{PROFILE.name}</span>
          </a>

          <nav className="nav-desktop" aria-label="Primary">
            <div className="pill">
              <span className="ind" aria-hidden="true" style={cv({ "--x": `${ind.x}px`, "--w": `${ind.w}px`, opacity: ind.w ? 1 : 0 })} />
              <ul>
                {NAV.map((n) => (
                  <li key={n.id}>
                    <a
                      ref={(el) => {
                        linkRefs.current[n.id] = el;
                      }}
                      href={`#${n.id}`}
                      onClick={go(n.id)}
                      aria-current={active === n.id ? "true" : undefined}
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <button
            ref={menuBtnRef}
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        className={`overlay${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
      >
        <div className="ov-top wrap">
          <span className="mono">Menu</span>
          <button ref={closeRef} type="button" className="ov-close" onClick={closeMenu}>
            Close
          </button>
        </div>
        <ol className="ov-links wrap">
          {NAV.map((n, i) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={go(n.id)} style={cv({ "--i": i })}>
                <span className="mono">0{i + 1}</span>
                {n.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
