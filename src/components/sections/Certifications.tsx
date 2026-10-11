import { CERTIFICATIONS } from "@/lib/data";
import { cv } from "../ui/cssvars";
import { SectionHead } from "../ui/SectionHead";

const CSS = `
.cert-band{background:var(--card);border-block:1px solid var(--line)}
.cert-wrap{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,6vw,96px);align-items:start}
.cert-head{position:sticky;top:120px;display:grid;gap:22px}
.cert-head .sh-title{max-width:12ch}
.cert-count{color:var(--mute);font-size:15px;max-width:30ch}
.cert-list{border-top:1px solid var(--line)}
.cert{position:relative;isolation:isolate;overflow:hidden;display:grid;grid-template-columns:64px minmax(0,1fr) auto;align-items:center;gap:16px;padding:clamp(22px,3vh,30px) 6px;border-bottom:1px solid var(--line);outline-offset:-2px}
.cert::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--ink);transform:scaleX(0);transform-origin:left center;transition:transform .7s var(--ease)}
.cert:hover::before,.cert:focus-visible::before{transform:scaleX(1)}
.cert-num{font:500 12px/1 var(--font-mono);color:var(--mute);transition:color .5s var(--ease)}
.cert-title{font-weight:600;font-size:clamp(20px,2.4vw,30px);letter-spacing:-.03em;line-height:1.15;transition:color .5s var(--ease)}
.cert-arrow{font-size:22px;line-height:1;color:#fff;opacity:0;transform:translate(-10px,10px);transition:opacity .5s var(--ease),transform .7s var(--ease)}
.cert:hover .cert-num,.cert:focus-visible .cert-num{color:rgba(255,255,255,.6)}
.cert:hover .cert-title,.cert:focus-visible .cert-title{color:#fff}
.cert:hover .cert-arrow,.cert:focus-visible .cert-arrow{opacity:1;transform:none}
@media (max-width:899px){
  .cert-wrap{grid-template-columns:1fr}
  .cert-head{position:static}
}
`;

export function Certifications() {
  return (
    <section id="certifications" className="sec cert-band" aria-labelledby="cert-title">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wrap">
        <div className="cert-wrap">
          <div className="cert-head">
            <SectionHead id="cert-title" index="04" label="Certifications" lead="Always" accent="learning." />
            <p className="cert-count rv">
              {String(CERTIFICATIONS.length).padStart(2, "0")} certifications listed in my résumé.
            </p>
          </div>

          <ol className="cert-list rv" style={cv({ "--i": 1 })} aria-label="Certifications">
            {CERTIFICATIONS.map((c, i) => (
              <li key={c.title} className="cert" tabIndex={0}>
                <span className="cert-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="cert-title">{c.title}</span>
                <span className="cert-arrow" aria-hidden="true">
                  ↗
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
