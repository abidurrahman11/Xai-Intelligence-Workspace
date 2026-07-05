'use client';

import styles from './Footer.module.css';

// ── social SVG icons ──
const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M12.6 1.5H14.8L10 6.9L15.5 14.5H11.2L7.8 9.9L3.9 14.5H1.7L6.8 8.7L1.5 1.5H5.9L9 5.7L12.6 1.5ZM11.8 13.2H12.9L5.2 2.7H4L11.8 13.2Z" fill="currentColor" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M8 0.5C3.858 0.5 0.5 3.858 0.5 8c0 3.314 2.15 6.128 5.13 7.12.375.07.512-.163.512-.362 0-.179-.007-.773-.01-1.4-2.088.454-2.53-.894-2.53-.894-.342-.868-.834-1.1-.834-1.1-.682-.466.051-.457.051-.457.754.053 1.15.774 1.15.774.67 1.147 1.758.816 2.187.624.068-.485.262-.816.476-1.004-1.667-.19-3.42-.834-3.42-3.71 0-.82.292-1.49.772-2.013-.077-.19-.335-.954.074-1.988 0 0 .63-.201 2.063.77A7.18 7.18 0 018 4.793c.638.003 1.28.086 1.879.253 1.43-.971 2.06-.77 2.06-.77.41 1.034.152 1.797.074 1.988.481.524.77 1.193.77 2.013 0 2.884-1.756 3.519-3.429 3.703.27.232.51.69.51 1.391 0 1.004-.009 1.813-.009 2.06 0 .2.136.436.516.361C13.354 14.125 15.5 11.312 15.5 8c0-4.142-3.358-7.5-7.5-7.5z" fill="currentColor" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M14 0.5H2C1.172 0.5 0.5 1.172 0.5 2V14C0.5 14.828 1.172 15.5 2 15.5H14C14.828 15.5 15.5 14.828 15.5 14V2C15.5 1.172 14.828 0.5 14 0.5ZM5.5 12.5H3.5V6H5.5V12.5ZM4.5 5.15C3.836 5.15 3.3 4.608 3.3 3.95C3.3 3.292 3.836 2.75 4.5 2.75C5.164 2.75 5.7 3.292 5.7 3.95C5.7 4.608 5.164 5.15 4.5 5.15ZM12.5 12.5H10.5V9.2C10.5 8.15 10.1 7.75 9.3 7.75C8.5 7.75 8.1 8.35 8.1 9.3V12.5H6.1V6H8V7C8.3 6.4 9.1 5.85 10 5.85C11.4 5.85 12.5 6.75 12.5 8.6V12.5Z" fill="currentColor" />
  </svg>
);

// ── Footer nav links ──
const footerLinks = [
  { group: 'Product', links: ['Workspace', 'Integrations', 'Automations', 'Pricing'] },
  { group: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
  { group: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Status'] },
];

export default function Footer() {
  return (
    <footer id="company" aria-label="Footer" className={styles.footer}>
      <div aria-hidden="true" className={styles.backgroundGlow} />

      {/* ── footer nav ───── */}
      <div className={`${styles.footerNav} content-width`}>
        <div>
          <div className={styles.brandBlock}>
            <img
              src="/xai-logo.png"
              alt="Xai"
              className={styles.brandIcon}
            />
            <span className={styles.brandText}>Xai</span>
          </div>
          <p className={`text-body text-muted ${styles.tagline}`}>
            Turn Data Into Decisions.
          </p>
          <div className={styles.socialList}>
            {[
              { href: '#', label: 'Xai on X (Twitter)', Icon: TwitterIcon },
              { href: '#', label: 'Xai on GitHub', Icon: GitHubIcon },
              { href: '#', label: 'Xai on LinkedIn', Icon: LinkedInIcon },
            ].map(({ href, label, Icon }) => (
              <a key={label} href={href} aria-label={label} className={styles.socialLink}>
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className={styles.navColumns}>
          {footerLinks.map((col) => (
            <div key={col.group}>
              <p className={`font-mono ${styles.navLabel}`}>{col.group}</p>
              <ul className={styles.navList}>
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href={link === 'Pricing' ? '#pricing' : '#'}
                      className={styles.navLink}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ────────── */}
      <div className={styles.bottomBar}>
        <p className={`font-mono ${styles.bottomText}`}>
          © {new Date().getFullYear()} Xai, Inc. All rights reserved.
        </p>
        <p className={`font-mono ${styles.bottomMeta}`}>
          Intelligence Workspace · v0.1.0
        </p>
      </div>

      <div aria-hidden="true" className={styles.watermark}>
        <img src="/xai-logo.png" alt="" />
      </div>
    </footer>
  );
}
