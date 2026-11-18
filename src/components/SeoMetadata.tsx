import { useEffect } from 'react';
import { SITE_URL } from '../pages/legalContent';
import { getAppPath } from '../utils/sitePaths';

interface SeoMetadataProps {
  title: string;
  description: string;
  path?: string;
  includeStructuredData?: boolean;
  indexable?: boolean;
}

const setMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = content;
};

const setLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.append(element);
  }
  element.href = href;
};

const hospitalStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Hospital',
  name: 'Bhagat Hospital',
  url: SITE_URL,
  telephone: '+917069232432',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1st Floor, Ashirwad Plaza, Near Reliance Mall, Mundra - Bhuj Rd, Aksha Nagar',
    addressLocality: 'Bhuj',
    addressRegion: 'Gujarat',
    postalCode: '370001',
    addressCountry: 'IN',
  },
  medicalSpecialty: 'Cardiovascular',
  employee: { '@id': `${SITE_URL}/#physician` },
};

const physicianStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Physician',
  '@id': `${SITE_URL}/#physician`,
  name: 'Dr. Ramesh Bhagat',
  medicalSpecialty: 'Cardiovascular',
  worksFor: { '@id': SITE_URL },
};

const getCurrentSiteUrl = () => new URL(getAppPath('/'), window.location.origin).href;

export const SeoMetadata: React.FC<SeoMetadataProps> = ({
  title,
  description,
  path = '/',
  includeStructuredData = false,
  indexable = true,
}) => {
  useEffect(() => {
    const siteUrl = getCurrentSiteUrl();
    const canonicalUrl = new URL(getAppPath(path), window.location.origin).href;
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:site_name', 'Bhagat Hospital');
    setMeta('property', 'og:locale', 'en_IN');
    setMeta('name', 'twitter:card', 'summary');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'robots', indexable ? 'index,follow' : 'noindex,follow');
    setLink('canonical', canonicalUrl);

    document.head.querySelectorAll('script[data-site-structured-data]').forEach((script) => script.remove());
    document.head.querySelectorAll('script[data-static-site-structured-data]').forEach((script) => script.remove());
    if (includeStructuredData) {
      const physicianId = `${siteUrl}#physician`;
      const schemas = [
        {
          ...hospitalStructuredData,
          url: siteUrl,
          employee: { '@id': physicianId },
        },
        {
          ...physicianStructuredData,
          '@id': physicianId,
          worksFor: { '@id': siteUrl },
        },
      ];
      schemas.forEach((schema) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.dataset.siteStructuredData = 'true';
        script.textContent = JSON.stringify(schema);
        document.head.append(script);
      });
    }

    return () => {
      document.head.querySelectorAll('script[data-site-structured-data]').forEach((script) => script.remove());
    };
  }, [description, includeStructuredData, indexable, path, title]);

  return null;
};
