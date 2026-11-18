import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollSnapshot {
  velocity: number;
  progress: number;
  direction: number;
  scroll: number;
}

type ScrollListener = (snapshot: ScrollSnapshot) => void;

let lenis: Lenis | null = null;
let consumerCount = 0;
let tickerRegistered = false;
let nativeScrollListening = false;
let scrollListeners = new Set<ScrollListener>();

const reduceMotionQuery = '(prefers-reduced-motion: reduce)';

const getSnapshot = (event?: { velocity?: number; progress?: number; direction?: number; scroll?: number }): ScrollSnapshot => {
  const scroll = event?.scroll ?? window.scrollY;
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

  return {
    velocity: event?.velocity ?? 0,
    progress: event?.progress ?? Math.min(1, Math.max(0, scroll / maxScroll)),
    direction: event?.direction ?? (scroll > 0 ? 1 : -1),
    scroll,
  };
};

const notifyScrollListeners = (snapshot: ScrollSnapshot) => {
  scrollListeners.forEach((listener) => listener(snapshot));
};

const nativeTicker = () => {
  notifyScrollListeners(getSnapshot());
};

const tickerCallback = (time: number) => {
  lenis?.raf(time * 1000);
};

export function subscribeScroll(listener: ScrollListener): () => void {
  scrollListeners.add(listener);
  listener(getSnapshot());
  return () => scrollListeners.delete(listener);
};

export function initScrollFoundation(): () => void {
  consumerCount += 1;

  if (consumerCount > 1) {
    return () => releaseScrollFoundation();
  }

  const prefersReducedMotion = window.matchMedia(reduceMotionQuery).matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  if (!prefersReducedMotion && !isCoarsePointer) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.8,
    });

    lenis.on('scroll', (event) => {
      ScrollTrigger.update();
      notifyScrollListeners(getSnapshot(event));
    });

    gsap.ticker.add(tickerCallback);
    tickerRegistered = true;
  } else {
    window.addEventListener('scroll', nativeTicker, { passive: true });
    nativeScrollListening = true;
  }

  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.refresh();

  return () => releaseScrollFoundation();
}

function releaseScrollFoundation() {
  consumerCount = Math.max(0, consumerCount - 1);
  if (consumerCount > 0) return;

  if (tickerRegistered) {
    gsap.ticker.remove(tickerCallback);
    tickerRegistered = false;
  }

  if (nativeScrollListening) {
    window.removeEventListener('scroll', nativeTicker);
    nativeScrollListening = false;
  }

  lenis?.destroy();
  lenis = null;
  scrollListeners.clear();
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.set(document.documentElement, { clearProps: 'scrollBehavior' });
}

export function scrollToElement(target: string | number, duration = 1.4): void {
  if (lenis) {
    lenis.scrollTo(target, { duration });
  } else if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({
      behavior: window.matchMedia(reduceMotionQuery).matches ? 'auto' : 'smooth',
      block: 'start',
    });
  } else {
    window.scrollTo({
      top: target,
      behavior: window.matchMedia(reduceMotionQuery).matches ? 'auto' : 'smooth',
    });
  }
}

export function setupSectionReveals(root: ParentNode = document): () => void {
  const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));

  if (window.matchMedia(reduceMotionQuery).matches || elements.length === 0) {
    elements.forEach((element) => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
    return () => undefined;
  }

  const context = gsap.context(() => {
    elements.forEach((element) => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            element,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', overwrite: true },
          );
        },
      });
    });
  }, root as Element);

  return () => context.revert();
}

export function setupCareChoreography(root: ParentNode = document): () => void {
  const doctorSection = root.querySelector<HTMLElement>('#doctor');
  const nursingSection = root.querySelector<HTMLElement>('#nursing');
  if (!doctorSection || !nursingSection) return () => undefined;

  const progress = { value: 0 };
  const emitProgress = () => {
    window.dispatchEvent(new CustomEvent<number>('bhagat:care-progress', {
      detail: progress.value,
    }));
  };

  const media = gsap.matchMedia(root as Element);
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: doctorSection,
        endTrigger: nursingSection,
        start: 'top 68%',
        end: 'bottom 42%',
        scrub: 1,
        invalidateOnRefresh: true,
      },
      onUpdate: emitProgress,
    });

    timeline
      .to(progress, { value: 0.5, duration: 1, ease: 'none' })
      .to(progress, { value: 1, duration: 1, ease: 'none' });

    emitProgress();
    return () => {
      window.dispatchEvent(new CustomEvent<number>('bhagat:care-progress', { detail: 0 }));
    };
  });

  return () => {
    media.revert();
    window.dispatchEvent(new CustomEvent<number>('bhagat:care-progress', { detail: 0 }));
  };
}
