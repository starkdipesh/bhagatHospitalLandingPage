export interface Department {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  features: string[];
  metrics: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  condition: string;
  comment: string;
  source: 'Lybrate' | 'Meddco' | 'Google';
  rating: number;
  date: string;
}

export interface FacilityHotspot {
  id: string;
  name: string;
  roomType: string;
  specs: string[];
  tag: string;
}

