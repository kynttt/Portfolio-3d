"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowLeft, ArrowRight, CircleDot, Menu, Plus, Sparkle } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { CharacterSkeletonReveal } from "@/components/portfolio/interactions/CharacterSkeletonReveal";
import { MagneticCTA } from "@/components/portfolio/interactions/MagneticCTA";
import { useMechanicalPreviewMotion } from "@/components/portfolio/interactions/MechanicalPreviewMotion";
import { useFinePointer } from "@/hooks/useFinePointer";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const heroPanelRef = useRef<HTMLElement | null>(null);
  const dossierRef = useRef<HTMLElement | null>(null);
  const hasFinePointer = useFinePointer();
  const prefersReducedMotion = useReducedMotionPreference();
  const interactionEnabled = hasFinePointer && !prefersReducedMotion;

  useMechanicalPreviewMotion({
    rootRef: dossierRef,
    enabled: interactionEnabled,
  });

  return (
    <main className="site-shell">
      <motion.section
        className="hero-frame grain"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.08 }}
        aria-label="ALDREN KENT CIRUNAY portfolio hero"
      >
        <motion.aside className="identity-rail" variants={fadeUp}>
          <div className="rail-mark">AK</div>
          <p>Licensed Mechanical Engineer</p>
          <span>Systems / Software / Infrastructure</span>
        </motion.aside>

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
            aria-hidden="true"
          >
            SYSTEMS
          </div>
          <motion.div className="monogram" variants={fadeUp}>
            ALDREN KENT CIRUNAY
          </motion.div>

          <motion.div
            className="portrait-placeholder"
            variants={fadeUp}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
          >
            <CharacterSkeletonReveal enabled={interactionEnabled} />
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
          </motion.div>

          <motion.div
            className="detail-orbit-wrap"
            variants={fadeUp}
          >
            <MagneticCTA
              className="detail-orbit"
              href="#details"
              enabled={interactionEnabled}
            >
              <span>View Details</span>
              <ArrowDownRight size={18} strokeWidth={1.6} />
            </MagneticCTA>
          </motion.div>

          <motion.div className="registered-mark" variants={fadeUp}>
            <CircleDot size={46} strokeWidth={1.7} />
          </motion.div>
        </section>

        <motion.aside className="dossier-panel" variants={fadeUp} ref={dossierRef}>
          <Image
            className="technical-object"
            src="/assets/hero-back.png"
            alt="Rear profile mechanical portrait"
            width={1086}
            height={1448}
          />
          <div className="arrow-row" aria-hidden="true">
            <ArrowLeft size={28} strokeWidth={1.3} />
            <ArrowRight size={28} strokeWidth={1.3} />
          </div>
          <div className="spark-row" aria-hidden="true">
            <span>
              <Sparkle size={18} fill="currentColor" />
            </span>
            <span>
              <Sparkle size={18} fill="currentColor" />
            </span>
            <span>
              <Sparkle size={18} fill="currentColor" />
            </span>
          </div>
          <h2>
            Operational Thinking
            <br />
            For Digital Products
          </h2>
          <p>Systems built where field logic meets clean software.</p>
        </motion.aside>

        <motion.footer className="systems-band" variants={fadeUp}>
          <div className="metric-block">
            <strong>06+</strong>
            <span>
              years across engineering
              <br />
              and digital systems
            </span>
          </div>
          <div className="statement-block">
            <Plus size={24} strokeWidth={1.5} />
            <h2>
              From machines
              <br />
              to digital systems.
            </h2>
          </div>
          <div className="thesis-block">
            <span>(C)2026</span>
            <p>
              ENGINEERED FOR THE REAL WORLD.
              <br />
              BUILT FOR THE DIGITAL ONE.
            </p>
          </div>
        </motion.footer>
      </motion.section>
    </main>
  );
}
