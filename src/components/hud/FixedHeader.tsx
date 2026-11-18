import React, { useState } from 'react';
import { Activity, Phone, Volume2, VolumeX, Calendar, ShieldCheck, Menu, X } from 'lucide-react';
import { medicalAudio } from './AudioSynthesizer';

interface FixedHeaderProps {
  onOpenBooking: () => void;
  onNavigate: (sectionId: string) => void;
}

export const FixedHeader: React.FC<FixedHeaderProps> = ({ onOpenBooking, onNavigate }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'doctor', label: 'Our Cardiologist' },
    { id: 'nursing', label: 'Nursing Care' },
    { id: 'services', label: 'Services' },
    { id: 'tour', label: 'Our Facility' },
    { id: 'stats', label: 'Patient Reviews' },
    { id: 'location', label: 'Visit Us' }
  ];

  const toggleSound = () => {
    const muted = medicalAudio.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-3 transition-all duration-300"
      onKeyDown={(event) => {
        if (event.key === 'Escape') setIsMobileMenuOpen(false);
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel rounded-2xl px-4 md:px-6 py-3 border border-hospital-border shadow-md">
        {/* Brand & Doctor Credentials */}
        <button
          type="button"
          className="header-brand flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            medicalAudio.playClick();
            onNavigate('hero');
          }}
          data-cursor="HOME"
        >
          <span className="relative w-10 h-10 rounded-xl bg-hospital-surfaceElevated border border-hospital-cyan/40 flex items-center justify-center overflow-hidden shadow-glow-cyan-sm">
            <Activity className="w-5 h-5 text-hospital-cyan animate-pulse" aria-hidden="true" />
            <span className="absolute inset-0 bg-hospital-cyan/10 group-hover:bg-hospital-cyan/25 transition-colors" />
          </span>

          <span className="header-brand-copy">
            <span className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base md:text-lg tracking-wider text-white">
                BHAGAT HOSPITAL
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-sm px-2 py-1 rounded-full bg-hospital-cyan/10 text-hospital-cyan border border-hospital-cyan/30">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Bhuj, Gujarat
              </span>
            </span>
            <span className="block text-sm text-hospital-muted">
              Dr. Ramesh Bhagat <span className="text-hospital-cyan">• Cardiologist</span>
            </span>
          </span>
        </button>

        {/* Center Navigation - Desktop */}
        <nav className="hidden lg:flex items-center gap-6 font-mono-hud text-xs tracking-wider text-hospital-muted">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                medicalAudio.playClick();
                onNavigate(item.id);
              }}
              onMouseEnter={() => medicalAudio.playHover()}
              data-cursor="GOTO"
              className="hover:text-hospital-cyan transition-colors relative py-1 group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-hospital-cyan transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Header actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="mobile-menu-toggle lg:hidden"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-primary-navigation"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          {/* Emergency 24/7 Hotline Badge */}
          <a
            href="tel:+917069232432"
            onClick={() => medicalAudio.playClick()}
            onMouseEnter={() => medicalAudio.playHover()}
            data-cursor="EMERGENCY"
            className="header-emergency flex items-center gap-2 px-3 py-1.5 rounded-xl bg-hospital-emergency/15 border border-hospital-emergency/40 text-hospital-emergency hover:bg-hospital-emergency/25 transition-all text-xs font-mono-hud font-bold shadow-glow-coral group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hospital-emergency opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-hospital-emergency"></span>
            </span>
            <Phone className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
            <span className="hidden md:inline">+91 70692 32432</span>
          </a>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            data-cursor={isMuted ? 'UNMUTE' : 'MUTE'}
            aria-label="Toggle Heartbeat Sound"
            className="header-audio-toggle p-2 rounded-xl bg-hospital-surface border border-hospital-cyan/25 text-hospital-cyan hover:border-hospital-cyan transition-colors"
            title="Toggle Ambient Cardiac Sound"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-hospital-muted" />
            ) : (
              <div className="relative">
                <Volume2 className="w-4 h-4 text-hospital-cyan animate-pulse" />
              </div>
            )}
          </button>

          {/* Book Appointment CTA */}
          <button
            onClick={() => {
              medicalAudio.playClick();
              onOpenBooking();
            }}
            onMouseEnter={() => medicalAudio.playHover()}
            data-cursor="APPOINTMENT"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-hospital-cyan to-hospital-teal text-hospital-bg font-mono-hud text-xs font-bold tracking-wider hover:opacity-95 transition-opacity shadow-glow-cyan"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>BOOK CONSULT</span>
          </button>
        </div>
      </div>
      <nav
        id="mobile-primary-navigation"
        className="mobile-primary-navigation lg:hidden"
        aria-label="Primary"
        hidden={!isMobileMenuOpen}
      >
        {navigationItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              medicalAudio.playClick();
              setIsMobileMenuOpen(false);
              onNavigate(item.id);
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};
