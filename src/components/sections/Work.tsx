"use client";

import { useState } from "react";
import { PROJECTS, SKILLS, type Project } from "@/lib/data";
import { TechLogo } from "../ui/TechLogo";
import { cv } from "../ui/cssvars";
import { SectionHead } from "../ui/SectionHead";

const CSS = `
.wk-track{display:flex;gap:10px;height:min(78svh,600px);min-height:480px;margin-top:clamp(40px,6vh,64px)}
.wk-panel{position:relative;flex:1 1 0;min-width:0;border-radius:28px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 1px 2px rgba(0,0,0,.03);overflow:hidden;transition:flex-grow 1s var(--ease),box-shadow .6s var(--ease)}
.wk-panel.is-open{flex-grow:8;box-shadow:inset 0 0 0 1px var(--line),0 40px 80px -48px rgba(0,0,0,.35)}
.wk-spine{position:absolute;inset:0;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:24px 0;transition:background-color .6s var(--ease)}
.wk-spine:hover{background:#fbfaf8}
.wk-panel.is-open .wk-spine{display:none}
.wk-num{color:var(--mute)}
.wk-vtitle{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600;font-size:clamp(18px,1.6vw,22px);letter-spacing:-.02em;white-space:nowrap}
.wk-plus{width:40px;height:40px;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line);display:grid;place-items:center;font-size:20px;line-height:1;transition:transform .8s var(--ease),background-color .5s var(--ease),color .5s var(--ease)}
.wk-spine:hover .wk-plus{transform:rotate(90deg);background:var(--ink);color:#fff}
.wk-body{position:absolute;inset:0;display:none;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:clamp(20px,2.4vw,36px);padding:clamp(24px,3vw,40px)}
.wk-panel.is-open .wk-body{display:grid;animation:fadeUp .9s var(--ease) .12s both}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.wk-text{display:flex;flex-direction:column;gap:14px;min-width:0;overflow:auto;padding-right:4px}
.wk-kicker{color:var(--mute)}
.wk-title{font-weight:700;font-size:clamp(28px,3vw,42px);letter-spacing:-.04em;line-height:1.02}
.wk-desc{color:var(--ink-2);font-size:15px;line-height:1.6}
.wk-feat{display:grid;grid-template-columns:1fr 1fr;gap:10px 16px;font-size:13.5px;color:var(--ink-2)}
.wk-feat li{position:relative;padding-left:16px}
.wk-feat li::before{content:"";position:absolute;left:0;top:.6em;width:6px;height:6px;border-radius:50%;background:var(--ink)}
.wk-tech{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}
.wk-tech li{display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 12px 0 8px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);font-size:12.5px;font-weight:500}
.wk-tech img{width:16px;height:16px}
.wk-ui{position:relative;border-radius:22px;background:var(--paper);overflow:hidden;animation:wipe 1.1s var(--ease) .25s both}
@keyframes wipe{from{clip-path:inset(0 100% 0 0 round 22px)}to{clip-path:inset(0 0 0 0 round 22px)}}
.ui-label{position:absolute;left:14px;top:14px;z-index:2;font:500 10px/1 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--mute);background:rgba(255,255,255,.85);padding:7px 10px;border-radius:999px}
.mini{position:absolute;inset:52px 18px 18px;display:grid;gap:10px;align-content:start}
.mk-card{background:#fff;border-radius:14px;box-shadow:inset 0 0 0 1px var(--line)}
.mk-bar{height:9px;border-radius:99px;background:#dcd9d2}
.mk-bar.s{height:6px;background:#e7e4de}
.sf-top{display:flex;gap:8px;align-items:center}
.sf-search{flex:1;height:30px;border-radius:99px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
.sf-dot{width:30px;height:30px;border-radius:50%;background:#dcd9d2}
.sf-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.sf-item{background:#fff;border-radius:14px;box-shadow:inset 0 0 0 1px var(--line);padding:8px;display:grid;gap:7px}
.sf-thumb{height:74px;border-radius:9px;background:linear-gradient(135deg,#e9e6e0,#d3d0c9)}
.sf-list{display:grid;gap:8px;background:#fff;border-radius:14px;box-shadow:inset 0 0 0 1px var(--line);padding:12px}
.sf-row{display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:center}
.sf-row i{width:34px;height:34px;border-radius:10px;background:#e4e1db}
.pos{display:grid;grid-template-columns:1.25fr 1fr;gap:10px;align-items:start}
.pos-tiles{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.pos-tile{height:72px;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);display:grid;place-items:end start;padding:9px}
.pos-tile i{display:block;height:7px;width:60%;border-radius:99px;background:#dcd9d2}
.receipt{background:#fff;border-radius:14px;box-shadow:inset 0 0 0 1px var(--line);padding:14px;display:grid;gap:9px;align-content:start}
.receipt .ln{height:7px;border-radius:99px;background:#e6e3dd}
.receipt .ln:nth-child(odd){width:72%}
.receipt .tot{height:11px;border-radius:99px;background:var(--ink);margin-top:6px}
.pay{height:38px;border-radius:99px;background:var(--ink);margin-top:4px}
.q-prompt{background:#fff;border-radius:14px;box-shadow:inset 0 0 0 1px var(--line);padding:14px;display:grid;gap:9px}
.q-code{background:var(--ink);border-radius:14px;padding:16px;display:grid;gap:10px}
.q-code i{display:block;height:7px;border-radius:99px;background:rgba(244,242,238,.28)}
.q-code i:nth-child(2){width:64%}
.q-code i:nth-child(4){width:82%}
.q-table{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.q-table i{height:20px;border-radius:6px;background:#e6e3dd}
.q-table i:nth-child(-n+4){background:#cfccc5}
@media (max-width:899px){
  .wk-track{flex-direction:column;height:auto;min-height:0;gap:10px}
  .wk-panel,.wk-panel.is-open{flex:none;width:100%}
  .wk-panel{border-radius:24px}
  .wk-spine{position:relative;flex-direction:row;padding:20px 22px;height:auto;min-height:76px}
  .wk-vtitle{writing-mode:horizontal-tb;transform:none;font-size:20px;flex:1;text-align:left;padding-left:14px}
  .wk-panel.is-open .wk-spine{display:flex}
  .wk-panel.is-open .wk-plus{transform:rotate(45deg);background:var(--ink);color:#fff}
  .wk-body{position:relative;inset:auto;grid-template-columns:1fr;display:none;padding:0 22px 26px;gap:22px}
  .wk-panel.is-open .wk-body{display:grid}
  .wk-text{overflow:visible}
  .wk-ui{height:250px}
  .mini{inset:46px 14px 14px}
  .wk-feat{grid-template-columns:1fr}
}
`;

