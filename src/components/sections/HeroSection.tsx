import React, { useEffect, useRef } from 'react';
import { Activity, ArrowUpRight, Phone, ShieldCheck, Heart, Clock, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { medicalAudio } from '../hud/AudioSynthesizer';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onNavigate
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const ecgPathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const path = ecgPathRef.current;
    if (!section || !path) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const pathLength = path.getTotalLength();
        const titleLines = gsap.utils.toArray<HTMLElement>('.hero-title-mask span', section);
        const supporting = gsap.utils.toArray<HTMLElement>('.hero-support', section);
        const glow = section.querySelector<HTMLElement>('.hero-teal-glow');
        const title = section.querySelector<HTMLElement>('.hero-title');

        gsap.set(titleLines, { yPercent: 110 });
        path.style.strokeDasharray = `${pathLength}`;
        path.style.strokeDashoffset = `${pathLength}`;

        const entrance = gsap.timeline({ delay: 0.12 });
        entrance
          .to(titleLines, {
            yPercent: 0,
            duration: 0.72,
            stagger: 0.12,
            ease: 'power3.out',
          }, 0)
          .fromTo(supporting,
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, stagger: 0.055, ease: 'power2.out' },
            0.12,
          );

        let timeline: gsap.core.Timeline;
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${window.innerHeight * 3}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          onUpdate: () => {
            window.dispatchEvent(new CustomEvent<number>('bhagat:hero-progress', {
              detail: timeline.progress(),
            }));
          },
        });

        timeline
          .fromTo(path,
            { strokeDashoffset: pathLength },
            { strokeDashoffset: 0, duration: 0.62, ease: 'none' },
            0.08,
          );

        if (glow) {
          timeline.fromTo(glow,
            { scale: 0.72, opacity: 0.12 },
            { scale: 1.45, opacity: 0.36, duration: 0.72, ease: 'none' },
            0,
          );
        }

        if (title) {
          timeline.to(title, {
            scale: 0.68,
            opacity: 0,
            duration: 0.3,
            ease: 'none',
          }, 0.2);
        }

        timeline.to(supporting, {
          y: -14,
          opacity: 0,
          duration: 0.2,
          stagger: 0.018,
          ease: 'none',
        }, 0.28);

        return () => {
          path.style.removeProperty('stroke-dasharray');
          path.style.removeProperty('stroke-dashoffset');
          window.dispatchEvent(new CustomEvent<number>('bhagat:hero-progress', { detail: 0 }));
        };
      });
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero-section relative min-h-screen flex items-center pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto z-10"
    >
      <div className="hero-teal-glow" aria-hidden="true" />
      <div className="hero-content w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Kinetic Typography & Actions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Top Medical Badge */}
          <div className="hero-support inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-hospital-surfaceElevated/90 border border-hospital-cyan/30 text-hospital-cyan text-xs font-mono-hud backdrop-blur-md shadow-glow-cyan-sm">
            <span className="w-2 h-2 rounded-full bg-hospital-cyan animate-ping" />
            <span>Trusted cardiac care in Bhuj, Gujarat</span>
          </div>

          {/* Main title */}
          <div className="space-y-2">
            <h1 className="hero-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight leading-[1.05] text-white">
              <span className="hero-title-mask"><span className="hero-title-line">BHAGAT</span></span>
              <span className="hero-title-mask">
                <span className="hero-title-line text-transparent bg-clip-text bg-gradient-to-r from-hospital-cyan via-hospital-cyanGlow to-hospital-teal">
                  HOSPITAL.
                </span>
              </span>
            </h1>
            <p className="hero-support text-lg sm:text-xl md:text-2xl font-light text-hospital-light/90 max-w-2xl leading-relaxed pt-2">
              Where Senior Cardiology Mastery Meets a Dedicated 24/7 Nursing Collective.
            </p>
          </div>

          {/* Doctor & Location Highlights */}
          <div className="hero-support flex flex-wrap items-center gap-4 text-xs font-mono-hud text-hospital-muted pt-1">
            <div className="flex items-center gap-2 bg-hospital-surface/60 border border-hospital-cyan/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <Heart className="w-3.5 h-3.5 text-hospital-emergency animate-pulse" />
              <span>Cardiologist: <strong className="text-hospital-navy">Dr. Ramesh Bhagat</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-hospital-surface/60 border border-hospital-cyan/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 text-hospital-cyan" />
              <span>ASHIRWAD PLAZA, MUNDRA-BHUJ RD</span>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              className="hero-support px-6 py-3.5 rounded-xl bg-gradient-to-r from-hospital-cyan via-hospital-cyanGlow to-hospital-teal text-hospital-bg font-mono-hud font-bold text-sm tracking-wider flex items-center gap-3 hover:shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
              onClick={() => {
                medicalAudio.playClick();
                onOpenBooking();
              }}
              onMouseEnter={() => medicalAudio.playHover()}
              data-cursor="PRIORITY"
            >
              <span>SCHEDULE CONSULTATION</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              className="hero-support px-6 py-3.5 rounded-xl bg-hospital-surfaceElevated border border-hospital-emergency/40 text-hospital-emergency font-mono-hud font-bold text-sm tracking-wider flex items-center gap-3 hover:bg-hospital-emergency/15 transition-all shadow-glow-coral transform hover:-translate-y-0.5"
              href="tel:+917069232432"
              onClick={() => medicalAudio.playClick()}
              onMouseEnter={() => medicalAudio.playHover()}
              data-cursor="CALL"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span>+91 70692 32432 (24/7)</span>
            </a>

            <button
              className="hero-support px-4 py-3.5 rounded-xl border border-hospital-cyan/25 text-hospital-light/80 font-mono-hud text-xs tracking-wider hover:text-hospital-cyan hover:border-hospital-cyan transition-colors"
              onClick={() => {
                medicalAudio.playClick();
                onNavigate('doctor');
              }}
              onMouseEnter={() => medicalAudio.playHover()}
              data-cursor="DOCTOR"
            >
              MEET DR. BHAGAT
            </button>
          </div>

          {/* Live care status */}
          <div className="hero-support grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-hospital-cyan/15 max-w-2xl">
            <div className="glass-panel p-3 rounded-xl border border-hospital-cyan/15">
              <span className="text-sm text-hospital-muted block">Cardiology Care</span>
              <span className="text-sm font-bold text-hospital-cyan font-mono-hud">NON-INVASIVE & ICU</span>
            </div>
            <div className="glass-panel p-3 rounded-xl border border-hospital-cyan/15">
              <span className="text-sm text-hospital-muted block">Personal Attention</span>
              <span className="text-sm font-bold text-white font-mono-hud">1-ON-1 NURSING</span>
            </div>
            <div className="glass-panel p-3 rounded-xl border border-hospital-cyan/15">
              <span className="text-sm text-hospital-muted block">Emergency Readiness</span>
              <span className="text-sm font-bold text-hospital-teal font-mono-hud">24/7 IMMEDIATE</span>
            </div>
            <div className="glass-panel p-3 rounded-xl border border-hospital-cyan/15">
              <span className="text-sm text-hospital-muted block">Patient Rating</span>
              <span className="text-sm font-bold text-white font-mono-hud">4.9★ LYBRATE/MEDDCO</span>
            </div>
          </div>
        </div>

        {/* Cardiac care summary */}
        <div className="hero-support lg:col-span-4 flex flex-col gap-4">
          <div className="glass-panel-glow p-6 rounded-3xl border border-hospital-cyan/30 relative overflow-hidden group">
            {/* Corner Decorative Medical Cross */}
            <div className="absolute top-4 right-4 text-hospital-cyan/30 font-mono-hud text-xs">
              + 01_TELEMETRY
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-hospital-cyan/20 border border-hospital-cyan/40 flex items-center justify-center text-hospital-cyan">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-mono-hud font-bold text-white tracking-wide">
                  Cardiac care monitor
                </h3>
                <p className="text-[10px] font-mono-hud text-hospital-cyan">
                  Live heart simulation
                </p>
              </div>
            </div>

            {/* Simulated ECG display */}
            <div className="h-20 w-full bg-hospital-surface/80 rounded-xl border border-hospital-cyan/20 relative overflow-hidden flex items-center px-4 my-2">
              <div className="absolute inset-0 bg-radial-gradient opacity-20 pointer-events-none" />
              {/* ECG Wave SVG animation */}
              <svg className="w-full h-12 text-hospital-cyan overflow-visible" viewBox="0 0 300 60" fill="none">
                <path
                  ref={ecgPathRef}
                  d="M0 30 H60 L70 10 L80 50 L90 20 L100 40 L110 30 H170 L180 8 L190 52 L200 18 L210 38 L220 30 H300"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-85"
                />
              </svg>
            </div>

            <div className="space-y-2 pt-2 text-xs font-mono-hud">
              <div className="flex justify-between items-center text-hospital-muted">
                <span>Heart rhythm</span>
                <span className="text-hospital-teal font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-hospital-teal animate-ping" />
                  Regular rhythm
                </span>
              </div>
              <div className="flex justify-between items-center text-hospital-muted">
                <span>Clinical lead</span>
                <span className="text-white font-medium">Dr. Ramesh Bhagat</span>
              </div>
              <div className="flex justify-between items-center text-hospital-muted">
                <span>Dedicated nursing</span>
                <span className="text-hospital-cyan font-bold">                1 nurse for 2 beds</span>
              </div>
              <div className="flex justify-between items-center text-hospital-muted">
                <span>Emergency care</span>
                <span className="text-hospital-emergency font-bold">                Available now</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-hospital-cyan/15 flex items-center justify-between text-[11px] font-mono-hud text-hospital-muted">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-hospital-cyan" /> 24/7 OPEN
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-hospital-teal" /> Quality standards
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
