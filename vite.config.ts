import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { legalPages, SITE_URL } from './src/pages/legalContent';

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

function replaceMeta(html: string, attribute: 'name' | 'property', key: string, content: string) {
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  const pattern = new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace('</head>', `  ${tag}\n  </head>`);
}

function prerenderLegalRoutes(): Plugin {
  return {
    name: 'prerender-legal-routes',
    apply: 'build',
    async writeBundle(options) {
      const outputDirectory = resolve(options.dir ?? 'dist');
      const baseHtml = await readFile(resolve(outputDirectory, 'index.html'), 'utf8');

      for (const page of Object.values(legalPages)) {
        const title = escapeHtml(page.title);
        const description = escapeHtml(page.description);
        const canonical = `${SITE_URL}${page.path}`;
        const heading = page.title.split(' |')[0];
        const sections = page.sections.map((section) => {
          const sectionId = `legal-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          return `<section aria-labelledby="${sectionId}"><h2 id="${sectionId}">${escapeHtml(section.heading)}</h2>${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`;
        }).join('');
        const mainContent = `<header class="legal-header"><a class="legal-brand" href="/">Bhagat Hospital</a><a class="legal-home-link" href="/">Back to homepage</a></header><main class="legal-main"><nav class="legal-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>${escapeHtml(heading)}</span></nav><article><h1>${escapeHtml(heading)}</h1><p class="legal-intro">${description}</p>${sections}<p class="legal-contact">Bhagat Hospital · Bhuj · <a href="tel:+917069232432">+91 70692 32432</a></p></article></main><footer class="legal-footer"><span>© ${new Date().getFullYear()} Bhagat Hospital, Bhuj. All rights reserved.</span><nav aria-label="Legal information"><a href="/privacy-policy">Privacy Policy</a><a href="/terms-and-conditions">Terms and Conditions</a><a href="/medical-disclaimer">Medical Disclaimer</a></nav></footer>`;
        let html = baseHtml
          .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
          .replace(/<link rel="canonical" href="[^"]*" \/>/i, `<link rel="canonical" href="${canonical}" />`)
          .replace(/<script type="application\/ld\+json" data-static-site-structured-data>[\s\S]*?<\/script>/gi, '')
          .replace('<div id="root"></div>', `<div id="root"><div class="legal-page">${mainContent}</div></div>`);
        html = replaceMeta(html, 'name', 'description', page.description);
        html = replaceMeta(html, 'property', 'og:title', page.title);
        html = replaceMeta(html, 'property', 'og:description', page.description);
        html = replaceMeta(html, 'property', 'og:url', canonical);
        html = replaceMeta(html, 'name', 'twitter:title', page.title);
        html = replaceMeta(html, 'name', 'twitter:description', page.description);
        html = replaceMeta(html, 'name', 'robots', 'index,follow');
        const pageDirectory = resolve(outputDirectory, page.path.slice(1));
        await mkdir(pageDirectory, { recursive: true });
        await writeFile(resolve(pageDirectory, 'index.html'), html, 'utf8');
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), prerenderLegalRoutes()],
  server: {
    port: 5173,
    host: true
  }
});
