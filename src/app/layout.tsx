import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700'],
  display:  'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets:  ['latin'],
  weight:   ['400', '500'],
  display:  'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets:  ['latin'],
  weight:   ['400', '500'],
  display:  'swap',
});

export const metadata: Metadata = {
  title:       'Xai — Intelligence Workspace',
  description: 'Turn fragmented, raw data into structured, actionable intelligence — in real time. Xai is the workspace built for decision-makers.',
  keywords:    ['AI', 'data intelligence', 'analytics', 'automation', 'machine learning'],
  openGraph: {
    title:       'Xai — Intelligence Workspace',
    description: 'Turn Data Into Decisions.',
    type:        'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                let originalWarn = console.warn;
                Object.defineProperty(console, 'warn', {
                  get() {
                    return function(...args) {
                      if (
                        args[0] &&
                        typeof args[0] === 'string' &&
                        (args[0].includes('THREE.Clock') || args[0].includes('Clock: This module has been deprecated'))
                      ) {
                        return;
                      }
                      originalWarn.apply(console, args);
                    };
                  },
                  set(newWarn) {
                    originalWarn = newWarn;
                  },
                  configurable: true,
                  enumerable: true,
                });
              })();
            `
          }}
        />
        {children}
      </body>
    </html>
  );
}
