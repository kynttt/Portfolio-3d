"use client";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useRef } from "react";
import { HeroScrollSequence } from "@/components/portfolio/interactions/HeroScrollSequence";
import { OriginSection } from "@/components/portfolio/origin/OriginSection";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";
import { useSystemsRollingText } from "@/hooks/useSystemsRollingText";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const oversizedMark = "SYSTEMS".split("");

export default function Home() {
  const heroPanelRef = useRef<HTMLElement | null>(null);
  const systemsMarkRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotionPreference();

  useSystemsRollingText(systemsMarkRef, {
    enabled: true,
    reducedMotion: prefersReducedMotion,
  });

  return (
    <main className="site-shell">
      <section className="hero-scroll-zone" aria-label="ALDREN KENT CIRUNAY portfolio hero">
        <motion.div
          className="hero-frame grain"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08 }}
        >
          <motion.header className="command-bar" variants={fadeUp}>
            <button className="menu-button" type="button" aria-label="Open menu">
              <span>MENU</span>
              <Menu size={32} strokeWidth={1.2} />
            </button>
            <nav className="top-nav" aria-label="Primary navigation">
              <a href="#work">Work</a>
              <a href="#info">Info</a>
              <a href="#archive">Archive</a>
            </nav>
          </motion.header>

          <section className="center-column hero-shell" ref={heroPanelRef}>
            <div
              className="oversized-mark"
              ref={systemsMarkRef}
              aria-hidden="true"
            >
              {oversizedMark.map((letter, index) => (
                <span className="systems-roll-char" key={`${letter}-${index}`}>
                  {letter}
                </span>
              ))}
            </div>

            <motion.div
              className="portrait-placeholder"
              variants={fadeUp}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
            >
              <HeroScrollSequence
                className="hero-backdrop-object"
                enabled={!prefersReducedMotion}
              />
            </motion.div>

            <motion.div
              className="hero-copy"
              variants={fadeUp}
            >
              <p className="kicker">ALDREN KENT CIRUNAY</p>
              <h1>
                Engineered for the real world.
                <br />
                Built for the digital one.
              </h1>
              <p>
                I build software shaped by real operational experience - from
                industrial systems and utility infrastructure to digital products,
                mapping tools, and applied AI.
              </p>
              {/* <MagneticCTA
                className="detail-orbit"
                href="#details"
                enabled={interactionEnabled}
              >
                <span>View Details</span>
                <ArrowDownRight size={18} strokeWidth={1.6} />
              </MagneticCTA> */}
            </motion.div>

          </section>

          <motion.footer className="hero-meta-line" variants={fadeUp}>
            <span>Mechanical Engineer / Software Systems / Applied AI</span>
            <p>ENGINEERED FOR THE REAL WORLD. BUILT FOR THE DIGITAL ONE.</p>
            <span>(C)2026</span>
          </motion.footer>
        </motion.div>
      </section>

      <OriginSection />
    </main>
  );
}
