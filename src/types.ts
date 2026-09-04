export type ServiceCategory = 
  | 'todos'
  | 'cabelos'
  | 'unhas'
  | 'estetica'
  | 'olhar'
  | 'massagens'
  | 'masculino';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  durationMinutes: number;
  description: string;
  popular?: boolean;
  highlight?: string;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  specialties: string[];
  rating: number;
  reviewsCount: number;
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  notes?: string;
  services: ServiceItem[];
  professional: Professional | { id: 'any'; name: 'Qualquer Especialista Disponível'; role: 'Equipe Toque da Beleza'; photoUrl: string };
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  totalPrice: number;
  totalDurationMinutes: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  reminderWhatsApp: boolean;
}
