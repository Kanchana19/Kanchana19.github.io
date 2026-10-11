"use client";

import { useRef, useState } from "react";
import { PROJECT_BY_ID, SKILL_GROUPS, SKILLS, type GroupId } from "@/lib/data";
import { brandHex, TechLogo } from "../ui/TechLogo";
import { cv } from "../ui/cssvars";
import { SectionHead } from "../ui/SectionHead";

const COLS = 8;

const CSS = `
.pt-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:clamp(36px,5vh,56px)}
.chip{height:34px;padding:0 14px;border-radius:999px;font-size:13px;font-weight:500;color:var(--ink-2);background:var(--soft);box-shadow:none;transition:background-color .45s var(--ease),color .45s var(--ease),box-shadow .45s var(--ease),transform .6s var(--ease)}
.chip:hover{transform:translateY(-1px);box-shadow:inset 0 0 0 1px rgba(13,13,13,.28)}
.chip[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:none}
.pt-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:clamp(24px,3vw,44px);align-items:start;margin-top:28px}
.pt-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px}
.pt-grid:not(.is-in) .tile{opacity:0}
.pt-grid.is-in .tile{animation:tileIn .9s var(--ease) backwards;animation-delay:calc((var(--r) + var(--c)) * 40ms)}
@keyframes tileIn{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}
.tile{position:relative;display:flex;flex-direction:column;justify-content:space-between;min-height:0;aspect-ratio:1/1.04;padding:9px 9px 10px;border-radius:14px;background:var(--card);text-align:left;box-shadow:inset 0 0 0 1px var(--line);transition:transform .6s var(--ease),box-shadow .5s var(--ease),opacity .5s var(--ease),filter .5s var(--ease)}
.tile:hover{transform:translateY(-3px);box-shadow:inset 0 0 0 1px rgba(13,13,13,.25),0 22px 40px -28px rgba(0,0,0,.35)}
.tile[aria-pressed="true"]{box-shadow:inset 0 0 0 1.5px var(--ink)}
.tile.is-dim{opacity:.22;filter:grayscale(1)}
.t-num{font:500 10px/1 var(--font-mono);color:var(--mute);letter-spacing:.06em}
.t-sym{font-weight:700;font-size:26px;letter-spacing:-.04em;line-height:1;margin-top:6px}
.t-name{font-size:10.5px;line-height:1.2;font-weight:500;color:var(--ink-2);margin-top:4px}
.t-fam{display:none}
.tile.is-on{background:var(--ink)}
.tile.is-on .t-num,.tile.is-on .t-name{color:rgba(255,255,255,.7)}
.tile.is-on .t-sym{color:#fff}
.insp{position:sticky;top:112px;padding:0 4px;display:flex;flex-direction:column;gap:14px;min-height:480px}
.insp-stage{position:relative;height:200px;border-radius:22px;background:transparent;display:grid;place-items:center;overflow:hidden;color:var(--ink)}
.insp-glow{position:absolute;width:240px;height:240px;border-radius:50%;background:radial-gradient(closest-side,var(--tint,transparent),transparent 100%);opacity:.22;pointer-events:none}
.insp-logo{position:relative;display:grid;place-items:center;animation:pop .75s var(--ease) both}
@keyframes pop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.06);opacity:1}100%{transform:scale(1)}}
.insp-fam{color:var(--mute)}
.insp-name{font-weight:700;font-size:26px;letter-spacing:-.035em;line-height:1.1}
.insp-detail{color:var(--ink-2);font-size:14px}
.insp-used{margin-top:auto;display:grid}
.insp-used h4{font:500 11px/1 var(--font-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin-bottom:8px}
.insp-used li{padding:10px 0;border-top:1px solid var(--line);font-size:14px;font-weight:600}
.insp-used small{display:block;color:var(--mute);font-weight:400;font-size:12.5px}
@media (max-width:1023px){
  .pt-layout{grid-template-columns:1fr}
  .insp{position:relative;top:0;min-height:0}
  .pt-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@media (max-width:639px){
  .tile{min-height:104px}
  .t-sym{font-size:24px}
  .t-name{font-size:11px}
}
`;

export function Skills() {
  const [group, setGroup] = useState<GroupId | "all">("all");
  const [activeIdx, setActiveIdx] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const active = SKILLS[activeIdx];
  const activeGroup = SKILL_GROUPS.find((g) => g.id === active.group);
  const activeProjects = active.projects.map((id) => PROJECT_BY_ID[id]);
  const tint = brandHex(active) ?? "transparent";

  return (
    <section id="skills" className="sec" aria-labelledby="skills-title">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wrap">
        <SectionHead id="skills-title" index="02" label="Skills" lead="The periodic table" accent="of my stack." />

        <div className="pt-chips" role="group" aria-label="Filter skills by family">
          <button type="button" className="chip" aria-pressed={group === "all"} onClick={() => setGroup("all")}>
            All
          </button>
          {SKILL_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              className="chip"
              aria-pressed={group === g.id}
              onClick={() => setGroup(g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="pt-layout">
          <div ref={gridRef} className="pt-grid rv-wave" role="list">
            {SKILLS.map((s, i) => {
              const row = Math.floor(i / COLS);
              const col = i % COLS;
              const dim = group !== "all" && s.group !== group;
              const on = group !== "all" && s.group === group;
              const label = SKILL_GROUPS.find((g) => g.id === s.group)?.label ?? "";
              return (
                <div role="listitem" key={s.name} style={cv({ "--r": row, "--c": col })}>
                  <button
                    type="button"
                    className={`tile${dim ? " is-dim" : ""}${on ? " is-on" : ""}`}
                    aria-pressed={activeIdx === i}
                    aria-label={`${s.name}, ${label}`}
                    onMouseEnter={() => setActiveIdx(i)}
                    onFocus={() => setActiveIdx(i)}
                    onClick={() => setActiveIdx(i)}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <span className="t-num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="t-sym" aria-hidden="true">
                        {s.symbol}
                      </span>
                      <span className="t-name" aria-hidden="true" style={{ display: "block" }}>
                        {s.name}
                      </span>
                    </span>
                    <span className="t-fam" aria-hidden="true">
                      {label}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          <aside className="insp" aria-label="Selected skill">
            <div className="insp-stage">
              <span className="insp-glow" aria-hidden="true" style={cv({ "--tint": tint })} />
              <div key={activeIdx} className="insp-logo">
                <TechLogo skill={active} size={150} />
              </div>
            </div>
            <p className="mono insp-fam">
              {activeGroup?.heading} · No. {String(activeIdx + 1).padStart(2, "0")}
            </p>
            <h3 className="insp-name">{active.name}</h3>
            {active.detail && <p className="insp-detail">{active.detail}</p>}
            {activeProjects.length > 0 && (
              <div className="insp-used">
                <h4>Used in</h4>
                <ul>
                  {activeProjects.map((p) => (
                    <li key={p.id}>
                      {p.title}
                      <small>{p.kicker}</small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