function MiniUI({ mock }: { mock: Project["mock"] }) {
  if (mock === "storefront") {
    return (
      <div className="mini" aria-hidden="true">
        <div className="sf-top">
          <span className="sf-dot" />
          <span className="sf-search" />
        </div>
        <div className="sf-grid">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="sf-item">
              <div className="sf-thumb" />
              <div className="mk-bar" style={{ width: "70%" }} />
              <div className="mk-bar s" style={{ width: "45%" }} />
            </div>
          ))}
        </div>
        <div className="sf-list">
          {[0, 1].map((i) => (
            <div key={i} className="sf-row">
              <i />
              <div style={{ display: "grid", gap: 6 }}>
                <div className="mk-bar" style={{ width: "60%" }} />
                <div className="mk-bar s" style={{ width: "38%" }} />
              </div>
              <div className="mk-bar s" style={{ width: 36 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (mock === "pos") {
    return (
      <div className="mini pos" aria-hidden="true">
        <div className="pos-tiles">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="pos-tile">
              <i />
            </div>
          ))}
        </div>
        <div className="receipt">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="ln" />
          ))}
          <span className="tot" />
          <span className="pay" />
        </div>
      </div>
    );
  }
  return (
    <div className="mini" aria-hidden="true">
      <div className="q-prompt">
        <div className="mk-bar" style={{ width: "86%" }} />
        <div className="mk-bar s" style={{ width: "52%" }} />
      </div>
      <div className="q-code">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="q-table">
        {Array.from({ length: 8 }).map((_, i) => (
          <i key={i} />
        ))}
      </div>
    </div>
  );
}

export function Work() {
  const [active, setActive] = useState(0);

  return (
    <section id="work" className="sec" aria-labelledby="work-title">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wrap">
        <SectionHead id="work-title" index="03" label="Selected work" lead="Things I've" accent="built." />

        <div className="wk-track rv" style={cv({ "--i": 0 })}>
          {PROJECTS.map((p, i) => {
            const open = active === i;
            const techSkills = p.tech.map((name) => {
              const skill = SKILLS.find((s) => s.name.toLowerCase() === name.toLowerCase());
              return { name, skill };
            });
            return (
              <article
                key={p.id}
                className={`wk-panel${open ? " is-open" : ""}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <button
                  type="button"
                  className="wk-spine"
                  aria-expanded={open}
                  aria-controls={`wk-body-${p.id}`}
                  onClick={() => setActive(i)}
                >
                  <span className="wk-num mono">{p.index}</span>
                  <span className="wk-vtitle">{p.title}</span>
                  <span className="wk-plus" aria-hidden="true">
                    +
                  </span>
                </button>

                <div id={`wk-body-${p.id}`} className="wk-body" role="region" aria-label={p.title}>
                  <div className="wk-text">
                    <p className="mono wk-kicker">
                      {p.index} — {p.kicker}
                    </p>
                    <h3 className="wk-title">{p.title}</h3>
                    <p className="wk-desc">{p.description}</p>
                    <ul className="wk-feat">
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <ul className="wk-tech" aria-label="Technologies">
                      {techSkills.map(({ name, skill }) => (
                        <li key={name}>
                          {skill && (skill.logo || skill.concept) && <TechLogo skill={skill} size={16} />}
                          {name}
                        </li>
                      ))}
                    </ul>
                    {p.github && (
                      <a className="btn btn-ghost" href={p.github} target="_blank" rel="noopener noreferrer" style={{ alignSelf: "flex-start" }}>
                        View on GitHub ↗
                      </a>
                    )}
                  </div>

                  <div className="wk-ui" role="img" aria-label={`Illustrative interface for ${p.title}. Decorative, not a real screenshot.`}>
                    <span className="ui-label">Illustrative UI</span>
                    <MiniUI mock={p.mock} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
