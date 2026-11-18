import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { medicalAudio } from '../hud/AudioSynthesizer';

gsap.registerPlugin(ScrollTrigger);

const zones = [
  {
    id: 'consultation',
    name: 'Consultation Suite',
    description: 'A setting for consultations and conversations with the care team.',
  },
  {
    id: 'diagnostic-lab',
    name: 'Diagnostic Lab',
    description: 'A dedicated area for diagnostic appointments and tests.',
  },
  {
    id: 'icu-ward',
    name: 'ICU Ward',
    description: 'A care area for patients who need hospital-based monitoring.',
  },
  {
    id: 'recovery-rooms',
    name: 'Recovery Rooms',
    description: 'A place to rest and recover during a hospital stay.',
  },
] as const;

const emitFacilityProgress = (progress: number) => {
  window.dispatchEvent(new CustomEvent<number>('bhagat:facility-progress', {
    detail: progress,
  }));
};

export const VirtualTour3D: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const windowRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const zoneButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const facilityWindow = windowRef.current;
    const progressBar = progressRef.current;
    if (!section || !facilityWindow || !progressBar) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        let lastZone = -1;
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${window.innerHeight * 3}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const nextZone = Math.min(zones.length - 1, Math.floor(self.progress * zones.length));
              if (nextZone !== lastZone) {
                lastZone = nextZone;
                setSelectedZone(nextZone);
              }
              progressBar.style.transform = `scaleX(${self.progress})`;
              emitFacilityProgress(self.progress);
            },
            onLeave: () => emitFacilityProgress(1),
            onLeaveBack: () => emitFacilityProgress(0),
          },
        });

        timeline.fromTo(
          facilityWindow,
          {
            clipPath: 'inset(9% 5% round 34px)',
            scale: 0.96,
          },
          {
            clipPath: 'inset(0% 0% round 0px)',
            scale: 1,
            duration: 0.34,
            ease: 'none',
          },
          0,
        );

        return () => {
          progressBar.style.transform = 'scaleX(0)';
          emitFacilityProgress(0);
        };
      });
    }, section);

    return () => {
      media.revert();
      context.revert();
      emitFacilityProgress(0);
    };
  }, []);

  useEffect(() => {
    const title = titleRef.current;
    const description = descriptionRef.current;
    if (
      !title
      || !description
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    gsap.fromTo(
      [title, description],
      { y: 10, opacity: 0.35 },
      { y: 0, opacity: 1, duration: 0.38, stagger: 0.04, ease: 'power2.out', overwrite: true },
    );
  }, [selectedZone]);

  const selectZone = (index: number, focus = false) => {
    medicalAudio.playClick();
    setSelectedZone(index);
    if (focus) zoneButtonRefs.current[index]?.focus();
  };

  const handleZoneKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = (index + 1) % zones.length;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + zones.length) % zones.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = zones.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      selectZone(nextIndex, true);
    }
  };

  const currentZone = zones[selectedZone];

  return (
    <section ref={sectionRef} id="tour" className="facility-section relative z-10">
      <div ref={windowRef} className="facility-window glass-panel-glow">
        <header className="facility-header">
          <div className="facility-heading-copy">
            <p className="facility-eyebrow">BHAGAT HOSPITAL · BHUJ</p>
            <h2 className="facility-title">Facility &amp; Wards Explorer</h2>
            <p className="facility-intro">
              Explore the hospital’s care spaces. Photographs and room details will be added after on-site verification.
            </p>
          </div>
          <div className="facility-address">
            <MapPin aria-hidden="true" />
            <span>1st Floor, Ashirwad Plaza, Bhuj</span>
          </div>
        </header>

        <div className="facility-content">
          <nav className="facility-zones" aria-label="Facility zones">
            <p className="facility-zones-label">Explore an area</p>
            <div className="facility-zone-tabs" role="tablist" aria-label="Facility areas">
              {zones.map((zone, index) => (
                <button
                  key={zone.id}
                  ref={(element) => { zoneButtonRefs.current[index] = element; }}
                  id={`facility-tab-${zone.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selectedZone === index}
                  aria-controls={`facility-panel-${zone.id}`}
                  tabIndex={selectedZone === index ? 0 : -1}
                  onClick={() => selectZone(index)}
                  onKeyDown={(event) => handleZoneKeyDown(event, index)}
                  className={`facility-zone-tab${selectedZone === index ? ' is-active' : ''}`}
                >
                  <span className="facility-zone-number">0{index + 1}</span>
                  <span>{zone.name}</span>
                  <ChevronRight className="facility-zone-chevron" aria-hidden="true" />
                </button>
              ))}
            </div>
            <p className="facility-active-count" aria-live="polite">
              Zone 0{selectedZone + 1} <span>/ 04</span>
            </p>
          </nav>

          <div
            id={`facility-panel-${currentZone.id}`}
            role="tabpanel"
            aria-labelledby={`facility-tab-${currentZone.id}`}
            className="facility-panel"
          >
            <div className="facility-photo-stack" aria-hidden="true">
              {zones.map((zone, index) => (
                <div
                  key={zone.id}
                  className={`facility-photo-placeholder facility-photo-${zone.id}${selectedZone === index ? ' is-active' : ''}`}
                >
                  <span>TODO: Add real photo — {zone.name}</span>
                </div>
              ))}
            </div>
            <div className="facility-panel-caption">
              <span className="facility-panel-kicker">ZONE 0{selectedZone + 1}</span>
              <h3 ref={titleRef}>{currentZone.name}</h3>
              <p ref={descriptionRef}>{currentZone.description}</p>
            </div>
          </div>
        </div>

        <div className="facility-progress" aria-hidden="true">
          <div ref={progressRef} className="facility-progress-fill" />
        </div>
      </div>
    </section>
  );
};
