import React, { useEffect, useRef } from 'react';
import { Heart, Clock, ShieldCheck, Users, Activity, Sparkles, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface NursingCollectiveSectionProps {
  skewStyle: React.CSSProperties;
}

export const NursingCollectiveSection: React.FC<NursingCollectiveSectionProps> = ({ skewStyle }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const careModelRef = useRef<HTMLDivElement | null>(null);
  const artRevealRef = useRef<HTMLDivElement | null>(null);
  const artParallaxRef = useRef<HTMLDivElement | null>(null);
  const artFloatRef = useRef<HTMLDivElement | null>(null);
  const pillarsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const careModel = careModelRef.current;
    const artReveal = artRevealRef.current;
    const artParallax = artParallaxRef.current;
    const artFloat = artFloatRef.current;
    const pillars = pillarsRef.current;
    if (!section || !heading || !careModel || !artReveal || !artParallax || !artFloat || !pillars) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(heading,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
          },
        );

        gsap.fromTo(careModel,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: { trigger: careModel, start: 'top 86%', once: true },
          },
        );

        gsap.fromTo(artReveal,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: { trigger: artReveal, start: 'top 90%', once: true },
          },
        );

        gsap.to(artParallax, {
          y: -16,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.9,
          },
        });

        gsap.to(artFloat, {
          y: -6,
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        gsap.fromTo(pillars.children,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: pillars, start: 'top 86%', once: true },
          },
        );
      });
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="nursing" className="relative py-28 px-4 md:px-8 max-w-7xl mx-auto z-10">
      <div style={skewStyle} className="space-y-16">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-hospital-cyan/20 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-hud text-hospital-teal uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-hospital-teal" />
              <span>03 // THE 24/7 CARE BACKBONE</span>
            </div>
            <h2 ref={headingRef} className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              THE NURSING COLLECTIVE
            </h2>
            <p className="text-hospital-light/80 text-base sm:text-lg font-light mt-2 max-w-2xl">
              Round-the-clock vigilance, warm bedside compassion, and synchronized cardiac telemetry monitoring.
            </p>
          </div>

          <div className="glass-panel px-4 py-2.5 rounded-2xl border border-hospital-teal/30 flex items-center gap-3">
            <Users className="w-5 h-5 text-hospital-teal" />
            <div>
              <span className="text-xs font-mono-hud font-bold text-white block">1:2 NURSE-TO-BED RATIO</span>
              <span className="text-[10px] text-hospital-teal font-mono-hud">Continuous Cardiac Vigil</span>
            </div>
          </div>
        </div>

        {/* Care model */}
        <div ref={careModelRef} className="glass-panel-glow p-8 rounded-3xl border border-hospital-teal/30 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-hospital-teal/15 text-hospital-teal text-xs font-mono-hud">
                <Heart className="w-3.5 h-3.5 fill-hospital-teal" />
                <span>UNCOMPROMISING PATIENT DEDICATION</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                "Doctors Prescribe the Cure; Nurses Deliver the Recovery."
              </h3>
              <p className="text-sm text-hospital-muted leading-relaxed">
                At Bhagat Hospital, Dr. Ramesh Bhagat works in close unison with an expertly trained cardiac nursing collective. Every blood pressure fluctuation, ECG alteration, and patient need is addressed immediately by registered nurses on shift 24 hours a day, 365 days a year.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 font-mono-hud text-xs">
              <div ref={artRevealRef} className="nursing-team-art rounded-2xl overflow-hidden border border-hospital-teal/20 bg-hospital-surface">
                <div ref={artParallaxRef}>
                  <div ref={artFloatRef} className="nursing-team-art-float">
                    <svg className="block w-full h-auto" viewBox="0 0 480 210" role="img" aria-label="Illustration of the nursing team">
                      <defs>
                        <linearGradient id="nursing-scrubs" x1="0" x2="1" y1="0" y2="1">
                          <stop offset="0" stopColor="#e9f4f3" />
                          <stop offset="1" stopColor="#b9ddda" />
                        </linearGradient>
                        <linearGradient id="nursing-background" x1="0" x2="1" y1="0" y2="1">
                          <stop offset="0" stopColor="#eff8f8" />
                          <stop offset="1" stopColor="#dceeed" />
                        </linearGradient>
                      </defs>
                      <rect width="480" height="210" rx="18" fill="url(#nursing-background)" />
                      <circle cx="245" cy="106" r="77" fill="#ffffff" opacity=".58" />
                      <path d="M66 190c4-48 24-72 57-72s53 24 57 72" fill="url(#nursing-scrubs)" stroke="#82b9b5" strokeWidth="3" />
                      <path d="M178 190c4-62 28-94 67-94s63 32 67 94" fill="#d2e8e5" stroke="#6da6a2" strokeWidth="3" />
                      <path d="M300 190c4-48 24-72 57-72s53 24 57 72" fill="url(#nursing-scrubs)" stroke="#82b9b5" strokeWidth="3" />
                      <circle cx="123" cy="82" r="28" fill="#e7c7b1" />
                      <circle cx="245" cy="61" r="32" fill="#e5c4ad" />
                      <circle cx="357" cy="82" r="28" fill="#dcb99f" />
                      <path d="M94 78c3-29 46-40 60-7-17-10-37-11-60 7Zm119-17c5-35 60-38 67 1-17-17-43-18-67-1Zm114 17c5-31 50-37 60-7-19-10-39-10-60 7Z" fill="#355b60" />
                      <path d="M235 103v31m-12-16h24" stroke="#0e7c86" strokeWidth="5" strokeLinecap="round" />
                      <path d="M113 119v34m-9-18h18m231-16v34m-9-18h18" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity=".9" />
                      <path d="M200 135c11 9 23 14 35 14s25-5 36-14" fill="none" stroke="#8ab9b5" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-hospital-surface/80 border border-hospital-teal/20 flex items-center justify-between">
                <span className="text-hospital-muted">Day & Night Shifts</span>
                <span className="text-hospital-teal font-bold">100% COVERAGE</span>
              </div>
              <div className="p-3 rounded-xl bg-hospital-surface/80 border border-hospital-teal/20 flex items-center justify-between">
                <span className="text-hospital-muted">Heart monitoring</span>
                <span className="text-white font-bold">CONTINUOUS</span>
              </div>
              <div className="p-3 rounded-xl bg-hospital-surface/80 border border-hospital-teal/20 flex items-center justify-between">
                <span className="text-hospital-muted">Emergency Response</span>
                <span className="text-hospital-emergency font-bold">&lt; 30 SECONDS</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars of the Nursing Team */}
        <div ref={pillarsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Activity,
              badge: 'TELEMETRY',
              title: 'Continuous Heart Monitoring',
              description: 'Continuous monitoring of ECG waveforms, oxygen saturation (SpO2), and arterial tension with instant alarm protocols directly alerting Dr. Bhagat.'
            },
            {
              icon: Clock,
              badge: '24/7 BEDSIDE',
              title: 'Round-the-Clock Bedside Care',
              description: 'Attentive, compassionate bedside assistance for elderly and cardiac recovery patients, ensuring comfort, hydration, hygiene, and scheduled medical dosing.'
            },
            {
              icon: ShieldCheck,
              badge: 'EMERGENCY',
              title: 'Rapid Emergency Triage',
              description: 'Immediate stabilization protocols for chest pain, sudden breathlessness, or hypertensive emergencies arriving at Ashirwad Plaza at any hour.'
            },
            {
              icon: Sparkles,
              badge: 'RECOVERY',
              title: 'Empathetic Patient Rehabilitation',
              description: 'Guiding patients through dietary protocols, cardiac breathing exercises, gentle mobilization, and family counseling prior to discharge.'
            }
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-hospital-cyan/15 hover:border-hospital-teal/40 transition-all group hover:-translate-y-1"
                data-cursor="CARE"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-hospital-teal/15 border border-hospital-teal/30 flex items-center justify-center text-hospital-teal group-hover:bg-hospital-teal/30 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono-hud text-hospital-teal tracking-widest px-2 py-0.5 rounded bg-hospital-teal/10">
                    {pillar.badge}
                  </span>
                </div>

                <h4 className="text-base font-display font-bold text-white mb-2 group-hover:text-hospital-teal transition-colors">
                  {pillar.title}
                </h4>

                <p className="text-xs text-hospital-muted leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Patient Assurance Quote */}
        <div className="p-4 rounded-2xl bg-hospital-surface/60 border border-hospital-cyan/15 flex items-center gap-4 text-xs font-mono-hud text-hospital-muted">
          <AlertCircle className="w-5 h-5 text-hospital-cyan shrink-0" />
          <span>
            Every member of our nursing collective is certified in Basic Life Support (BLS) and Advanced Cardiac Life Support (ACLS) protocols under Dr. Ramesh Bhagat's mentorship.
          </span>
        </div>
      </div>
    </section>
  );
};
