# Xai — Intelligence Workspace

Live site: https://xai-intelligence-workspace-nine.vercel.app

Project walkthrough video: https://youtu.be/YznPE3UvK8w

## Overview

Xai is a dark-mode, desktop-first Next.js landing experience for an AI data-intelligence platform. The whole page follows a clear **Chaos → Order** narrative: fragmented data becomes structured intelligence through scroll-driven sections, a 3D hero field, a pinned insight flow, a dashboard preview, and an orbital stories section.

The implementation focuses on clarity, information flow, and visual rhythm. It is fully responsive, efficient, and the text content is tightly matched to the animations so the motion supports the message instead of distracting from it.

My approach to the brand was to make Xai feel precise, calm, and premium. I used restrained colors, strong typography, subtle motion, and a consistent visual rhythm so the interface reads like a serious intelligence product rather than a generic SaaS template.

## Project Structure

```txt
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── navigation/
│   ├── hero/
│   ├── insight-flow/
│   ├── dashboard/
│   ├── stories/
│   ├── pricing/
│   └── footer/
└── lib/
    └── mock-data.ts
```

## Technology Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Framer Motion
- React Three Fiber + Three.js + Drei
- Tailwind CSS v4
- CSS Modules
- Google Fonts via `next/font`

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

For a production check:

```bash
npm run build
npm start
```

## Animation And Interaction Notes

- Hero section: client-only 3D particle scene with cursor and scroll response
- Insight Flow: scroll-pinned three-stage narrative that shifts from ingestion to analysis to generated insight
- Dashboard: animated metrics, chart reveal, and table transitions for a product-like feel
- Constellation: draggable and scroll-reactive orbital carousel built to reinforce the “Order from Chaos” theme
- Reduced-motion support is respected across the interactive sections
