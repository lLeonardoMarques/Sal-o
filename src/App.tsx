import React, { useState, useEffect } from 'react';
import { Booking, Professional, ServiceItem } from './types';
import { getSavedBookings, cancelBookingInStorage } from './utils/whatsapp';
import { SALON_INFO } from './data/salonData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceCatalog } from './components/ServiceCatalog';
import { SpecialistsSection } from './components/SpecialistsSection';
import { SalonPhotoGallery } from './components/SalonPhotoGallery';
import { SalonExperience } from './components/SalonExperience';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { MyAppointmentsModal } from './components/MyAppointmentsModal';
import { MobileBottomBar } from './components/MobileBottomBar';
import { BellaChatModal } from './components/BellaChatModal';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isMyAppointmentsOpen, setIsMyAppointmentsOpen] = useState<boolean>(false);
  const [isBellaOpen, setIsBellaOpen] = useState<boolean>(false);
  const [initialService, setInitialService] = useState<ServiceItem | null>(null);
  const [initialProfessional, setInitialProfessional] = useState<Professional | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load saved bookings from localStorage
  const refreshBookings = () => {
    const list = getSavedBookings();
    setBookings(list);
  };

  useEffect(() => {
    refreshBookings();
  }, []);

  const handleOpenBooking = (service?: ServiceItem, professional?: Professional) => {
    setInitialService(service || null);
    setInitialProfessional(professional || null);
    setIsBookingModalOpen(true);
  };

  const handleSelectProfessional = (pro: Professional) => {
    setInitialProfessional(pro);
    setInitialService(null);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    refreshBookings();
  };

  const handleCancelBooking = (id: string) => {
    cancelBookingInStorage(id);
    refreshBookings();
  };

  const activeCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-[#FAF6F5] text-[#2C2426] flex flex-col antialiased selection:bg-[#E8A598]/30 selection:text-[#7D3845] relative">
      {/* Top Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenMyAppointments={() => setIsMyAppointmentsOpen(true)}
        onOpenBella={() => setIsBellaOpen(true)}
        activeAppointmentsCount={activeCount}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onExploreServices={() => {
            const el = document.getElementById('servicos');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Services Catalog & Pricing with Minimize/Expand toggle */}
        <ServiceCatalog
          onSelectServiceToBook={(service) => handleOpenBooking(service)}
        />

        {/* Specialists Team (Flavia Cabeleireira & Yasmin Massagista) */}
        <SpecialistsSection
          onSelectProfessional={handleSelectProfessional}
        />

        {/* Photo Gallery with Minimize/Expand toggle */}
        <SalonPhotoGallery />

        {/* Salon Experience, Amenities & Reviews */}
        <SalonExperience
          onOpenBooking={() => handleOpenBooking()}
        />
      </main>

      {/* Footer & Contacts */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenMyAppointments={() => setIsMyAppointmentsOpen(true)}
      />

      {/* Mobile Floating Bottom Bar */}
      <MobileBottomBar
        onOpenBooking={() => handleOpenBooking()}
        onOpenMyAppointments={() => setIsMyAppointmentsOpen(true)}
        activeCount={activeCount}
      />

      {/* Desktop Floating WhatsApp Button */}
      <a
        id="desktop-whatsapp-float-btn"
        href={`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encodeURIComponent('Olá! Gostaria de falar com o atendimento do Toque da Beleza.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 group"
        title="Falar no WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold tracking-wide">WhatsApp Online</span>
      </a>

      {/* Booking System Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setInitialService(null);
          setInitialProfessional(null);
        }}
        initialService={initialService}
        initialProfessional={initialProfessional}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Client's Saved Appointments Modal */}
      <MyAppointmentsModal
        isOpen={isMyAppointmentsOpen}
        onClose={() => setIsMyAppointmentsOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onOpenNewBooking={() => {
          setIsMyAppointmentsOpen(false);
          handleOpenBooking();
        }}
      />

      {/* Discrete AI Beauty Agent - Bella */}
      <BellaChatModal
        isOpen={isBellaOpen}
        onToggle={() => setIsBellaOpen((prev) => !prev)}
        onOpenBooking={() => handleOpenBooking()}
      />
    </div>
  );
}
