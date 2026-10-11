"use client";

import { SmoothScroll } from "@/lib/scroll";
import { Hero } from "./hero/Hero";
import { Navigation } from "./Navigation";
import { About } from "./sections/About";
import { Certifications } from "./sections/Certifications";
import { Contact, Footer } from "./sections/Contact";
import { Experience } from "./sections/Experience";
import { Skills } from "./sections/Skills";
import { Work } from "./sections/Work";
import { RevealObserver } from "./ui/RevealObserver";

/**
 * One continuous page. Order: Hero → About → Skills → Work → Certifications → Experience → Contact.
 * The résumé lists no achievements, so that section and its nav link are not rendered.
 */
export function App() {
  return (
    <SmoothScroll>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <RevealObserver />
      <Navigation />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
