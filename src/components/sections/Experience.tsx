"use client";

import { useEffect, useRef } from "react";
import { EXPERIENCE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import { SectionHead } from "../ui/SectionHead";

const CSS = `
.tl{position:relative;margin-top:clamp(44px,7vh,72px);--yw:210px}
.tl-spine{position:absolute;left:calc(var(--yw) + 23px);top:12px;bottom:12px;width:2px;border-radius:2px;background:var(--line);overflow:hidden}
.tl-fill{position:absolute;inset:0;background:var(--ink);transform-origin:50% 0;transform:scaleY(var(--p,0))}
.tl-item{position:relative;display:grid;grid-template-columns:var(--yw) minmax(0,1fr);gap:0 48px;padding-bottom:clamp(44px,7vh,68px)}
.tl-year{text-align:right;color:var(--faint);transition:color .6s var(--ease)}
.tl-year b{display:block;font-weight:700;font-size:clamp(34px,4vw,56px);letter-spacing:-.05em;line-height:1}
.tl-year small{display:block;margin-top:8px;font:500 11px/1.4 var(--font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.tl-dot{position:absolute;left:calc(var(--yw) + 18px);top:14px;width:12px;height:12px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 1.5px var(--faint);transition:background-color .6s var(--ease),box-shadow .6s var(--ease)}
.tl-item.is-lit .tl-dot{background:var(--ink);box-shadow:0 0 0 6px rgba(13,13,13,.08)}
.tl-item.is-lit .tl-year{color:var(--ink)}
.tl-body{display:grid;gap:10px;min-width:0}
.tl-kind{color:var(--mute);font-size:11px}
.tl-title{font-weight:700;font-size:clamp(22px,2.3vw,30px);letter-spacing:-.03em;line-height:1.15}
.tl-org{font-weight:500;color:var(--ink-2)}
.tl-place{color:var(--mute);font-size:14px}
.tl-points{display:grid;gap:8px;margin-top:6px;max-width:72ch;font-size:15px;color:var(--ink-2)}
.tl-points li{position:relative;padding-left:18px}
.tl-points li::before{content:"";position:absolute;left:0;top:.72em;width:7px;height:1.5px;background:var(--ink)}
.tl-next{margin:8px 0 0 calc(var(--yw) + 48px);display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap;padding:clamp(24px,3vw,36px);border-radius:28px;border:1.5px dashed rgba(13,13,13,.24)}
.tl-next h3{font-weight:700;font-size:clamp(26px,3vw,40px);letter-spacing:-.04em;line-height:1.05}
.tl-next h3 em{font-family:var(--font-serif);font-style:italic;font-weight:400;color:var(--mute)}
.tl-next p{color:var(--ink-2);margin-top:8px;max-width:52ch}
.tl-next a{flex:none}
@media (max-width:719px){
  .tl-spine{left:6px}
  .tl-item{grid-template-columns:1fr;gap:6px;padding-left:34px}
  .tl-year{text-align:left}
  .tl-year b{font-size:30px}
  .tl-dot{left:0;top:6px}
  .tl-next{margin-left:0}
}
`;

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  useScrollProgress(sectionRef);

  // Each stop lights up as the spine reaches it.
  useEffect(() => {
    const items = itemRefs.current.filter(Boolean) as HTMLLIElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle("is-lit", e.isIntersecting);
      },
      { rootMargin: "-42% 0px -48% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="sec" aria-labelledby="exp-title">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wrap">
        <SectionHead id="exp-title" index="05" label="Experience" lead="Education and" accent="experience." />

        <div className="tl">
          <div className="tl-spine" aria-hidden="true">
            <div className="tl-fill" />
          </div>
          <ol className="tl-list">
          {EXPERIENCE.map((e, i) => (
            <li
              key={`${e.start}-${e.title}`}
              className="tl-item"
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
            >
              <span className="tl-dot" aria-hidden="true" />
              <p className="tl-year">
                <b>{e.start.slice(-4)}</b>
                <small>
                  {e.start} – {e.end}
                </small>
              </p>
              <div className="tl-body">
                <p className="mono tl-kind">{e.kind === "work" ? "Work" : "Study"}</p>
                <h3 className="tl-title">{e.title}</h3>
                <p className="tl-org">{e.org}</p>
                {e.place && <p className="tl-place">{e.place}</p>}
                {e.points.length > 0 && (
                  <ul className="tl-points">
                    {e.points.map((p) => (
                      <li key={p.slice(0, 48)}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
          </ol>
        </div>

        {/* <div className="tl-next rv">
          <div>
            <h3>
              Next — <em>Your team?</em>
            </h3>
            <p>Available for full-time Software Engineer or Full-Stack Developer roles in the UK.</p>
          </div>
          <a className="btn btn-primary" href="#contact">
            Let&apos;s talk
          </a>
        </div> */}
      </div>
    </section>
  );
}
