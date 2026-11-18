import React from 'react';
import type { LegalPageContent } from './legalContent';
import { CreatorCredit } from '../components/CreatorCredit';

interface LegalPagesProps {
  page: LegalPageContent;
}

export const LegalPage: React.FC<LegalPagesProps> = ({ page }) => (
  <div className="legal-page">
    <header className="legal-header">
      <a className="legal-brand" href="/">Bhagat Hospital</a>
      <a className="legal-home-link" href="/">Back to homepage</a>
    </header>
    <main className="legal-main">
      <nav className="legal-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span aria-hidden="true">/</span><span>{page.title.split(' |')[0]}</span>
      </nav>
      <article>
        <h1>{page.title.split(' |')[0]}</h1>
        <p className="legal-intro">{page.description}</p>
        {page.sections.map((section) => (
          <section key={section.heading} aria-labelledby={`legal-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
            <h2 id={`legal-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
        <p className="legal-contact">Bhagat Hospital · Bhuj · <a href="tel:+917069232432">+91 70692 32432</a></p>
      </article>
    </main>
    <footer className="legal-footer">
      <span>© {new Date().getFullYear()} Bhagat Hospital, Bhuj. All rights reserved.</span>
      <nav aria-label="Legal">
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms-and-conditions">Terms and Conditions</a>
        <a href="/medical-disclaimer">Medical Disclaimer</a>
      </nav>
      <CreatorCredit />
    </footer>
  </div>
);
