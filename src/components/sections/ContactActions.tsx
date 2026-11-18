import React from 'react';
import { AlertTriangle, Calendar, MessageCircle, Phone } from 'lucide-react';

interface ContactActionsProps {
  onOpenBooking: () => void;
}

export const ContactActions: React.FC<ContactActionsProps> = ({ onOpenBooking }) => (
  <>
    <a className="emergency-float" href="tel:+917069232432" aria-label="Call hospital emergency contact, available 24 hours">
      <AlertTriangle aria-hidden="true" />
      <span>Emergency 24/7</span>
    </a>
    <nav className="mobile-contact-bar" aria-label="Quick contact actions">
      <a href="tel:+917069232432">
        <Phone aria-hidden="true" />
        <span>Call</span>
      </a>
      <a href="https://wa.me/917069232432" target="_blank" rel="noreferrer">
        <MessageCircle aria-hidden="true" />
        <span>WhatsApp</span>
      </a>
      <button type="button" onClick={onOpenBooking}>
        <Calendar aria-hidden="true" />
        <span>Book</span>
      </button>
    </nav>
  </>
);
