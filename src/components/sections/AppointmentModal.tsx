import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Calendar, CheckCircle, LoaderCircle, MessageCircle, Phone, X } from 'lucide-react';
import { medicalAudio } from '../hud/AudioSynthesizer';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RequestForm {
  patientName: string;
  phone: string;
  department: string;
  date: string;
  consent: boolean;
}

type SubmissionState = 'idle' | 'loading' | 'success' | 'error';

const today = () => {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
};

const isValidIndianPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  const nationalNumber = digits.length === 12 && digits.startsWith('91')
    ? digits.slice(2)
    : digits;
  return /^[6-9]\d{9}$/.test(nationalNumber);
};

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState<RequestForm>({
    patientName: '',
    phone: '',
    department: 'Cardiology consultation',
    date: today(),
    consent: false,
  });
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const modalRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    setSubmissionState('idle');
    setValidationMessage('');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getFocusable = () => Array.from(
      modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled])',
      ) ?? [],
    );
    getFocusable()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationMessage('');

    if (!form.patientName.trim()) {
      setValidationMessage('Enter the patient’s name.');
      return;
    }
    if (!isValidIndianPhone(form.phone)) {
      setValidationMessage('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!form.department) {
      setValidationMessage('Choose a department.');
      return;
    }
    if (!form.date || form.date < today()) {
      setValidationMessage('Choose today or a future date.');
      return;
    }
    if (!form.consent) {
      setValidationMessage('Please agree to be contacted about this request.');
      return;
    }

    medicalAudio.playClick();
    setSubmissionState('loading');
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      setSubmissionState('success');
    } catch (error) {
      console.error('Appointment request placeholder failed.', error);
      setSubmissionState('error');
    }
  };

  // TODO: Replace this placeholder submit handler with the appointment-request backend API.
  // TODO: Connect the verified WhatsApp appointment link before sending request details there.
  const whatsappUrl = 'https://wa.me/917069232432';

  return (
    <div
      className="appointment-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={modalRef}
        className="appointment-modal glass-panel-glow"
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-title"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close appointment request"
          className="appointment-close"
        >
          <X aria-hidden="true" />
        </button>

        <div className="appointment-heading">
          <p>Bhagat Hospital · Bhuj</p>
          <h2 id="appointment-title">Request an appointment</h2>
          <p>Share your preferred details. This form is a demo and does not send or book an appointment.</p>
        </div>

        {submissionState === 'success' ? (
          <div className="appointment-state" role="status">
            <CheckCircle className="appointment-state-icon" aria-hidden="true" />
            <h3>Form validation complete</h3>
            <p>
              No appointment request has been sent. Call the hospital or open WhatsApp and share your preferred details to continue.
            </p>
            <div className="appointment-state-actions">
              <a href="tel:+917069232432" className="contact-action-button">
                <Phone aria-hidden="true" /> Call hospital
              </a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="contact-action-button">
                <MessageCircle aria-hidden="true" /> WhatsApp
              </a>
            </div>
            <button type="button" className="appointment-text-button" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form className="appointment-form" onSubmit={(event) => void handleSubmit(event)} noValidate>
            <label>
              Patient name
              <input
                autoComplete="name"
                required
                value={form.patientName}
                onChange={(event) => setForm({ ...form, patientName: event.target.value })}
              />
            </label>

            <label>
              Phone number
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                required
                value={form.phone}
                aria-describedby="appointment-phone-help"
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
              <span id="appointment-phone-help" className="appointment-field-help">
                Enter a valid Indian mobile number.
              </span>
            </label>

            <label>
              Department
              <select
                required
                value={form.department}
                onChange={(event) => setForm({ ...form, department: event.target.value })}
              >
                <option>Cardiology consultation</option>
                <option>Cardiac diagnostic test</option>
                <option>Nursing care</option>
              </select>
            </label>

            <label>
              Preferred date
              <span className="appointment-date-field">
                <input
                  type="date"
                  required
                  min={today()}
                  value={form.date}
                  onChange={(event) => setForm({ ...form, date: event.target.value })}
                />
                <Calendar aria-hidden="true" />
              </span>
            </label>

            <label className="appointment-consent">
              <input
                type="checkbox"
                required
                checked={form.consent}
                onChange={(event) => setForm({ ...form, consent: event.target.checked })}
              />
              <span>I agree to be contacted about this appointment request.</span>
            </label>

            {validationMessage && (
              <p className="appointment-message appointment-message-error" role="alert">
                <AlertCircle aria-hidden="true" /> {validationMessage}
              </p>
            )}
            {submissionState === 'error' && (
              <p className="appointment-message appointment-message-error" role="alert">
                <AlertCircle aria-hidden="true" /> We couldn’t prepare this request. Please try again or call the hospital.
              </p>
            )}

            <button
              type="submit"
              className="appointment-submit"
              disabled={submissionState === 'loading'}
            >
              {submissionState === 'loading'
                ? <><LoaderCircle className="animate-spin" aria-hidden="true" /> Preparing request…</>
                : 'Continue with request'}
            </button>
            <p className="appointment-disclaimer">
              This demo does not transmit your information. An appointment is not confirmed until the hospital responds.
            </p>
          </form>
        )}
      </section>
    </div>
  );
};
