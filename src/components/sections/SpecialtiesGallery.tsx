import React, { useEffect, useRef, useState } from 'react';
import { Heart, Activity, Stethoscope, Radio, ShieldAlert, Sparkles, ArrowRight, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { medicalAudio } from '../hud/AudioSynthesizer';

gsap.registerPlugin(ScrollTrigger);

interface SpecialtiesGalleryProps {
  onOpenBooking: () => void;
}

export const SpecialtiesGallery: React.FC<SpecialtiesGalleryProps> = ({
  onOpenBooking
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const trackViewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const services = [
    {
      id: 'echo',
      icon: Activity,
      title: '2D Echocardiography & Color Doppler',
      tag: 'NON-INVASIVE CARDIOLOGY',
      description: 'High-resolution ultrasonic imaging of heart chambers, valves, ejection fraction, and hemodynamic blood flow directed personally by Dr. Ramesh Bhagat.',
      metrics: 'Over 15,000+ Echo scans performed',
      features: [
        'Valvular heart disease profiling',
        'Heart pumping function',
        'Congenital anomaly detection',
        'Instant clinical report counseling'
      ]
    },
    {
      id: 'tmt',
      icon: Heart,
      title: 'Treadmill Stress Testing',
      tag: 'ISCHEMIA EVALUATION',
      description: 'Computerized stress test evaluating heart performance under graduated physical exertion to diagnose silent coronary artery blockage.',
      metrics: 'Advanced computerized Bruce protocol',
      features: [
        'Continuous 12-lead ECG telemetry',
        'Real-time heart stress analysis',
        'Exercise capacity & endurance score',
        'Direct supervision of nursing staff'
      ]
    },
    {
      id: 'icu',
      icon: ShieldAlert,
      title: '24/7 Cardiac Emergency & Acute ICU',
      tag: 'CRITICAL CARE UNIT',
      description: 'Fully equipped intensive cardiac monitoring beds for acute myocardial infarction, unstable angina, severe arrhythmia, and acute heart failure stabilization.',
      metrics: 'Rapid 15-minute emergency triage',
      features: [
        'Multi-parameter bedside cardiac monitors',
        'Biphasic defibrillators & crash carts',
        'Continuous central oxygen & suction',
        'Immediate doctor & nursing response'
      ]
    },
    {
      id: 'holter',
      icon: Radio,
      title: 'Portable Heart and Blood Pressure Monitoring',
      tag: 'AMBULATORY TELEMETRY',
      description: 'Wearable digital telemetry units for ambulatory recording of heart rhythms and blood pressure fluctuations during normal daily activities and sleep.',
      metrics: 'Detailed 100,000+ beat analytical report',
      features: [
        'Paroxysmal arrhythmia diagnosis',
        'Nocturnal hypertension mapping',
        'Syncope (fainting) cause identification',
        'Comfortable lightweight recorder'
      ]
    },
    {
      id: 'preventive',
      icon: Sparkles,
      title: 'Preventive Cardiology & Diabetic Heart Clinic',
      tag: 'LIFESTYLE & LONGEVITY',
      description: 'Holistic clinical management targeting atherosclerosis reversal, diabetic cardiovascular protection, dyslipidemia correction, and arterial longevity.',
      metrics: 'Comprehensive cardiac wellness packages',
      features: [
        'Cardiovascular risk stratification',
        'Cholesterol and long-term heart risk review',
        'Dietary & lifestyle restructuring',
        'Family cardiac screening'
      ]
    },
    {
      id: 'pathology',
      icon: Stethoscope,
      title: 'Diagnostic Pathology & Cardiac Enzymes',
      tag: 'LABORATORY EXCELLENCE',
      description: 'On-site testing for heart enzymes, cholesterol, diabetes markers, kidney health, and blood clotting.',
      metrics: 'Express results for critical markers',
      features: [
        'Heart damage markers',
        'Complete metabolic & lipid panels',
        'Long-term blood sugar marker',
        'Barcoded calibrated analyzer precision'
      ]
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const description = descriptionRef.current;
    const viewport = trackViewportRef.current;
    const track = trackRef.current;
    const progressBar = progressRef.current;
    if (!section || !heading || !description || !viewport || !track || !progressBar) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo([heading, description],
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
          },
        );
      });

      media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('.service-card', track);
        const copy = cards.flatMap((card) =>
          Array.from(card.querySelectorAll<HTMLElement>('.service-card-title, .service-card-description')),
        );
        gsap.set(copy, { y: 18, opacity: 0.85 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.max(1, track.scrollWidth - viewport.clientWidth)}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              progressBar.parentElement?.setAttribute('aria-valuenow', String(Math.round(self.progress * 100)));
              window.dispatchEvent(new CustomEvent<{ progress: number; active: boolean }>(
                'bhagat:services-progress',
                { detail: { progress: self.progress, active: self.isActive } },
              ));
            },
            onToggle: (self) => {
              window.dispatchEvent(new CustomEvent<{ progress: number; active: boolean }>(
                'bhagat:services-progress',
                { detail: { progress: self.progress, active: self.isActive } },
              ));
            },
          },
        });

        timeline
          .to(track, {
            x: () => -(track.scrollWidth - viewport.clientWidth),
            ease: 'none',
            duration: 1,
          }, 0)
          .fromTo(progressBar,
            { scaleX: 0 },
            { scaleX: 1, ease: 'none', duration: 1 },
            0,
          );

        const revealStart = 0.04;
        const revealRange = 0.78;
        cards.forEach((card, index) => {
          const title = card.querySelector<HTMLElement>('.service-card-title');
          const cardDescription = card.querySelector<HTMLElement>('.service-card-description');
          if (!title || !cardDescription) return;

          const position = revealStart + (index / Math.max(cards.length - 1, 1)) * revealRange;
          timeline.to(title, { y: 0, opacity: 1, duration: 0.08, ease: 'none' }, position);
          timeline.to(cardDescription, { y: 0, opacity: 1, duration: 0.1, ease: 'none' }, position + 0.025);
        });

        return () => {
          window.dispatchEvent(new CustomEvent<{ progress: number; active: boolean }>(
            'bhagat:services-progress',
            { detail: { progress: 0, active: false } },
          ));
          progressBar.parentElement?.setAttribute('aria-valuenow', '0');
        };
      });
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  const selectService = (index: number) => {
    medicalAudio.playClick();
    setActiveTab(index);
  };

  return (
    <section ref={sectionRef} id="services" className="services-section relative py-28 px-4 md:px-8 max-w-7xl mx-auto z-10">
      <div className="services-content space-y-16">
        {/* Section header */}
        <div className="services-heading flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-hospital-cyan/20 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-hud text-hospital-cyan uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-hospital-cyan" />
              <span>04 // CLINICAL SPECIALTIES & DIAGNOSTICS</span>
            </div>
            <h2 ref={headingRef} className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              ADVANCED CARDIOLOGY SERVICES
            </h2>
            <p ref={descriptionRef} className="text-hospital-light/80 text-base sm:text-lg font-light mt-2 max-w-2xl">
              Precision non-invasive diagnostic modalities and acute cardiac stabilization right here in Bhuj.
            </p>
          </div>

          <button
            onClick={() => {
              medicalAudio.playClick();
              onOpenBooking();
            }}
            data-cursor="TESTS"
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-hospital-surfaceElevated border border-hospital-cyan/30 text-hospital-cyan font-mono-hud text-xs tracking-wider flex items-center gap-2 hover:bg-hospital-cyan/15 transition-colors"
          >
            <span>BOOK A DIAGNOSTIC SCAN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="services-rail">
          <div ref={trackViewportRef} className="services-viewport">
            <div ref={trackRef} className="services-track">
              {services.map((service, index) => {
            const Icon = service.icon;
            const isSelected = activeTab === index;

            return (
              <div
                key={service.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => selectService(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    selectService(index);
                  }
                }}
                onMouseEnter={() => medicalAudio.playHover()}
                data-cursor="EXPLORE"
                className={`service-card glass-panel p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                  isSelected
                    ? 'border-hospital-cyan bg-hospital-surfaceElevated/95 shadow-glow-cyan'
                    : 'border-hospital-cyan/20 hover:border-hospital-cyan/40 hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-hospital-surface border border-hospital-cyan/30 flex items-center justify-center text-hospital-cyan group-hover:scale-110 transition-transform shadow-glow-cyan-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono-hud text-hospital-cyan tracking-wider px-2.5 py-1 rounded-full bg-hospital-cyan/10 border border-hospital-cyan/25">
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="service-card-title text-lg font-display font-bold text-white mb-2 group-hover:text-hospital-cyan transition-colors">
                    {service.title}
                  </h3>

                  <p className="service-card-description text-xs text-hospital-muted leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-hospital-cyan/15">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-[11px] text-hospital-light/85 font-mono-hud">
                        <Check className="w-3 h-3 text-hospital-teal shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-hospital-cyan/10 flex items-center justify-between text-[11px] font-mono-hud">
                  <span className="text-hospital-muted">{service.metrics}</span>
                  <span className="text-hospital-cyan flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    SCHEDULE <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
              })}
            </div>
          </div>
          <div
            className="services-progress-track"
            role="progressbar"
            aria-label="Service cards scroll progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
          >
            <div ref={progressRef} className="services-progress-fill" />
          </div>
        </div>
      </div>
    </section>
  );
};
