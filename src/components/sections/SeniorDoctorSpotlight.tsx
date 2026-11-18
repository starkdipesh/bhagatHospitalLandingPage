import React, { useEffect, useRef, useState } from 'react';
import { Award, CheckCircle2, Stethoscope, Star, Calendar, Phone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { medicalAudio } from '../hud/AudioSynthesizer';

gsap.registerPlugin(ScrollTrigger);

interface SeniorDoctorSpotlightProps {
  onOpenBooking: () => void;
  skewStyle: React.CSSProperties;
}

export const SeniorDoctorSpotlight: React.FC<SeniorDoctorSpotlightProps> = ({
  onOpenBooking,
  skewStyle
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const portraitVisualRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const portrait = portraitRef.current;
    const portraitVisual = portraitVisualRef.current;
    const stats = statsRef.current;
    if (!section || !heading || !portrait || !portraitVisual || !stats) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(heading,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
          },
        );

        gsap.fromTo(portrait,
          { y: 28, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: { trigger: portrait, start: 'top 82%', once: true },
          },
        );

        gsap.to(portraitVisual, {
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });

        const counters = gsap.utils.toArray<HTMLElement>('[data-count-up]', stats);
        counters.forEach((element) => {
          const target = Number(element.dataset.countUp);
          const suffix = element.dataset.countSuffix ?? '';
          const counter = { value: 0 };
          element.textContent = `0${suffix}`;

          gsap.to(counter, {
            value: target,
            duration: 1.6,
            ease: 'power1.out',
            onUpdate: () => {
              element.textContent = `${Math.round(counter.value)}${suffix}`;
            },
            scrollTrigger: {
              trigger: stats,
              start: 'top 86%',
              once: true,
            },
          });
        });
      });
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setCardTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  return (
    <section ref={sectionRef} id="doctor" className="relative py-28 px-4 md:px-8 max-w-7xl mx-auto z-10">
      <div style={skewStyle} className="space-y-16">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-hospital-cyan/20 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-hud text-hospital-cyan uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-hospital-cyan" />
              <span>02 // THE CHIEF MEDICAL PILLAR</span>
            </div>
            <h2 ref={headingRef} className="doctor-heading text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              DR. RAMESH BHAGAT
            </h2>
            <p className="text-hospital-cyan text-base sm:text-lg font-mono-hud mt-1">
              Senior Consultant Cardiologist & Chief Physician
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Lybrate Verified Badge */}
            <div className="glass-panel px-3 py-2 rounded-xl border border-hospital-cyan/30 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <div>
                <span className="text-[11px] font-mono-hud font-bold text-white block">LYBRATE VERIFIED</span>
                <span className="text-[10px] text-hospital-muted font-mono-hud">4.9 / 5.0 (500+ Reviews)</span>
              </div>
            </div>

            {/* Meddco Verified Badge */}
            <div className="glass-panel px-3 py-2 rounded-xl border border-hospital-cyan/30 flex items-center gap-2">
              <Award className="w-4 h-4 text-hospital-teal" />
              <div>
                <span className="text-[11px] font-mono-hud font-bold text-white block">MEDDCO CERTIFIED</span>
                <span className="text-[10px] text-hospital-muted font-mono-hud">Top Cardiologist Bhuj</span>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Grid: 3D Holographic Card + Detailed Medical Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* 3D Depth Card Column */}
          <div
            ref={portraitRef}
            className="lg:col-span-5 perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="glass-panel-glow rounded-3xl p-8 border border-hospital-cyan/40 relative overflow-hidden transition-transform duration-200 ease-out shadow-2xl"
              style={{
                transform: `rotateX(${cardTilt.y}deg) rotateY(${cardTilt.x}deg)`,
                transformStyle: 'preserve-3d'
              }}
              data-cursor="DR. BHAGAT"
            >
              {/* Decorative scanline glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-hospital-cyan/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-hospital-teal/15 rounded-full blur-2xl pointer-events-none" />

              {/* Doctor Avatar / Visual representation */}
              <div
                ref={portraitVisualRef}
                className="doctor-portrait relative w-full aspect-[4/5] rounded-2xl bg-gradient-to-b from-hospital-surfaceElevated to-hospital-surface border border-hospital-cyan/30 overflow-hidden flex flex-col items-center justify-center p-6 text-center group"
              >
                {/* TODO: Replace this illustration with an approved photograph of Dr. Bhagat. */}
                <div className="doctor-portrait-art absolute inset-0 flex items-center justify-center" aria-hidden="true">
                  <div className="doctor-portrait-orbit absolute w-[72%] aspect-square rounded-full border border-hospital-cyan/15" />
                  <div className="doctor-portrait-orbit doctor-portrait-orbit-secondary absolute w-[88%] aspect-square rounded-full border border-hospital-teal/10" />
                  <div className="doctor-portrait-silhouette relative w-[44%] aspect-[0.76] rounded-t-[48%] bg-gradient-to-b from-hospital-cyan/35 via-hospital-teal/25 to-hospital-navy/20">
                    <div className="doctor-portrait-head absolute w-[54%] aspect-square rounded-full left-1/2 -translate-x-1/2 -top-[28%] bg-gradient-to-br from-hospital-surface to-hospital-cyan/35 border border-hospital-cyan/25" />
                    <div className="absolute inset-x-[18%] top-[35%] bottom-[10%] flex items-center justify-center">
                      <Stethoscope className="w-12 h-12 sm:w-16 sm:h-16 text-hospital-cyan/80" />
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-auto w-full rounded-xl bg-hospital-surface/90 border border-hospital-border px-4 py-3 shadow-sm">
                  <p className="text-sm font-semibold text-hospital-muted">Doctor portrait coming soon</p>
                  <h3 className="text-2xl font-display font-extrabold text-white tracking-wide mt-1">
                  Dr. Ramesh Bhagat
                  </h3>
                  <p className="text-base text-hospital-cyan mt-1">
                  M.D. (Medicine) • Senior Interventional & Non-Invasive Cardiologist
                  </p>
                  <p className="text-sm text-hospital-muted mt-2">
                    {/* TODO: Replace with the verified Gujarat Medical Council registration number. */}
                    Gujarat Medical Council registration: <strong>TODO: verify number</strong>
                  </p>
                </div>

                {/* Status Bar */}
                <div className="relative z-10 mt-3 px-3 py-1 rounded-full bg-hospital-teal/15 border border-hospital-teal/40 text-hospital-teal text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-hospital-teal animate-ping" />
                  ACCEPTING CONSULTATIONS IN BHUJ
                </div>
              </div>

              {/* Direct consultation action within card */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={() => {
                    medicalAudio.playClick();
                    onOpenBooking();
                  }}
                  onMouseEnter={() => medicalAudio.playHover()}
                  data-cursor="CONSULT"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-hospital-cyan to-hospital-teal text-hospital-bg font-mono-hud font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-glow-cyan"
                >
                  <Calendar className="w-4 h-4" />
                  <span>BOOK 1-ON-1 APPOINTMENT</span>
                </button>

                <a
                  href="tel:+917069232432"
                  onClick={() => medicalAudio.playClick()}
                  data-cursor="CALL"
                  className="w-full py-2.5 rounded-xl border border-hospital-cyan/30 text-hospital-cyan font-mono-hud text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-hospital-cyan/10 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>DIRECT CLINIC: +91 70692 32432</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: In-depth Biography & Medical Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-md bg-hospital-cyan/10 border border-hospital-cyan/30 text-hospital-cyan text-xs font-mono-hud">
                Trusted Heart Care in Kutch
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Personalized Senior Medical Oversight from Admission to Complete Recovery.
              </h3>

              <blockquote className="border-l-2 border-hospital-cyan pl-4 py-1 italic text-hospital-light/80 text-base leading-relaxed bg-hospital-surface/40 rounded-r-xl">
                "In large fragmented hospitals, patients often see different rotating doctors every morning. At Bhagat Hospital, every cardiac assessment, diagnostic test, and treatment plan is personally evaluated and guided by me, supported by our round-the-clock trained nursing team."
                <footer className="text-xs font-mono-hud text-hospital-cyan mt-2 not-italic font-bold">
                  — Dr. Ramesh Bhagat, Founder & Senior Cardiologist
                </footer>
              </blockquote>

              <p className="text-sm text-hospital-muted leading-relaxed">
                With extensive clinical experience serving the residents of Bhuj, Mundra, Anjar, and the broader Kutch region, Dr. Bhagat specializes in preventive cardiology, management of complex hypertension, post-infarction care, echocardiography, and immediate cardiac emergency resuscitation.
              </p>
            </div>

            {/* Core Competencies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { title: 'Comprehensive Echocardiography', desc: 'Precision color Doppler and 2D Echo cardiac imaging' },
                { title: 'Treadmill Stress Testing', desc: 'Heart response assessment during guided exercise' },
                { title: 'Hypertension & Lipid Mastery', desc: 'Long-term arterial wellness and stroke risk prevention' },
                { title: 'Emergency Cardiac Care', desc: 'Immediate acute coronary syndrome and rhythm stabilization' }
              ].map((item, idx) => (
                <div key={idx} className="glass-panel p-4 rounded-xl border border-hospital-cyan/20 space-y-1 hover:border-hospital-cyan/40 transition-colors">
                  <div className="flex items-center gap-2 text-hospital-cyan font-mono-hud text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-[11px] text-hospital-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Career Metrics Banner */}
            <div ref={statsRef} className="grid grid-cols-3 gap-3 pt-4 border-t border-hospital-cyan/15 text-center">
              <div className="p-3 rounded-xl bg-hospital-surface/70 border border-hospital-cyan/15">
                <span data-count-up="25" data-count-suffix="+" className="text-2xl sm:text-3xl font-display font-extrabold text-hospital-cyan block">25+</span>
                <span className="text-[10px] font-mono-hud text-hospital-muted uppercase">Years Experience</span>
              </div>
              <div className="p-3 rounded-xl bg-hospital-surface/70 border border-hospital-cyan/15">
                <span data-count-up="25" data-count-suffix="k+" className="text-2xl sm:text-3xl font-display font-extrabold text-white block">25k+</span>
                <span className="text-[10px] font-mono-hud text-hospital-muted uppercase">Patients Treated</span>
              </div>
              <div className="p-3 rounded-xl bg-hospital-surface/70 border border-hospital-cyan/15">
                <span data-count-up="100" data-count-suffix="%" className="text-2xl sm:text-3xl font-display font-extrabold text-hospital-teal block">100%</span>
                <span className="text-[10px] font-mono-hud text-hospital-muted uppercase">Senior Dedication</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
