import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
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
      data-theme="dark"
      suppressHydrationWarning
      className={`${jakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = window.localStorage.getItem('xai-theme');
                  var systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                  var theme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : systemTheme;
                  document.documentElement.dataset.theme = theme;
                } catch (error) {
                  document.documentElement.dataset.theme = 'dark';
                }

                var originalWarn = console.warn.bind(console);
                console.warn = function() {
                  var firstArg = arguments[0];
                  if (
                    firstArg &&
                    typeof firstArg === 'string' &&
                    (firstArg.includes('THREE.Clock') || firstArg.includes('Clock: This module has been deprecated'))
                  ) {
                    return;
                  }
                  originalWarn.apply(console, arguments);
                };
              })();
            `
          }}
        />
        {children}
      </body>
    </html>
  );
}
