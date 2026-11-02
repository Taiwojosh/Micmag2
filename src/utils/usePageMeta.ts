import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  canonical?: string;
}

const BASE_TITLE = 'Micmag Homes & Fittings';
const BASE_URL = 'https://micmaghomes.com';

/**
 * Dynamically updates document <title>, key meta tags, and canonical URL per page.
 * Falls back to base title/description if values are not supplied.
 */
export function usePageMeta({ title, description, ogTitle, ogDescription, canonical }: PageMeta) {
  useEffect(() => {
    // Update title
    document.title = `${title} | ${BASE_TITLE}`;

    // Update description meta
    let descEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', description);

    // Update OG title
    let ogTitleEl = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitleEl) ogTitleEl.setAttribute('content', ogTitle ?? `${title} | ${BASE_TITLE}`);

    // Update OG description
    let ogDescEl = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute('content', ogDescription ?? description);

    // Update Twitter title
    let twitterTitleEl = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    if (twitterTitleEl) twitterTitleEl.setAttribute('content', ogTitle ?? `${title} | ${BASE_TITLE}`);

    // Update Twitter description
    let twitterDescEl = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
    if (twitterDescEl) twitterDescEl.setAttribute('content', ogDescription ?? description);

    // Update or create canonical link tag
    const targetCanonical = canonical ?? `${BASE_URL}${window.location.pathname}`;
    let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', targetCanonical);

    // Restore base title and canonical on unmount
    return () => {
      document.title = `${BASE_TITLE} | Luxury Sandtex Paints & Ideal Standard Sanitary Ware Nigeria`;
      if (canonicalEl) canonicalEl.setAttribute('href', BASE_URL);
    };
  }, [title, description, ogTitle, ogDescription, canonical]);
}
