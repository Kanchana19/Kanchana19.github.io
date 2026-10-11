import { FACTS, PROFILE } from "@/lib/data";
import { cv } from "../ui/cssvars";
import { IdCard } from "../ui/IdCard";
import { ArrowUpRight } from "../ui/Icons";
import { SectionHead } from "../ui/SectionHead";

const CSS = `
.about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,3vw,48px);align-items:stretch;margin-top:clamp(48px,7vh,80px);min-height:620px}
.about-col{min-width:0}
.about-left{display:flex;flex-direction:column;justify-content:center;gap:22px}
.hi{font-weight:700;font-size:clamp(30px,3.4vw,46px);letter-spacing:-.04em;line-height:1.05}
.hi span{font-family:var(--font-serif);font-style:italic;font-weight:400;color:var(--mute)}
.summary{font-size:17px;line-height:1.7;color:var(--ink-2);max-width:60ch}
.avail{font-size:15px;color:var(--mute)}
.about-links{display:flex;flex-wrap:wrap;gap:10px}
.about-card{display:flex;justify-content:center;align-items:flex-start}
.about-right{display:flex;flex-direction:column;justify-content:center;gap:22px}
.facts-h{color:var(--mute)}
.facts > div{display:grid;grid-template-columns:104px minmax(0,1fr);gap:12px;padding:14px 0;border-top:1px solid var(--line)}
.facts > div:last-child{border-bottom:1px solid var(--line)}
.facts dt{color:var(--mute);padding-top:3px}
.facts dd{font-weight:500;overflow-wrap:anywhere}
.facts a{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px}
.quote{font-family:var(--font-serif);font-style:italic;font-size:clamp(24px,2.4vw,32px);line-height:1.25;letter-spacing:-.01em;color:var(--ink-2)}
.quote footer{margin-top:14px;font-family:var(--font-mono);font-style:normal;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
@media (max-width:1023px){
  .about-grid{grid-template-columns:1fr;min-height:0;gap:48px}
  .about-card{order:1}
  .about-left{order:2}
  .about-right{order:3}
}
`;

export function About() {
  return (
    <section id="about" className="sec" aria-labelledby="about-title">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wrap">
        <SectionHead id="about-title" index="01" label="About" lead="" accent="" />

        <div className="about-grid">
          <div className="about-col about-left rv" style={cv({ "--i": 0 })}>
            <p className="hi">
              Hi, I&apos;m <span>{PROFILE.firstName}.</span>
            </p>
            <p className="summary">{PROFILE.resumeSummary}</p>
            <p className="avail">{PROFILE.availability}</p>
            <div className="about-links">
              <a className="btn btn-primary" href={PROFILE.resumePath} download>
                Résumé
              </a>
              <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                GitHub <ArrowUpRight />
              </a>
              <a className="btn btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn <ArrowUpRight />
              </a>
            </div>
          </div>

          <div className="about-col about-card">
            <IdCard />
          </div>

          <aside className="about-col about-right rv" style={cv({ "--i": 1 })} aria-label="Quick facts">
            <h3 className="mono facts-h">Quick facts</h3>
            <dl className="facts">
              {FACTS.map((f) => (
                <div key={f.label}>
                  <dt className="mono">{f.label}</dt>
                  <dd>{f.href ? <a href={f.href}>{f.value}</a> : f.value}</dd>
                </div>
              ))}
            </dl>
            <blockquote className="quote">
              <p>“{PROFILE.quote}”</p>
              <footer>From my résumé, professional summary</footer>
            </blockquote>
          </aside>
        </div>
      </div>
    </section>
  );
}
