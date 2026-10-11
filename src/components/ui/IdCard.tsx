"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { CARD_BACK, PROFILE } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/hooks";

const CSS = `
.lanyard{position:relative;display:flex;flex-direction:column;align-items:center;transform-origin:50% 0;will-change:transform}
.strap{position:relative;width:30px;height:56px;overflow:hidden;border-radius:3px 3px 0 0;background:#1d1d1d}
.strap-track{position:absolute;left:0;top:0;width:30px;display:flex;flex-direction:column;animation:strapRun 9s linear infinite}
.strap-track span{display:block;writing-mode:vertical-rl;white-space:nowrap;width:30px;font:600 9px/30px var(--font-mono);letter-spacing:.18em;color:#f4f2ee}
@keyframes strapRun{to{transform:translateY(-50%)}}
.clip{position:relative;z-index:1;width:22px;height:16px;border-radius:4px 4px 6px 6px;background:linear-gradient(180deg,#f2f2f2,#9a9a9a 60%,#cfcfcf);box-shadow:0 1px 2px rgba(0,0,0,.25),inset 0 1px 0 #fff}
.clip::after{content:"";position:absolute;left:50%;top:3px;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:#6b6b6b}
.card-wrap{position:relative;width:300px;height:404px;margin-top:-2px;perspective:1400px;cursor:pointer;border-radius:22px}
.flip{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 1.1s var(--ease)}
.flip.is-flipped{transform:rotateY(180deg)}
.face{position:absolute;inset:0;border-radius:22px;background:#fff;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden;box-shadow:inset 0 0 0 1px var(--line),0 40px 70px -40px rgba(0,0,0,.45);display:flex;flex-direction:column}
.face.back{transform:rotateY(180deg)}
.band{height:46px;flex:none;background:var(--ink);color:#fff;display:flex;align-items:center;padding:0 18px;font:600 11px/1 var(--font-mono);letter-spacing:.2em}
.photo-ring{width:138px;height:166px;margin:18px auto 0;padding:5px;border-radius:24px;background:conic-gradient(from 200deg,#0d0d0d,#a9a6a0,#ffffff,#77756f,#0d0d0d);box-shadow:0 18px 30px -18px rgba(0,0,0,.45)}
.photo{width:128px;height:156px;object-fit:cover;border-radius:19px;background:#f4f2ee;transition:transform 1s var(--ease)}
.card-wrap:hover .photo{transform:scale(1.06)}
.who{text-align:center;margin-top:12px}
.nm{font-weight:700;font-size:19px;letter-spacing:-.02em;line-height:1.2}
.rl{margin-top:4px;font:500 10px/1.4 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
.rows{margin:14px 22px 0;display:grid;gap:6px}
.rows > div{display:flex;justify-content:space-between;gap:10px;border-bottom:1px dashed var(--line);padding-bottom:5px}
.rows dt{font:500 10px/1.8 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
.rows dd{font-size:12.5px;font-weight:600;text-align:right}
.foot{margin-top:auto;padding:0 22px 18px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
.barcode{display:flex;align-items:stretch;gap:1.5px;height:34px}
.bar-b{display:block;height:100%;background:var(--ink)}
.sticker{width:58px;height:58px;flex:none;border-radius:50%;background:conic-gradient(#e9e6e0,#fff,#c9c6c0,#fff,#e9e6e0,#a9a6a0,#e9e6e0);box-shadow:inset 0 0 0 1px var(--line);display:grid;place-items:center;text-align:center;font:600 7px/1.3 var(--font-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--ink-2)}
.back-list{margin:18px 22px 0;display:grid;gap:10px;font-size:13px;line-height:1.45;color:var(--ink-2)}
.back-list li{position:relative;padding-left:16px}
.back-list li::before{content:"";position:absolute;left:0;top:.62em;width:6px;height:6px;border-radius:50%;background:var(--ink)}
.sig{margin:auto 22px 0;font-family:var(--font-serif);font-style:italic;font-size:28px;line-height:1.1;color:var(--ink)}
.hello{margin:8px 22px 18px;font:500 10px/1.5 var(--font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--mute);overflow-wrap:anywhere}
`;

