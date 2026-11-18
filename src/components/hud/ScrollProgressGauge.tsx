import React from 'react';

interface ScrollProgressGaugeProps {
  progress: number;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const sectionMap: Record<string, { index: string; label: string }> = {
  hero: { index: '01', label: 'Welcome' },
  doctor: { index: '02', label: 'Cardiologist' },
  nursing: { index: '03', label: 'Nursing Care' },
  services: { index: '04', label: 'Services' },
  tour: { index: '05', label: 'Our Facility' },
  stats: { index: '06', label: 'Patient Reviews' },
  location: { index: '07', label: 'Visit Us' }
};

export const ScrollProgressGauge: React.FC<ScrollProgressGaugeProps> = ({
  progress,
  activeSection,
  onNavigate
}) => {
  const current = sectionMap[activeSection] || sectionMap.hero;

  return (
    <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center gap-6 pointer-events-auto">

      {/* Progress Track */}
      <div className="relative w-1 h-36 bg-hospital-surfaceElevated rounded-full overflow-hidden border border-hospital-cyan/20">
        <div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-hospital-cyan via-hospital-cyanGlow to-hospital-teal rounded-full transition-all duration-150"
          style={{ height: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {/* Section Indicator Ticker */}
      <div className="flex flex-col items-center gap-1.5 font-mono-hud">
        <span className="text-hospital-cyan font-bold text-xs tracking-wider">
          {current.index}
        </span>
        <span className="text-[9px] text-hospital-muted tracking-widest">
          / 07
        </span>
      </div>

      {/* Mini Section Quick Dots */}
      <div className="flex flex-col gap-2">
        {Object.entries(sectionMap).map(([id, item]) => {
          const isActive = id === activeSection;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              data-cursor={item.label}
              aria-label={`Jump to ${item.label}`}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-hospital-cyan scale-150 shadow-glow-cyan-sm'
                  : 'bg-hospital-muted/30 hover:bg-hospital-cyan/60'
              }`}
            />
          );
        })}
      </div>
    </aside>
  );
};
