'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { scrollY } = useScroll();

  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedTheme = window.localStorage.getItem('xai-theme');
    const rootTheme = document.documentElement.dataset.theme;
    const nextTheme = storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : rootTheme === 'light'
        ? 'light'
        : 'dark';

    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
  }, []);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 60);
  });

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 680) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [menuOpen]);

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
    setMenuOpen(false);
    
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

  const handleThemeToggle = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = nextTheme;
      window.localStorage.setItem('xai-theme', nextTheme);
      return nextTheme;
    });
  };

  return (
    <motion.header
      className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}
    >
      <motion.div
        variants={navContainer}
        initial="hidden"
        animate="show"
        className={`${styles.navInner} ${menuOpen ? styles.navInnerOpen : ''}`}
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
        <nav
          id="primary-navigation"
          aria-label="Main navigation"
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}
        >
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
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
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
                        backgroundColor: 'var(--color-violet)',
                        borderRadius: '1px',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.li>
              );
            })}
            <motion.li variants={navItem} className={styles.mobileCtaItem}>
              <motion.a
                href="#pricing"
                onClick={(e) => handleLinkClick(e, '#pricing')}
                whileTap={{ scale: 0.98 }}
                className={styles.mobileCta}
              >
                Start Free
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.a>
            </motion.li>
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
            backgroundColor: 'var(--color-violet)',
            color:'var(--theme-accent-contrast)',
            fontFamily:'var(--font-inter)',
            fontSize: '13px',
            fontWeight:500,
            textDecoration: 'none',
            letterSpacing: '0.01em',
            boxShadow: '0 0 0 0 rgba(124,92,255,0)',
          }}
          id="nav-start-free"
          className={styles.navCta}
        >
          Start Free
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>

        <div className={styles.actions}>
          <motion.button
            variants={navItem}
            type="button"
            className={styles.themeButton}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-pressed={theme === 'light'}
            onClick={handleThemeToggle}
            whileTap={{ scale: 0.96 }}
          >
            <span className={styles.themeIcon} aria-hidden="true">
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M8 1.3v1.5M8 13.2v1.5M1.3 8h1.5M13.2 8h1.5M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M12.8 3.2l-1.1 1.1M4.3 11.7l-1.1 1.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12.2 10.4A5.1 5.1 0 0 1 5.6 3.8a5.7 5.7 0 1 0 6.6 6.6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </motion.button>

          <motion.button
            variants={navItem}
            type="button"
            className={styles.menuButton}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            whileTap={{ scale: 0.96 }}
          >
            <span className={styles.menuButtonLine} />
            <span className={styles.menuButtonLine} />
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileScrim}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}
