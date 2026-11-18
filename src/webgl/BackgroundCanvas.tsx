import React, { useEffect, useRef, useState } from 'react';
import type { VisualizerControls } from './CardiacVisualizer';

let webGLSupported: boolean | null = null;

function supportsWebGL(): boolean {
  if (webGLSupported !== null) return webGLSupported;

  const probe = document.createElement('canvas');
  const context = probe.getContext('webgl2') || probe.getContext('webgl');
  if (!context) {
    webGLSupported = false;
    return webGLSupported;
  }
  context.getExtension('WEBGL_lose_context')?.loseContext();
  webGLSupported = true;
  return webGLSupported;
}

function shouldRenderScene(): boolean {
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowMemory = typeof deviceMemory === 'number' && deviceMemory <= 2;
  const fewCores = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2;

  return window.matchMedia('(min-width: 768px) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    && !lowMemory
    && !fewCores
    && supportsWebGL();
}

export const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const visualizerRef = useRef<VisualizerControls | null>(null);
  const [isSceneActive, setIsSceneActive] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    let cancelled = false;
    let firstFrame = 0;
    let secondFrame = 0;
    let loadTimer = 0;
    let loadGeneration = 0;
    let loadRequested = false;
    let isOnScreen = true;
    let isPageVisible = document.visibilityState === 'visible';
    let currentHeroProgress = 0;
    let currentCareProgress = 0;
    let currentServicesProgress = 0;
    let currentServicesActive = false;
    let currentFacilityProgress = 0;
    let observer: IntersectionObserver | null = null;

    const updateVisibility = () => {
      visualizerRef.current?.setVisible(isOnScreen && isPageVisible);
    };

    const handleCareProgress = (event: Event) => {
      currentCareProgress = (event as CustomEvent<number>).detail;
      visualizerRef.current?.setCareProgress(currentCareProgress);
    };

    const handleServicesProgress = (event: Event) => {
      const { progress, active } = (event as CustomEvent<{ progress: number; active: boolean }>).detail;
      currentServicesProgress = progress;
      currentServicesActive = active;
      visualizerRef.current?.setServicesProgress(progress, active);
    };

    const handleFacilityProgress = (event: Event) => {
      currentFacilityProgress = (event as CustomEvent<number>).detail;
      visualizerRef.current?.setFacilityProgress(currentFacilityProgress);
    };

    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState === 'visible';
      updateVisibility();
    };

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      visualizerRef.current?.updateMouse(x, y);
    };

    const handleHeroProgress = (event: Event) => {
      currentHeroProgress = (event as CustomEvent<number>).detail;
      visualizerRef.current?.setCinematicProgress(currentHeroProgress);
    };

    const stopScene = () => {
      loadGeneration += 1;
      loadRequested = false;
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      window.clearTimeout(loadTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer?.disconnect();
      observer = null;
      visualizerRef.current?.destroy();
      visualizerRef.current = null;
      setIsSceneActive(false);
    };

    const startScene = async (generation: number) => {
      try {
        const { initCardiacVisualizer } = await import('./CardiacVisualizer');
        if (cancelled || generation !== loadGeneration || !shouldRenderScene() || !canvasRef.current) return;

        visualizerRef.current = initCardiacVisualizer(canvasRef.current);
        setIsSceneActive(true);

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        visualizerRef.current.setCinematicProgress(currentHeroProgress);
        visualizerRef.current.setCareProgress(currentCareProgress);
        visualizerRef.current.setServicesProgress(currentServicesProgress, currentServicesActive);
        visualizerRef.current.setFacilityProgress(currentFacilityProgress);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        if ('IntersectionObserver' in window && containerRef.current) {
          observer = new IntersectionObserver(([entry]) => {
            isOnScreen = entry.isIntersecting;
            updateVisibility();
          });
          observer.observe(containerRef.current);
        }
        updateVisibility();
      } catch (error) {
        if (!cancelled && generation === loadGeneration) {
          console.warn('3D heart unavailable; showing the static illustration instead.', error);
        }
      } finally {
        if (generation === loadGeneration) loadRequested = false;
      }
    };

    const scheduleSceneLoad = () => {
      if (cancelled || loadRequested || visualizerRef.current || !shouldRenderScene()) return;
      loadRequested = true;
      const generation = ++loadGeneration;

      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          loadTimer = window.setTimeout(() => void startScene(generation), 0);
        });
      });
    };

    const handleCapabilityChange = () => {
      if (shouldRenderScene()) {
        scheduleSceneLoad();
      } else {
        stopScene();
      }
    };

    const desktopQuery = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    window.addEventListener('bhagat:hero-progress', handleHeroProgress);
    window.addEventListener('bhagat:care-progress', handleCareProgress);
    window.addEventListener('bhagat:services-progress', handleServicesProgress);
    window.addEventListener('bhagat:facility-progress', handleFacilityProgress);
    desktopQuery.addEventListener('change', handleCapabilityChange);
    motionQuery.addEventListener('change', handleCapabilityChange);
    window.addEventListener('resize', handleCapabilityChange, { passive: true });

    scheduleSceneLoad();

    return () => {
      cancelled = true;
      stopScene();
      window.removeEventListener('bhagat:hero-progress', handleHeroProgress);
      window.removeEventListener('bhagat:care-progress', handleCareProgress);
      window.removeEventListener('bhagat:services-progress', handleServicesProgress);
      window.removeEventListener('bhagat:facility-progress', handleFacilityProgress);
      desktopQuery.removeEventListener('change', handleCapabilityChange);
      motionQuery.removeEventListener('change', handleCapabilityChange);
      window.removeEventListener('resize', handleCapabilityChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="cardiac-background fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className={`heart-fallback${isSceneActive ? ' heart-fallback-hidden' : ''}`}
        viewBox="0 0 360 420"
        role="presentation"
      >
        <defs>
          <linearGradient id="heart-tissue" x1="0.15" x2="0.85" y1="0.1" y2="0.95">
            <stop offset="0" stopColor="#a8d7d0" />
            <stop offset="0.48" stopColor="#4eaaa5" />
            <stop offset="1" stopColor="#176b73" />
          </linearGradient>
          <linearGradient id="heart-vessels" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#8bd0c8" />
            <stop offset="1" stopColor="#267e83" />
          </linearGradient>
          <linearGradient id="heart-highlight" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#d9f3ee" />
            <stop offset="1" stopColor="#63b5ae" />
          </linearGradient>
        </defs>
        <path
          d="M164 170C160 128 165 73 180 42c8-17 28-23 42-15 17 10 16 31 8 48l-9 20"
          fill="none"
          stroke="url(#heart-vessels)"
          strokeWidth="30"
          strokeLinecap="round"
        />
        <path
          d="M192 166c-2-36 11-68 33-84 23-17 57-12 77 5 12 10 16 23 14 36"
          fill="none"
          stroke="url(#heart-vessels)"
          strokeWidth="25"
          strokeLinecap="round"
        />
        <path
          d="M205 96c-5-27-4-48 1-67m20 58c2-29 1-48-2-68m23 72c8-25 12-42 12-61"
          fill="none"
          stroke="url(#heart-vessels)"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <path
          d="M138 166c-4-24-4-53-1-83m125 101c26-20 47-22 70-12"
          fill="none"
          stroke="url(#heart-vessels)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M178 151c-13-25-37-35-59-22-23 13-27 41-13 62 12 18 32 27 52 24m35-60c10-25 32-37 55-28 23 10 27 34 14 54-12 17-28 26-48 25"
          fill="url(#heart-highlight)"
          stroke="#398b89"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M164 170C128 139 88 149 73 187c-19 48 3 117 43 162 25 28 51 49 77 65 10 6 18 6 27-1 48-39 80-87 92-138 12-50-8-111-48-127-31-13-64-2-84 23Z"
          fill="url(#heart-tissue)"
          stroke="#267e83"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M113 183c20 13 43 12 61-5m-29 10c-21 22-30 47-28 76 2 34 20 67 48 91m21-153c28 5 52-5 68-25m-56 39c20 21 29 47 27 77-1 25-10 48-24 67"
          fill="none"
          stroke="#8ac9c1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <path
          d="M176 190c-12 24-23 41-42 50m42-50c17 9 29 22 39 40m-41-38c-2 38 6 76 25 112m-49-69-27 25m90-31 31 19m-55 54 25 28"
          fill="none"
          stroke="#176b73"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      </svg>
      <canvas
        ref={canvasRef}
        className={`cardiac-canvas${isSceneActive ? ' cardiac-canvas-active' : ''}`}
      />
    </div>
  );
};
