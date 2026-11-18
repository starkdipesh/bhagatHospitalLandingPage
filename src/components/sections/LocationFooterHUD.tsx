import React from 'react';
import { Calendar, Clock3, MapPin, Navigation, Phone } from 'lucide-react';
import { medicalAudio } from '../hud/AudioSynthesizer';
import { CreatorCredit } from '../CreatorCredit';

interface LocationFooterHUDProps {
  onOpenBooking: () => void;
}

const address = '1st Floor, Ashirwad Plaza, Near Reliance Mall, Mundra - Bhuj Rd, Aksha Nagar, Bhuj, Gujarat 370001';
const mapQuery = encodeURIComponent(`Bhagat Hospital, ${address}`);
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

export const LocationFooterHUD: React.FC<LocationFooterHUDProps> = ({ onOpenBooking }) => (
  <footer id="location" className="location-section relative z-10">
    <div className="location-inner">
      <header className="location-heading">
        <div>
          <p className="location-eyebrow">Visit Bhagat Hospital</p>
          <h2>Find us in Bhuj</h2>
          <p>Call the hospital, get directions, or send an appointment request.</p>
        </div>
        <a href={mapsUrl} target="_blank" rel="noreferrer" className="contact-action-button">
          <Navigation aria-hidden="true" /> Open in Google Maps
        </a>
      </header>

      <div className="location-grid">
        <div className="location-details">
          <section className="location-address">
            <MapPin aria-hidden="true" />
            <div>
              <h3>Bhagat Hospital</h3>
              <address>{address}</address>
            </div>
          </section>

          <section className="location-hours" aria-labelledby="opd-heading">
            <h3 id="opd-heading"><Clock3 aria-hidden="true" /> OPD timings</h3>
            <div className="location-hours-row">
              <span>Morning</span>
              <strong>10:00 AM – 01:30 PM</strong>
            </div>
            <div className="location-hours-row">
              <span>Evening</span>
              <strong>05:30 PM – 08:30 PM</strong>
            </div>
            <p>Days of operation are not listed here; please call to confirm availability.</p>
          </section>

          <section className="emergency-card" aria-labelledby="emergency-heading">
            <div>
              <p id="emergency-heading">Emergency contact · 24/7</p>
              <a href="tel:+917069232432">+91 70692 32432</a>
            </div>
            <a className="emergency-call" href="tel:+917069232432" aria-label="Call emergency contact">
              <Phone aria-hidden="true" /> Call now
            </a>
          </section>

          <div className="location-actions">
            <a href="tel:+917069232432" className="contact-action-button">
              <Phone aria-hidden="true" /> Call hospital
            </a>
            <button
              type="button"
              className="contact-action-button contact-action-primary"
              onClick={() => {
                medicalAudio.playClick();
                onOpenBooking();
              }}
            >
              <Calendar aria-hidden="true" /> Request an appointment
            </button>
          </div>
        </div>

        <div className="location-map">
          <iframe
            title="Google Maps location for Bhagat Hospital, Bhuj"
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      <div className="location-footer-note">
        <span>© {new Date().getFullYear()} Bhagat Hospital, Bhuj.</span>
        <nav className="location-legal-links" aria-label="Legal information">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-and-conditions">Terms and Conditions</a>
          <a href="/medical-disclaimer">Medical Disclaimer</a>
        </nav>
        <span>Dr. Ramesh Bhagat · Cardiologist</span>
        <CreatorCredit />
      </div>
    </div>
  </footer>
);
