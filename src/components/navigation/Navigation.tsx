'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { navLinks } from '@/lib/mock-data';
import styles from './Navigation.module.css';

const NAV_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const navContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const navItem = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: NAV_EASE } },
};

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const { scrollY } = useScroll();

  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 60);
  });

  // auto detect active section, based on scroll position
  useEffect(() => {
    const sections = [
      { id: 'hero', href: '' },
      { id: 'product', href: '#product' },
      { id: 'platform', href: '#platform' },
      { id: 'insights', href: '#insights' },
      { id: 'pricing', href: '#pricing' },
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if (isProgrammaticScrollRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const match = sections.find((sec) => sec.id === id);
          if (match) {
            setActiveLink(match.href);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (!isProgrammaticScrollRef.current) return;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    isProgrammaticScrollRef.current = true;
    setActiveLink(href);

    if (href === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const targetId = href.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 1000);
  };

  return (
    <motion.header
      // Framer motion will control all animated values
      animate={{
        backgroundColor: scrolled ? 'rgba(10, 10, 11, 0.82)' : 'rgba(10, 10, 11, 0)',
        borderBottomColor: scrolled ? 'rgba(38, 39, 44, 0.6)' : 'rgba(38, 39, 44, 0)',
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
        borderBottom: '1px solid',
      }}
    >
      <motion.div
        variants={navContainer}
        initial="hidden"
        animate="show"
        className={styles.navInner}
      >
        {/* Logo */}
        <motion.a
          variants={navItem}
          href="#"
          onClick={(e) => handleLinkClick(e, '')}
          style={{
            fontFamily: 'var(--font-jakarta)',
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: '#F5F5F7',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
          aria-label="Xai home"
        >
          <img src="/xai-logo.png" alt="Xai logo" className={styles.logoImage} />
          <span className={styles.logoText}>Xai</span>
        </motion.a>

        {/* nav links */}
        <nav aria-label="Main navigation" className={styles.nav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => {
              const isActive = activeLink === link.href;
              return (
                <motion.li
                  key={link.label}
                  variants={navItem}
                  style={{ position: 'relative', paddingBottom: '4px' }}
                >
                  <motion.a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    animate={{ color: isActive ? '#F5F5F7' : '#9A9AA2' }}
                    whileHover={{ color: '#F5F5F7' }}
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '14px',
                      fontWeight: 400,
                      textDecoration: 'none',
                      letterSpacing: '0.01em',
                      display: 'block',
                    }}
                  >
                    {link.label}
                  </motion.a>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-line"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '1.5px',
                        backgroundColor: '#7C5CFF',
                        borderRadius: '1px',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* CTA */}
        <motion.a
          variants={navItem}
          href="#pricing"
          onClick={(e) => handleLinkClick(e, '#pricing')}
          whileHover={{
            scale:     1.02,
            boxShadow: '0 0 20px rgba(124,92,255,0.38)',
          }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 18px',
            borderRadius: '8px',
            backgroundColor: '#7C5CFF',
            color:'#F5F5F7',
            fontFamily:'var(--font-inter)',
            fontSize: '13px',
            fontWeight:500,
            textDecoration: 'none',
            letterSpacing: '0.01em',
            boxShadow: '0 0 0 0 rgba(124,92,255,0)',
          }}
          id="nav-start-free"
        >
          Start Free
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      </motion.div>
    </motion.header>
  );
}
