"use client";

import { useState, type PointerEvent } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";
import { ArrowUpRight } from "../ui/Icons";

const TITLE = "Let's build something together.";

const CSS = `
.ct-title{font-weight:700;font-size:clamp(46px,8.2vw,150px);line-height:.92;letter-spacing:-.065em}
.ct-title .word{display:inline-block;white-space:nowrap}
.ct-title em{font-family:var(--font-serif);font-style:italic;font-weight:400;color:var(--mute);letter-spacing:-.03em}
.ltr{display:inline-block;white-space:pre}
.ltr.hop{animation:hop .7s var(--ease)}
@keyframes hop{0%{transform:translateY(0)}30%{transform:translateY(-.14em)}60%{transform:translateY(.03em)}100%{transform:translateY(0)}}
.ct-grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:clamp(32px,6vw,96px);align-items:end;margin-top:clamp(40px,7vh,72px)}
.ct-mail{display:inline-block;font-weight:600;font-size:clamp(20px,3vw,42px);letter-spacing:-.03em;line-height:1.2;text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:.2em;overflow-wrap:anywhere;transition:text-decoration-thickness .4s var(--ease)}
.ct-mail:hover{text-decoration-thickness:3px}
.copy-row{display:flex;align-items:center;gap:12px;margin-top:22px;flex-wrap:wrap}
.copy-btn{display:inline-flex;align-items:center;min-height:40px;padding:0 16px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);font-size:14px;font-weight:600;transition:background-color .45s var(--ease),color .45s var(--ease)}
.copy-btn:hover{background:var(--ink);color:#fff}
.ct-links{border-top:1px solid var(--line)}
.ct-links a{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid var(--line);font-weight:500;transition:padding .6s var(--ease)}
.ct-links a:hover{padding-left:10px}
.ct-links small{display:block;color:var(--mute);font:500 11px/1.4 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}
.ct-links span:last-child{display:inline-flex;align-items:center;gap:8px;text-align:right}
@media (max-width:479px){.ct-links span:last-child{flex-wrap:wrap;justify-content:flex-end;overflow-wrap:anywhere}}
.badge{position:relative;width:150px;height:150px;justify-self:end;display:grid;place-items:center}
.badge > svg{position:absolute;inset:0;width:100%;height:100%;animation:spin 18s linear infinite}
.badge text{font:600 11px var(--font-mono);letter-spacing:.26em;fill:var(--ink)}
.badge-core{width:44px;height:44px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center}
@keyframes spin{to{transform:rotate(360deg)}}
.foot-row{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-top:clamp(64px,10vh,120px);padding-top:24px;border-top:1px solid var(--line);color:var(--mute);font-size:14px}
.top-link{display:inline-flex;align-items:center;gap:8px;color:var(--ink);font-weight:600}
.top-link:hover{text-decoration:underline;text-underline-offset:4px}
@media (max-width:899px){
  .ct-grid{grid-template-columns:1fr}
  .badge{justify-self:start}
}
`;

export function Contact() {
  const [copied, setCopied] = useState(false);

  const hop = (e: PointerEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    el.classList.remove("hop");
    void el.offsetWidth; // restart the animation
    el.classList.add("hop");
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  const words = TITLE.split(" ");

  return (
    <section id="contact" className="sec" aria-labelledby="contact-title">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wrap">
        <p className="tag mono rv">
          <span>06</span>
          <span aria-hidden="true">—</span>
          <span>Contact</span>
        </p>

        <h2 id="contact-title" className="ct-title rv" style={{ marginTop: 24 }}>
          <span className="sr-only">{TITLE}</span>
          <span aria-hidden="true">
            {words.map((word, wi) => (
              <span key={wi}>
                <span className="word">
                  {word.split("").map((ch, ci) => (
                    <span key={ci} className="ltr" onPointerEnter={hop}>
                      {ch}
                    </span>
                  ))}
                </span>
                {wi < words.length - 1 ? " " : null}
              </span>
            ))}
          </span>
        </h2>

        <div className="ct-grid">
          <div className="rv">
            <a className="ct-mail" href={`mailto:${PROFILE.email}`}>
              {PROFILE.email}
            </a>
            <div className="copy-row">
              <button type="button" className="copy-btn" onClick={copyEmail} aria-label="Copy email address">
                {copied ? "Copied ✓" : "Copy email"}
              </button>
              <span role="status" aria-live="polite" className="sr-only">
                {copied ? "Email address copied" : ""}
              </span>
            </div>
          </div>

          <div className="badge rv" aria-hidden="true">
            <svg viewBox="0 0 150 150">
              <defs>
                <path id="badge-circle" d="M75,75 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0" />
              </defs>
              <text>
                <textPath href="#badge-circle">SAY HELLO · SAY HELLO · SAY HELLO · </textPath>
              </text>
            </svg>
            <span className="badge-core">
              <ArrowUpRight size={18} />
            </span>
          </div>
        </div>

        <div className="ct-links rv" style={{ marginTop: 40 }}>
          <a href={`tel:${PROFILE.phoneHref}`}>
            <span>
              Phone
              <small>{PROFILE.location}</small>
            </span>
            <span>{PROFILE.phoneDisplay}</span>
          </a>
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
            <span>
              GitHub
              <small>Code</small>
            </span>
            <span>
              github.com/{PROFILE.githubHandle} <ArrowUpRight />
            </span>
          </a>
          <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
            <span>
              LinkedIn
              <small>Profile</small>
            </span>
            <span>
              {PROFILE.linkedinLabel} <ArrowUpRight />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="wrap" style={{ paddingBottom: 40 }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="foot-row">
        <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {PROFILE.name}
        </p>
        <button type="button" className="top-link" onClick={() => scrollToTarget("top")}>
          Back to top ↑
        </button>
        <p>Built with Next.js</p>
      </div>
    </footer>
  );
}
