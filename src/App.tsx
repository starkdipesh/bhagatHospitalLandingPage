import React, { useEffect, useState } from 'react';
import { useMomentumScroll } from './animation/useMomentumScroll';
import { useVelocitySkew } from './animation/useVelocitySkew';
import { BackgroundCanvas } from './webgl/BackgroundCanvas';
import { CustomCursor } from './components/hud/CustomCursor';
import { FixedHeader } from './components/hud/FixedHeader';
import { ScrollProgressGauge } from './components/hud/ScrollProgressGauge';
import { HeroSection } from './components/sections/HeroSection';
import { SeniorDoctorSpotlight } from './components/sections/SeniorDoctorSpotlight';
import { NursingCollectiveSection } from './components/sections/NursingCollectiveSection';
import { SpecialtiesGallery } from './components/sections/SpecialtiesGallery';
import { VirtualTour3D } from './components/sections/VirtualTour3D';
import { TestimonialsStats } from './components/sections/TestimonialsStats';
import { LocationFooterHUD } from './components/sections/LocationFooterHUD';
import { AppointmentModal } from './components/sections/AppointmentModal';
import { ContactActions } from './components/sections/ContactActions';
import { setupCareChoreography, setupSectionReveals } from './animation/scrollFoundation';
import { SeoMetadata } from './components/SeoMetadata';
import { LegalPage } from './pages/LegalPages';
import { legalPages } from './pages/legalContent';
import { getAppPath, normalizeAppPath } from './utils/sitePaths';

const HospitalWebsite: React.FC = () => {
  const { velocity, progress, activeSection, scrollTo } = useMomentumScroll();
  const { style: skewStyle } = useVelocitySkew(velocity);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const cleanupReveals = setupSectionReveals(document);
    const cleanupCareChoreography = setupCareChoreography(document);
    return () => {
      cleanupCareChoreography();
      cleanupReveals();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-hospital-bg text-hospital-light selection:bg-hospital-cyan selection:text-white overflow-x-hidden">
      {/* Custom cursor */}
      <CustomCursor />

      {/* Clinical WebGL background */}
      <BackgroundCanvas />

      {/* Primary navigation */}
      <FixedHeader
        onOpenBooking={() => setIsBookingOpen(true)}
        onNavigate={(id) => scrollTo(`#${id}`)}
      />

      {/* Floating section progress */}
      <ScrollProgressGauge
        progress={progress}
        activeSection={activeSection}
        onNavigate={(id) => scrollTo(`#${id}`)}
      />

      {/* Main clinical content */}
      <main className="relative z-10">
        <div>
          <HeroSection
            onOpenBooking={() => setIsBookingOpen(true)}
            onNavigate={(id) => scrollTo(`#${id}`)}
          />
        </div>

        <div data-reveal>
          <SeniorDoctorSpotlight
            onOpenBooking={() => setIsBookingOpen(true)}
            skewStyle={skewStyle}
          />
        </div>

        <div data-reveal>
          <NursingCollectiveSection
            skewStyle={skewStyle}
          />
        </div>

        <div>
          <SpecialtiesGallery
            onOpenBooking={() => setIsBookingOpen(true)}
          />
        </div>

        <VirtualTour3D />

        <div data-reveal>
          <TestimonialsStats
            skewStyle={skewStyle}
          />
        </div>

        <div data-reveal>
          <LocationFooterHUD onOpenBooking={() => setIsBookingOpen(true)} />
        </div>
      </main>

      {/* Appointment drawer */}
      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
      <ContactActions onOpenBooking={() => setIsBookingOpen(true)} />
    </div>
  );
};

export const App: React.FC = () => {
  const [pathname, setPathname] = useState(() => normalizeAppPath(window.location.pathname));

  useEffect(() => {
    const handleNavigation = () => setPathname(normalizeAppPath(window.location.pathname));
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  const legalPage = legalPages[pathname];
  if (legalPage) {
    return (
      <>
        <SeoMetadata
          title={legalPage.title}
          description={legalPage.description}
          path={legalPage.path}
        />
        <LegalPage page={legalPage} />
      </>
    );
  }

  if (pathname !== '/') {
    return (
      <>
        <SeoMetadata
          title="Page not found | Bhagat Hospital, Bhuj"
          description="The requested page could not be found."
          path={pathname}
          indexable={false}
        />
        <main className="legal-page legal-not-found">
          <h1>Page not found</h1>
          <p>This page may have moved or is not available.</p>
          <a className="legal-home-link" href={getAppPath('/')}>Return to Bhagat Hospital</a>
        </main>
      </>
    );
  }

  return (
    <>
      <SeoMetadata
        title="Bhagat Hospital | Dr. Ramesh Bhagat, Cardiologist | Bhuj"
        description="Find Bhagat Hospital in Bhuj, Gujarat. Explore cardiology services, hospital facilities, OPD timings, and contact details for Dr. Ramesh Bhagat."
        includeStructuredData
      />
      <HospitalWebsite />
    </>
  );
};

export default App;
