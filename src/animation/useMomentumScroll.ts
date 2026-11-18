import { useEffect, useState } from 'react';
import {
  initScrollFoundation,
  scrollToElement,
  subscribeScroll,
} from './scrollFoundation';

interface ScrollState {
  velocity: number;
  progress: number;
  direction: number;
  scroll: number;
  activeSection: string;
}

export function useMomentumScroll() {
  const [scrollState, setScrollState] = useState<ScrollState>({
    velocity: 0,
    progress: 0,
    direction: 1,
    scroll: 0,
    activeSection: 'hero'
  });

  useEffect(() => {
    const unsubscribeFoundation = initScrollFoundation();
    const unsubscribeScroll = subscribeScroll((snapshot) => {
      // Find active section
      const sections = ['hero', 'doctor', 'nursing', 'services', 'tour', 'stats', 'location'];
      let currentSection = 'hero';

      const windowHeight = window.innerHeight;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= windowHeight * 0.4 && rect.bottom >= windowHeight * 0.2) {
            currentSection = sectionId;
          }
        }
      }

      setScrollState({
        velocity: snapshot.velocity,
        progress: snapshot.progress,
        direction: snapshot.direction,
        scroll: snapshot.scroll,
        activeSection: currentSection
      });
    });

    return () => {
      unsubscribeScroll();
      unsubscribeFoundation();
    };
  }, []);

  const scrollTo = (target: string | number) => {
    scrollToElement(target, 1.4);
  };

  return { ...scrollState, scrollTo };
}