const BARS = [3, 1, 2, 1, 4, 1, 1, 2, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 2, 1, 4, 1, 3, 1, 2];

export function IdCard() {
  const swingRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const pointer = useRef<string>("mouse");

  // Pendulum: pointer movement adds velocity to a damped spring; a slow idle sway runs when still.
  useEffect(() => {
    const el = swingRef.current;
    if (!el || reduced) return;
    const section = el.closest("section");
    let angle = 0;
    let vel = 0;
    let lastX: number | null = null;
    let last = performance.now();
    let visible = true;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (lastX !== null) vel += Math.max(-40, Math.min(40, (e.clientX - lastX) * 0.8));
      lastX = e.clientX;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    if (section) io.observe(section);
    section?.addEventListener("pointermove", onMove, { passive: true });

    const step = (t: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(0.033, (t - last) / 1000);
      last = t;
      if (!visible) return;
      vel += (-60 * angle - 5 * vel) * dt;
      angle += vel * dt;
      if (Math.abs(angle) > 26) {
        angle = Math.sign(angle) * 26;
        vel = 0;
      }
      const idle = Math.sin(t / 1100) * 1.1;
      el.style.transform = `rotate(${(angle + idle).toFixed(2)}deg)`;
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      section?.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointer.current = e.pointerType;
  };
  const onEnter = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") setFlipped(true);
  };
  const onLeave = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") setFlipped(false);
  };
  const onClick = () => {
    if (pointer.current === "mouse") return; // hover already handles mouse
    setFlipped((f) => !f);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped((f) => !f);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="lanyard" ref={swingRef}>
        <div className="strap" aria-hidden="true">
          <div className="strap-track">
            <span>{`${PROFILE.name.toUpperCase()} · ${PROFILE.role.toUpperCase()} · `}</span>
            <span>{`${PROFILE.name.toUpperCase()} · ${PROFILE.role.toUpperCase()} · `}</span>
          </div>
        </div>
        <div className="clip" aria-hidden="true" />

        <div
          className="card-wrap"
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-labelledby="idcard-name"
          onPointerDown={onPointerDown}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
          onClick={onClick}
          onKeyDown={onKey}
        >
          <div className={`flip${flipped ? " is-flipped" : ""}`}>
            <div className="face front" aria-hidden={flipped}>
              <div className="band">DEVELOPER ID</div>
              <div className="photo-ring">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="photo" src="/portrait-bust.webp" alt={`Portrait of ${PROFILE.name}`} width={128} height={156} decoding="async" />
              </div>
              <div className="who">
                <p className="nm" id="idcard-name">{PROFILE.name}</p>
                <p className="rl">{PROFILE.role}</p>
              </div>
              <dl className="rows">
                <div>
                  <dt>ID No.</dt>
                  <dd>{PROFILE.githubHandle}</dd>
                </div>
                <div>
                  <dt>Dept.</dt>
                  <dd>Software Engineering</dd>
                </div>
                <div>
                  <dt>Valid till</dt>
                  <dd>{PROFILE.graduationYear}</dd>
                </div>
              </dl>
              <div className="foot">
                <div className="barcode" aria-hidden="true">
                  {BARS.map((w, i) => (
                    <span key={i} className="bar-b" style={{ width: w }} />
                  ))}
                </div>
                <div className="sticker" aria-hidden="true">
                  Open to roles
                </div>
              </div>
            </div>

            <div className="face back" aria-hidden={!flipped}>
              <div className="band">WHAT I AM</div>
              <ul className="back-list">
                {CARD_BACK.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="sig">{PROFILE.name}</p>
              <p className="hello">If found, say hello · {PROFILE.email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
