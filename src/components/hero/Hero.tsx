"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";
import { cv } from "../ui/cssvars";
import { ArrowDown, PauseBars, PlayTriangle } from "../ui/Icons";

const CSS = `
.hero{position:relative;min-height:100svh;overflow:hidden;background:#ece9e3}
.hero-ghost{position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);font-weight:800;font-size:clamp(110px,31vw,540px);line-height:.9;letter-spacing:-.06em;color:rgba(13,13,13,.04);white-space:nowrap;pointer-events:none;user-select:none;z-index:0}
.hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:end;column-gap:clamp(16px,2vw,32px);min-height:100svh;padding:clamp(88px,10vh,120px) var(--gutter) 0}
.hero-copy{display:grid;gap:var(--stack);align-content:end;padding-bottom:clamp(36px,7vh,72px)}
.hero-title{font-weight:700;font-size:clamp(38px,4.9vw,84px);line-height:.98;letter-spacing:-.055em}
.hero-title em{font-family:var(--font-serif);font-style:italic;font-weight:400;color:var(--mute);letter-spacing:-.02em}
.lede{font-size:clamp(14px,1.15vw,17px);line-height:1.5;color:var(--ink-2);max-width:30ch}
.cta{display:flex;flex-direction:column;align-items:flex-end;gap:10px;padding-bottom:clamp(36px,7vh,72px)}
.stage{position:relative;height:min(88svh,960px);aspect-ratio:576/720;max-width:100%}
.hero-video{width:75%;height:100%;object-fit:contain;object-position:bottom;mix-blend-mode:multiply;background:transparent}
.snd{position:absolute;right:6%;bottom:4%;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;box-shadow:0 14px 30px -12px rgba(0,0,0,.5);transition:transform .6s var(--ease);z-index:2}
.snd:hover{transform:scale(1.06)}
.snd.ping::after{content:"";position:absolute;inset:-8px;border-radius:50%;box-shadow:0 0 0 1px var(--ink);animation:ping 2.2s var(--ease) infinite;pointer-events:none}
@keyframes ping{0%{transform:scale(.85);opacity:.6}100%{transform:scale(1.7);opacity:0}}
@media (max-width:899px){
  .hero-grid{grid-template-columns:1fr;row-gap:20px;padding-top:88px;padding-bottom:40px;min-height:0}
  .stage{order:-1;justify-self:center;height:auto;width:min(100%,calc(60svh * .8))}
  .hero-copy{padding-bottom:0}
  .hero-title{font-size:clamp(40px,11vw,60px)}
  .lede{font-size:16px;max-width:36ch}
  .cta{flex-direction:row;flex-wrap:wrap;align-items:flex-start;padding-bottom:0}
}
`;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false); // true when the voice is audible
  const [blocked, setBlocked] = useState(false); // autoplay with sound was refused
  const userMuted = useRef(false); // the visitor switched the sound off on purpose

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const onVolume = () => setSound(!video.muted);
    video.addEventListener("volumechange", onVolume);

    // Try with sound first; if the browser refuses, play muted and wait for a gesture.
    (async () => {
      try {
        video.muted = false;
        await video.play();
        setBlocked(false);
      } catch {
        video.muted = true;
        setBlocked(true);
        video.play().catch(() => {});
      }
    })();

    const unlock = () => {
      if (userMuted.current || !video.muted) return;
      video.muted = false;
      video
        .play()
        .then(() => setBlocked(false))
        .catch(() => {
          video.muted = true;
        });
    };
    const gestures = ["pointerdown", "keydown", "touchend"] as const;
    gestures.forEach((g) => window.addEventListener(g, unlock, { once: true, passive: true }));

    // Pause the voice as soon as the hero leaves the screen; resume when it comes back.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.35) video.pause();
        else if (video.paused) video.play().catch(() => {});
      },
      { threshold: [0, 0.35, 1] },
    );
    io.observe(section);

    return () => {
      io.disconnect();
      video.removeEventListener("volumechange", onVolume);
      gestures.forEach((g) => window.removeEventListener(g, unlock));
    };
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted) {
      userMuted.current = false;
      video.muted = false;
      setBlocked(false);
      video.play().catch(() => {
        video.muted = true;
      });
    } else {
      userMuted.current = true;
      video.muted = true;
    }
  };

  const link = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToTarget(id);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section id="top" ref={sectionRef} className="hero" aria-labelledby="hero-title">
        <p className="hero-ghost" aria-hidden="true">
          {PROFILE.firstName.toUpperCase()}
        </p>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="tag mono rv" style={cv({ "--i": 0 })}>
              Kanchana Jayendran · {PROFILE.location}
            </p>
            <h1 id="hero-title" className="hero-title">
              <span className="rv-mask">
                <span style={cv({ "--i": 1 })}>Software</span>
              </span>
              <span className="rv-mask">
                <span style={cv({ "--i": 2 })}>
                  Engineer
                </span>
              </span>
            </h1>
            <p className="lede rv" style={cv({ "--i": 3 })}>
              {PROFILE.lede}
            </p>
          </div>

          <div className="stage">
            <video
              ref={videoRef}
              className="hero-video"
              muted
              loop
              playsInline
              preload="auto"
              poster="/hero/hero-poster.webp"
              aria-label="Animated introduction video. The voice plays with sound once the browser allows it."
            >
              <source src="/hero/hero.webm" type="video/webm" />
              <source src="/hero/hero.mp4" type="video/mp4" />
            </video>
            <button
              type="button"
              className={`snd${blocked ? " ping" : ""}`}
              onClick={toggleSound}
              aria-label={sound ? "Mute the intro voice" : "Play the intro with sound"}
            >
              {sound ? <PauseBars size={16} /> : <PlayTriangle size={16} />}
            </button>
          </div>

            <div className="cta rv" style={cv({ "--i": 4 })}>
              <a className="btn btn-primary" href="#work" onClick={link("work")}>
                Explore work
              </a>
              {/* <a className="btn btn-ghost" href="#contact" onClick={link("contact")}>
                Let&apos;s talk
              </a> */}
              <a className="btn btn-ghost" href={PROFILE.resumePath} download>
                Résumé <ArrowDown />
              </a>
            </div>
        </div>
      </section>
    </>
  );
}
