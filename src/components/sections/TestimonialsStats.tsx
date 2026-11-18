import React, { useEffect, useRef } from 'react';
import { Star, ShieldCheck, Heart, Quote, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Testimonial } from '../../types';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialsStatsProps {
  skewStyle: React.CSSProperties;
}

const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Jayesh Patel',
    location: 'Bhuj, Gujarat',
    condition: 'Acute Chest Pain & Hypertension',
    comment: 'When my father experienced sudden breathlessness and chest heaviness, we rushed him to Bhagat Hospital at Ashirwad Plaza. Dr. Ramesh Bhagat personally handled his ECG and stabilization within minutes. The nursing staff watched him all night with exceptional care. Truly blessed to have this hospital in Bhuj.',
    source: 'Lybrate',
    rating: 5,
    date: 'Verified Patient'
  },
  {
    id: 't2',
    name: 'Meena Ben Vora',
    location: 'Mundra, Kutch',
    condition: 'Echocardiography & Preventative Heart Care',
    comment: 'Dr. Bhagat does not rush through consultations. He explained my 2D Echo results in simple Gujarati, guided my diet, and adjusted my heart medication carefully. The nurses are polite, gentle, and always smiling. Best cardiologist in Kutch district.',
    source: 'Meddco',
    rating: 5,
    date: 'Verified Patient'
  },
  {
    id: 't3',
    name: 'Kishore G. Thakkar',
    location: 'Anjar - Bhuj',
    condition: 'Treadmill testing and heart recovery follow-up',
    comment: 'The single-doctor personal touch makes a huge difference. You know you are in the hands of the most experienced cardiologist in Bhuj, and the sisters in the nursing team are vigilant about every dose and blood pressure check.',
    source: 'Google',
    rating: 5,
    date: 'Verified Patient'
  }
];

export const TestimonialsStats: React.FC<TestimonialsStatsProps> = ({ skewStyle }) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('.review-reveal', section);
        gsap.fromTo(cards,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.14,
            ease: 'power2.out',
            scrollTrigger: { trigger: cards[0], start: 'top 88%', once: true },
          },
        );
      });
    }, section);
    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  const handleReviewTilt = (event: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 1024) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
  };

  return (
    <section ref={sectionRef} id="stats" className="relative py-28 px-4 md:px-8 max-w-7xl mx-auto z-10">
      <div style={skewStyle} className="space-y-16">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-hospital-cyan/20 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-hud text-hospital-cyan uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-hospital-cyan" />
              <span>06 // VERIFIED PATIENT RECOVERY & TRUST</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              PROVEN PATIENT OUTCOMES
            </h2>
            <p className="text-hospital-light/80 text-base sm:text-lg font-light mt-2 max-w-2xl">
              Authentic feedback and recovery stories from patients across Bhuj and the Kutch region.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-hud text-hospital-muted">
            <ShieldCheck className="w-4 h-4 text-hospital-teal" />
            <span>SOURCES: LYBRATE • MEDDCO • GOOGLE</span>
          </div>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { metric: '25,000+', label: 'Cardiac Consultations', detail: 'Serving Kutch community for 25+ yrs' },
            { metric: '24 / 7', label: 'Continuous Nursing', detail: 'Round-the-clock telemetry coverage' },
            { metric: '4.9 ★', label: 'Patient Satisfaction', detail: 'Top rated on Lybrate & Meddco' },
            { metric: '< 15 Min', label: 'Emergency Triage', detail: 'Immediate acute cardiac protocol' }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-3xl border border-hospital-cyan/20 space-y-2 hover:border-hospital-cyan/50 transition-colors"
            >
              <span className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-hospital-cyan">
                {stat.metric}
              </span>
              <h4 className="text-sm font-display font-bold text-white">
                {stat.label}
              </h4>
              <p className="text-[11px] font-mono-hud text-hospital-muted">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Patient testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div className="review-reveal" key={t.id}>
              <article
                className="review-card glass-panel-glow p-6 rounded-3xl border border-hospital-cyan/25 flex flex-col justify-between space-y-4 group"
                data-cursor="FEEDBACK"
                onMouseMove={handleReviewTilt}
                onMouseLeave={(event) => { event.currentTarget.style.transform = ''; }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1" role="img" aria-label={`${t.rating} out of 5 stars`}>
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-hospital-cyan fill-current" aria-hidden="true" />
                      ))}
                    </div>

                    <span className="text-sm font-mono-hud px-2 py-0.5 rounded-full bg-hospital-cyan/10 text-hospital-cyan border border-hospital-cyan/20">
                      {t.source}
                    </span>
                  </div>

                  <Quote className="w-6 h-6 text-hospital-cyan/40 group-hover:text-hospital-cyan transition-colors" aria-hidden="true" />

                  <p className="text-base text-hospital-light/90 leading-relaxed italic">
                    “{t.comment}”
                  </p>
                </div>

                <div className="pt-4 border-t border-hospital-cyan/15 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-display font-bold text-white">{t.name}</h3>
                    <span className="text-sm font-mono-hud text-hospital-teal">{t.date}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-sm font-mono-hud text-hospital-muted">
                    <span>{t.location}</span>
                    <span className="text-hospital-cyan">{t.condition}</span>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* Directory Links Footer Callout */}
        <div className="p-4 rounded-2xl bg-hospital-surface/80 border border-hospital-cyan/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono-hud text-xs">
          <div className="flex items-center gap-2 text-hospital-muted">
            <Heart className="w-4 h-4 text-hospital-cyan" />
            <span>Read more reviews and feedback on independent platforms:</span>
          </div>
          <div className="flex items-center gap-4 text-hospital-cyan">
            <a
              href="https://search.brave.com/search?q=bhagat+hospital%2C+bhuj"
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              <span>LYBRATE PROFILE</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <span className="text-hospital-muted">•</span>
            <a
              href="https://search.brave.com/search?q=bhagat+hospital%2C+bhuj"
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              <span>MEDDCO DIRECTORY</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
