export interface LegalPageContent {
  path: string;
  title: string;
  description: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
}

export const SITE_URL = 'https://bhagathospital.vercel.app';

export const legalPages: Record<string, LegalPageContent> = {
  '/privacy-policy': {
    path: '/privacy-policy',
    title: 'Privacy Policy | Bhagat Hospital, Bhuj',
    description: 'Learn how the Bhagat Hospital website handles information, contact links, and third-party services.',
    sections: [
      {
        heading: 'Information submitted through this website',
        paragraphs: [
          'The appointment request form currently runs as a demonstration only. It does not submit, store, or send the details entered. An appointment is not made or confirmed through that form.',
          'If you call the hospital or choose to open WhatsApp, your device and the service you use will handle that communication. Do not send sensitive medical information through a channel unless you are comfortable with its privacy practices.',
        ],
      },
      {
        heading: 'Third-party services',
        paragraphs: [
          'This website links to or embeds Google Maps and loads fonts from Google Fonts. Those providers may receive technical information such as your IP address when your browser requests their content. Their own privacy terms apply to those services.',
        ],
      },
      {
        heading: 'Cookies and analytics',
        paragraphs: [
          'The website code currently contains no analytics or advertising tracking integration. Your browser or third-party embedded services may still use their own storage or technical mechanisms.',
        ],
      },
      {
        heading: 'Contact and updates',
        paragraphs: [
          'For questions about this website or this policy, contact Bhagat Hospital by phone at +91 70692 32432. This policy may be updated when website functionality changes.',
        ],
      },
    ],
  },
  '/terms-and-conditions': {
    path: '/terms-and-conditions',
    title: 'Terms and Conditions | Bhagat Hospital, Bhuj',
    description: 'Terms for using the Bhagat Hospital website, its information, and contact features.',
    sections: [
      {
        heading: 'Website information',
        paragraphs: [
          'This website provides general information about Bhagat Hospital, its location, services, and contact options. Information is provided for convenience and may change; please contact the hospital to confirm current availability, timings, or other details.',
        ],
      },
      {
        heading: 'Appointment requests',
        paragraphs: [
          'The online appointment request form is a demonstration and does not transmit a request or reserve a time. An appointment is not confirmed unless the hospital confirms it through a direct communication channel.',
        ],
      },
      {
        heading: 'External services',
        paragraphs: [
          'Links to services such as Google Maps and WhatsApp are provided as contact or navigation options. Those services are governed by their own terms and privacy practices.',
        ],
      },
      {
        heading: 'Website use',
        paragraphs: [
          'Use this website lawfully and do not interfere with its operation or attempt to misuse its forms, content, or links. Website content is provided without a guarantee that every detail will always be current or uninterrupted.',
        ],
      },
    ],
  },
  '/medical-disclaimer': {
    path: '/medical-disclaimer',
    title: 'Medical Disclaimer | Bhagat Hospital, Bhuj',
    description: 'Important information about the limits of medical information published on the Bhagat Hospital website.',
    sections: [
      {
        heading: 'General information only',
        paragraphs: [
          'Information on this website is general and is not medical advice, diagnosis, or a treatment plan. Reading this website does not create a doctor-patient relationship.',
          'Health decisions depend on individual circumstances. Speak directly with a qualified healthcare professional about symptoms, diagnoses, tests, or treatment. Do not delay or disregard professional care based on website content.',
        ],
      },
      {
        heading: 'Urgent medical concerns',
        paragraphs: [
          'For urgent medical concerns, contact emergency services in your area or call the hospital at +91 70692 32432. Do not rely on this website or its appointment request demonstration for emergency care.',
        ],
      },
      {
        heading: 'Information and availability',
        paragraphs: [
          'Descriptions of hospital services and timings are informational and may not reflect real-time availability. Contact the hospital directly to confirm details before travelling.',
        ],
      },
    ],
  },
};
