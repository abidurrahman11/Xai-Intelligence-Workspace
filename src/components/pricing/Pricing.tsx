'use client';

import { motion } from 'framer-motion';
import { pricingPlans } from '@/lib/mock-data';
import styles from './Pricing.module.css';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Pricing() {
  return (
    <section id="pricing" aria-label="Pricing plans" className={styles.section}>
      <div aria-hidden="true" className={styles.backgroundGlow} />

      <div className={`content-width ${styles.inner}`}>
        <div aria-hidden="true" className={styles.headerGlow} />

        <div className={styles.header}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`text-mono-label ${styles.eyebrow}`}
          >
            Pricing · {new Date().getFullYear()}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className={`font-display ${styles.headline}`}
          >
            Ready to find order in your data?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-body text-muted ${styles.subtext}`}
          >
            Start free today. Upgrade when your team is ready to scale.
          </motion.p>
        </div>

        <div className={styles.plansGrid}>
          {pricingPlans.map((plan, index) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: index * 0.08 }}
              whileHover={{
                y: plan.highlighted ? undefined : -3,
                borderColor: plan.highlighted ? undefined : 'rgba(124, 92, 255, 0.28)',
                transition: { duration: 0.18, ease: 'easeOut' },
              }}
              className={`${styles.planCard} ${plan.highlighted ? styles.planCardHighlighted : ''}`}
            >
              {plan.highlighted && (
                <span className={styles.planBadge}>Most Popular</span>
              )}

              <h3 className={styles.planName}>{plan.name}</h3>

              <div className={styles.priceRow}>
                <span className={styles.price}>{plan.price}</span>
                <span className={styles.period}>{plan.period}</span>
              </div>

              <p className={styles.description}>{plan.description}</p>

              <ul className={styles.featureList}>
                {plan.features.map((feature) => (
                  <li key={feature} className={styles.featureItem}>
                    <svg
                      className={styles.featureIcon}
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 7L5.5 10L11.5 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                id={`pricing-cta-${plan.id}`}
                className={`${styles.planCta} ${plan.highlighted ? styles.planCtaPrimary : styles.planCtaSecondary}`}
              >
                {plan.cta}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M2 6H10M7 3L10 6L7 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
