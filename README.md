# Bhagat Hospital Website

A responsive hospital website for Bhagat Hospital in Bhuj, Gujarat. The site presents the hospital, cardiology services, care team, facility zones, patient reviews, and contact information, with a clinical visual identity and restrained scroll animations.

**Live site:** [bhagathospital.vercel.app](https://bhagathospital.vercel.app/)

## Features

- Responsive single-page hospital website with navigation to page sections.
- Dedicated Privacy Policy, Terms and Conditions, and Medical Disclaimer pages.
- Shared clinical design tokens, Fraunces headings, and Inter body typography.
- GSAP and ScrollTrigger section animations, with Lenis smooth scrolling where supported.
- A lazily loaded procedural Three.js heart with a static SVG fallback.
- Reduced-motion and smaller-screen alternatives for motion-heavy experiences.
- Appointment request form with client-side validation. The current form is a demonstration and does **not** submit or confirm appointments.
- Page metadata, Open Graph tags, Hospital and Physician structured data, `robots.txt`, and `sitemap.xml`.

## Technology

- React 18 and TypeScript
- Vite
- Tailwind CSS
- GSAP and ScrollTrigger
- Lenis
- Three.js

## Getting started

Use Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL after the server starts.

### Production build

```bash
npm run build
npm run preview
```

The build runs the TypeScript compiler before producing optimized files in `dist/`. The Vite build also prerenders the legal pages into their own HTML files. `npm run preview` serves the production output locally.

## Project structure

```text
src/
  animation/       Shared scroll setup, reveals, and motion hooks
  components/
    hud/           Header, scroll progress, and cursor components
    sections/      Hospital page sections and appointment/contact UI
  pages/           Legal page views and content
  webgl/           Lazy WebGL scene and procedural heart model
  App.tsx          Home and legal-page routing
  design-tokens.css
  index.css
public/
  robots.txt
  sitemap.xml
```

### Main page sections

The home page is composed in `src/App.tsx`. Section components live under `src/components/sections/`:

- Hero and appointment entry point
- Chief Cardiologist
- Nursing Collective
- Cardiology services
- Facility and wards explorer
- Reviews and statistics
- Location, contact, and footer

The global header, progress indicator, and cursor are in `src/components/hud/`.

## Animation and visual system

- `src/animation/scrollFoundation.ts` centralizes Lenis, GSAP ticker integration, ScrollTrigger setup, and reusable section reveals.
- `src/webgl/BackgroundCanvas.tsx` owns the single fixed background canvas, fallback illustration, lazy loading, and scene lifecycle.
- `src/webgl/CardiacVisualizer.ts` builds the procedural heart and handles its animation.
- `src/design-tokens.css` contains the color, typography, spacing, radius, shadow, and transition tokens.
- `src/index.css` contains global styles and responsive component styling.

Smooth scrolling and motion effects are disabled or simplified for reduced-motion preferences and on supported mobile/touch configurations. The 3D heart requires WebGL and a capable desktop device; the site falls back to a static illustration when the scene is unavailable or not appropriate to render.

## Routes and SEO

The application supports these page routes:

- `/` — Hospital home page
- `/privacy-policy`
- `/terms-and-conditions`
- `/medical-disclaimer`

Legal page content is in `src/pages/legalContent.ts`, and page rendering is in `src/pages/LegalPages.tsx`. Vite prerenders legal-page HTML during production builds; `vercel.json` maps the clean paths to those generated files. Update the canonical site URL and metadata consistently if the deployment domain changes. SEO metadata and structured data are maintained in `index.html` and `src/components/SeoMetadata.tsx`.

## Integration TODOs

- Connect the appointment request handler to a real backend and configure an approved WhatsApp appointment link in `src/components/sections/AppointmentModal.tsx`. Do not present the current demo as a confirmed booking.
- Replace the doctor portrait placeholder with an approved photograph and add the verified council registration number in `src/components/sections/SeniorDoctorSpotlight.tsx`.
- Add approved facility photographs for the four zones in `src/components/sections/VirtualTour3D.tsx`.

## Deployment notes

The canonical site URL is currently `https://bhagathospital.vercel.app/`. The repository includes Vercel rewrites for the legal routes and crawler files in `public/`. When deploying elsewhere, configure equivalent clean-route handling and update canonical URLs and the sitemap to match the deployment domain.
