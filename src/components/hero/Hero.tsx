'use client';

import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './Hero.module.css';

// R3F canvas. client-only
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

import type { Variants } from 'framer-motion';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// container stagger for the whole hero copy block
const heroContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren:   0.25,
    },
  },
};

// each block (label, words, cta) fades up
const heroItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE_OUT } },
};

// Individual word variant for the H1 split
const wordVariant: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE_OUT } },
};

// H1 headline split into lines, each line into words for staggered reveal
const LINE1_WORDS = ['Turn', 'Raw', 'Data', 'Into'];
const LINE2_WORDS = ['Structured', 'Intelligence.'];

export default function Hero() {
  const scrollProgressRef = useRef<number>(0);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // scroll driven values for the scroll indicator
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  // indicator fades in after load, fades away as user scrolls
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    const onScroll = () => {
      scrollProgressRef.current = Math.min(
        window.scrollY / (window.innerHeight * 0.75),
        1,
      );
    };
    const onMouse = (e: MouseEvent) => {
      mousePosRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label="Hero — Turn Raw Data Into Structured Intelligence"
      className={styles.heroSection}
    >
      {/* ── 3D particle canvas ───────── */}
      <div aria-hidden="true" className={styles.heroCanvas}>
        <HeroScene scrollRef={scrollProgressRef} mouseRef={mousePosRef} />
      </div>

      {/* ── Radial vignette — loosened so the 3D field breathes ── */}
      <div aria-hidden="true" className={styles.heroVignette} />

      {/* ── Content ─────── */}
      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate="show"
        className={styles.heroContent}
      >
        {/* Mono label */}
        <motion.p variants={heroItem} className={`${styles.heroLabel} text-mono-label`}>
          Intelligence Workspace · {new Date().getFullYear()}
        </motion.p>

        {/* H1 — word-by-word staggered reveal */}
        <h1 className={`${styles.heroHeading} font-display text-hero text-primary`}>
          {/* Line 1 — plain white words */}
          <motion.span
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
            }}
            initial="hidden"
            animate="show"
            className={styles.heroLine}
            aria-hidden="true"
          >
            {LINE1_WORDS.map((word) => (
              <motion.span
                key={word}
                variants={wordVariant}
                className={styles.heroWord}
              >
                {word}
              </motion.span>
            ))}
          </motion.span>

          {/* Line 2 — gradient accent words */}
          <motion.span
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.09, delayChildren: 0.6 } },
            }}
            initial="hidden"
            animate="show"
            className={styles.heroLine}
            aria-hidden="true"
          >
            {LINE2_WORDS.map((word) => (
              <motion.span
                key={word}
                variants={wordVariant}
                className={styles.heroWordAccent}
              >
                {word}
              </motion.span>
            ))}
          </motion.span>

          {/* Accessible fallback — screen readers get the full text */}
          <span className="sr-only">Turn Raw Data Into Structured Intelligence.</span>
        </h1>

        {/* Subtext */}
        <motion.p variants={heroItem} className={`${styles.heroSubtext} text-body text-muted`}>
          Xai is the intelligence workspace that transforms fragmented data into
          clear, actionable insight — in real time.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={heroItem} className={styles.heroActions}>
          {/* Primary */}
          <motion.a
            href="#platform"
            whileHover={{ scale: 1.03, boxShadow: '0 0 44px rgba(124,92,255,0.42)' }}
            whileTap={{ scale: 0.97 }}
            className={styles.heroCtaPrimary}
            id="hero-cta-primary"
          >
            Explore the Workspace
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>

          {/* trust proof badge btn" */}
          <motion.div
            whileHover={{ borderColor: 'rgba(124,92,255,0.4)', color: '#F5F5F7' }}
            className={styles.heroSocialProof}
          >
            {/* avatarStack — 3 profiles */}
            <span className={styles.heroAvatarStack}>
              {['A', 'M', 'R'].map((initial, i) => (
                <span
                  key={initial}
                  className={styles.heroAvatar}
                >
                  {initial}
                </span>
              ))}
            </span>
            Trusted by 200+ data teams
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
