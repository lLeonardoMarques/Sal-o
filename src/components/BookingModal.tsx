import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Check,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  MessageCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CalendarCheck,
  AlertCircle,
  Share2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Booking, Professional, ServiceItem } from '../types';
import { PROFESSIONALS, SERVICES, SALON_INFO } from '../data/salonData';
import {
  formatCurrency,
  formatPhoneNumber,
  formatDateBR,
  getDayOfWeekName,
  getSalonWhatsAppUrl,
  getClientReminderWhatsAppUrl,
  getGoogleCalendarUrl,
  saveBooking,
} from '../utils/whatsapp';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceItem | null;
  initialProfessional?: Professional | null;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService,
  initialProfessional,
  onBookingSuccess,
}) => {
  // Wizard steps: 1 = Services, 2 = Professional, 3 = Date/Time, 4 = Client Details, 5 = Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<
    Professional | { id: 'any'; name: 'Qualquer Especialista Disponível'; role: 'Equipe Toque da Beleza'; photoUrl: string }
  >({
    id: 'any',
    name: 'Qualquer Especialista Disponível',
    role: 'Equipe Toque da Beleza',
    photoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80',
  });

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [reminderWhatsApp, setReminderWhatsApp] = useState<boolean>(true);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Pre-load initial service or professional if passed
  useEffect(() => {
    if (initialProfessional) {
      setSelectedProfessional(initialProfessional);
      if (initialProfessional.id === 'flavia-cabeleireira') {
        const hairService = SERVICES.find((s) => s.category === 'cabelos') || SERVICES[0];
        setSelectedServices([hairService]);
      } else if (initialProfessional.id === 'yasmin-massagista') {
        const massageService = SERVICES.find((s) => s.category === 'massagens') || SERVICES[0];
        setSelectedServices([massageService]);
      }
      setCurrentStep(3);
    } else if (initialService) {
      setSelectedServices([initialService]);
      setCurrentStep(2);
    } else if (isOpen && selectedServices.length === 0) {
      // Default to the first popular service
      const defaultService = SERVICES.find((s) => s.popular) || SERVICES[0];
      setSelectedServices([defaultService]);
    }
  }, [initialService, initialProfessional, isOpen]);

  // Set a default available date (e.g. tomorrow or today)
  useEffect(() => {
    if (!selectedDate && isOpen) {
      const now = new Date();
      // If Sunday, pick Monday
      if (now.getDay() === 0) {
        now.setDate(now.getDate() + 1);
      }
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      setSelectedDate(`${yyyy}-${mm}-${dd}`);
      setSelectedTime('10:00');
    }
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  // Calculations
  const totalPrice = selectedServices.reduce((acc, curr) => acc + curr.price, 0);
  const totalDuration = selectedServices.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  // Generate next 21 calendar days
  const generateAvailableDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;

      const dayOfWeek = d.getDay();
      const isSunday = dayOfWeek === 0;

      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

      days.push({
        dateString,
        dayNumber: dd,
        dayOfWeekName: dayNames[dayOfWeek],
        monthName: monthNames[d.getMonth()],
        isClosed: isSunday,
        isToday: i === 0,
      });
    }
    return days;
  };

  const availableDays = generateAvailableDays();

  // Generate smart time slots
  const morningSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
  const afternoonSlots = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
  const eveningSlots = ['18:00', '18:30', '19:00', '19:30'];

  const toggleService = (service: ServiceItem) => {
    const exists = selectedServices.some((s) => s.id === service.id);
    if (exists) {
      if (selectedServices.length === 1) {
        setFormError('Selecione pelo menos um serviço para agendar.');
        return;
      }
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
      setFormError('');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientPhone(formatPhoneNumber(e.target.value));
  };

  const handleConfirmBooking = () => {
    setFormError('');

    if (selectedServices.length === 0) {
      setFormError('Por favor, selecione pelo menos um serviço.');
      setCurrentStep(1);
      return;
    }

    if (!selectedDate || !selectedTime) {
      setFormError('Por favor, selecione uma data e horário válidos.');
      setCurrentStep(3);
      return;
    }

    if (!clientName.trim()) {
      setFormError('Por favor, informe seu nome completo.');
      return;
    }

    const digitsOnly = clientPhone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setFormError('Por favor, informe um número de WhatsApp válido com DDD (ex: 11 98888-7777).');
      return;
    }

    // Generate appointment object
    const newBooking: Booking = {
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      clientName: clientName.trim(),
      clientPhone,
      clientEmail: clientEmail.trim() || undefined,
      notes: clientNotes.trim() || undefined,
      services: selectedServices,
      professional: selectedProfessional,
      date: selectedDate,
      time: selectedTime,
      totalPrice,
      totalDurationMinutes: totalDuration,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      reminderWhatsApp,
    };

    // Save locally
    saveBooking(newBooking);
    setCreatedBooking(newBooking);
    onBookingSuccess(newBooking);
    setCurrentStep(5);

    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8C3A4B', '#E8A598', '#F9ECE9', '#2E7D32', '#D4AF37'],
    });
  };

  const handleCopySummary = () => {
    if (!createdBooking) return;
    const url = getSalonWhatsAppUrl(createdBooking);
    navigator.clipboard.writeText(decodeURIComponent(url.split('text=')[1] || ''));
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF6F5] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#ECD0CA] overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#ECD0CA] flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FAF1EF] border border-[#EAC4BC] flex items-center justify-center text-[#8C3A4B]">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-lg sm:text-xl text-[#3E1C24] leading-tight">
                Agendamento Online
              </h3>
              <p className="text-[11px] text-[#7A5D64]">
                Toque da Beleza • Salão de Estética
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#7A5D64] hover:text-[#3E1C24] hover:bg-[#F6ECE8] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker (Steps 1 to 4) */}
        {currentStep < 5 && (
          <div className="bg-[#FAF1EF] px-4 py-2.5 border-b border-[#ECD0CA]">
            <div className="flex items-center justify-between max-w-lg mx-auto text-[11px] sm:text-xs font-semibold">
              <button
                onClick={() => setCurrentStep(1)}
                className={`flex items-center gap-1 cursor-pointer ${
                  currentStep >= 1 ? 'text-[#8C3A4B]' : 'text-[#A0888E]'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === 1 ? 'bg-[#8C3A4B] text-white' : 'bg-[#ECD0CA] text-[#552D36]'
                }`}>1</span>
                <span>Serviços</span>
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-[#C8A7AE]" />

              <button
                onClick={() => selectedServices.length > 0 && setCurrentStep(2)}
                className={`flex items-center gap-1 cursor-pointer ${
                  currentStep >= 2 ? 'text-[#8C3A4B]' : 'text-[#A0888E]'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === 2 ? 'bg-[#8C3A4B] text-white' : 'bg-[#ECD0CA] text-[#552D36]'
                }`}>2</span>
                <span>Profissional</span>
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-[#C8A7AE]" />

              <button
                onClick={() => selectedServices.length > 0 && setCurrentStep(3)}
                className={`flex items-center gap-1 cursor-pointer ${
                  currentStep >= 3 ? 'text-[#8C3A4B]' : 'text-[#A0888E]'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === 3 ? 'bg-[#8C3A4B] text-white' : 'bg-[#ECD0CA] text-[#552D36]'
                }`}>3</span>
                <span>Data & Hora</span>
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-[#C8A7AE]" />

              <button
                onClick={() => selectedServices.length > 0 && selectedDate && selectedTime && setCurrentStep(4)}
                className={`flex items-center gap-1 cursor-pointer ${
                  currentStep >= 4 ? 'text-[#8C3A4B]' : 'text-[#A0888E]'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === 4 ? 'bg-[#8C3A4B] text-white' : 'bg-[#ECD0CA] text-[#552D36]'
                }`}>4</span>
                <span>Seus Dados</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: Seleção de Serviços */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-[#3E1C24]">
                    Escolha um ou mais serviços
                  </h4>
                  <p className="text-xs text-[#7A5D64]">
                    Você pode combinar cabelo, manicure, cílios ou massagem em um único agendamento.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-[#F5E2DE] text-[#8C3A4B] rounded-full">
                  {selectedServices.length} selecionado(s)
                </span>
              </div>

              <div className="space-y-2.5 max-h-[44vh] overflow-y-auto pr-1">
                {SERVICES.map((service) => {
                  const isChecked = selectedServices.some((s) => s.id === service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service)}
                      className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-white border-[#8C3A4B] shadow-xs ring-1 ring-[#8C3A4B]'
                          : 'bg-white border-[#EBD0CB] hover:bg-[#FDF9F8]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-[#8C3A4B] text-white'
                              : 'border border-[#C99EA6] bg-[#FAF5F4]'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs sm:text-sm text-[#3E1C24]">
                              {service.name}
                            </span>
                            {service.highlight && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F7ECE9] text-[#8C3A4B]">
                                {service.highlight}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#7A5D64] line-clamp-1 mt-0.5">
                            {service.description}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#937279] mt-1">
                            <Clock className="w-3 h-3" />
                            {service.durationMinutes} minutos
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-serif-luxury font-bold text-sm sm:text-base text-[#4A222B]">
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Seleção de Especialista */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-[#3E1C24]">
                  Com quem você deseja realizar o atendimento?
                </h4>
                <p className="text-xs text-[#7A5D64]">
                  Selecione um especialista de sua preferência ou qualquer profissional disponível para ter mais opções de horário.
                </p>
              </div>

              {/* Any Professional Option */}
              <div
                onClick={() =>
                  setSelectedProfessional({
                    id: 'any',
                    name: 'Qualquer Especialista Disponível',
                    role: 'Equipe Toque da Beleza',
                    photoUrl:
                      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80',
                  })
                }
                className={`p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  selectedProfessional.id === 'any'
                    ? 'bg-white border-[#8C3A4B] shadow-xs ring-1 ring-[#8C3A4B]'
                    : 'bg-white border-[#EBD0CB] hover:bg-[#FDF9F8]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF1EF] border border-[#E9C7C0] flex items-center justify-center text-[#8C3A4B]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-[#3E1C24]">
                      Qualquer Especialista Disponível
                    </h5>
                    <p className="text-xs text-[#7A5D64]">
                      Maior agilidade e compatibilidade de horários
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    selectedProfessional.id === 'any'
                      ? 'bg-[#8C3A4B] text-white'
                      : 'border border-[#C99EA6]'
                  }`}
                >
                  {selectedProfessional.id === 'any' && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Individual Professionals */}
              <div className="space-y-2.5 max-h-[38vh] overflow-y-auto pr-1">
                {PROFESSIONALS.map((pro) => {
                  const isSelected = selectedProfessional.id === pro.id;
                  return (
                    <div
                      key={pro.id}
                      onClick={() => setSelectedProfessional(pro)}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-white border-[#8C3A4B] shadow-xs ring-1 ring-[#8C3A4B]'
                          : 'bg-white border-[#EBD0CB] hover:bg-[#FDF9F8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={pro.photoUrl}
                          alt={pro.name}
                          className="w-12 h-12 rounded-full object-cover border border-[#E8CAC4]"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-semibold text-xs sm:text-sm text-[#3E1C24]">
                              {pro.name}
                            </h5>
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                              ★ {pro.rating}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7A5D64]">{pro.role}</p>
                          <p className="text-[10px] text-[#93757D] line-clamp-1 mt-0.5">
                            {pro.specialties.join(' • ')}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#8C3A4B] text-white'
                            : 'border border-[#C99EA6]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Escolha da Data e Horário */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-[#3E1C24]">
                  Escolha a Data & Horário Desejado
                </h4>
                <p className="text-xs text-[#7A5D64]">
                  Selecione o melhor dia e horário para o seu atendimento no salão.
                </p>
              </div>

              {/* Horizontal Date Picker */}
              <div>
                <span className="text-xs font-semibold text-[#57363D] block mb-2">
                  1. Selecione o Dia
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {availableDays.map((day) => {
                    const isSelected = selectedDate === day.dateString;
                    const isClosed = day.isClosed;

                    return (
                      <button
                        key={day.dateString}
                        disabled={isClosed}
                        onClick={() => {
                          setSelectedDate(day.dateString);
                          setFormError('');
                        }}
                        className={`min-w-[66px] py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isClosed
                            ? 'opacity-40 bg-gray-100 border border-gray-200 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#7D3342] text-white shadow-md ring-2 ring-[#7D3342]'
                            : 'bg-white text-[#4A2E35] border border-[#EBD0CB] hover:bg-[#FDF9F8]'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-semibold">
                          {day.dayOfWeekName}
                        </span>
                        <span className="text-lg font-bold font-serif-luxury my-0.5">
                          {day.dayNumber}
                        </span>
                        <span className="text-[10px]">{day.monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected date display */}
              {selectedDate && (
                <div className="p-3 bg-white rounded-xl border border-[#ECD0CA] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#57363D]">
                    <CalendarIcon className="w-4 h-4 text-[#8C3A4B]" />
                    <span className="font-medium">
                      Data selecionada:{' '}
                      <strong>
                        {formatDateBR(selectedDate)} ({getDayOfWeekName(selectedDate)})
                      </strong>
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                    Salão aberto
                  </span>
                </div>
              )}

              {/* Time Slots */}
              <div>
                <span className="text-xs font-semibold text-[#57363D] block mb-2">
                  2. Selecione o Horário de Início
                </span>

                <div className="space-y-3">
                  {/* Manhã */}
                  <div>
                    <span className="text-[11px] text-[#7A5D64] font-medium block mb-1.5">
                      ☀️ Manhã
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {morningSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                            selectedTime === time
                              ? 'bg-[#8C3A4B] text-white border-[#8C3A4B] shadow-xs'
                              : 'bg-white text-[#4A2E35] border-[#EBD0CB] hover:bg-[#F8ECE8]'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tarde */}
                  <div>
                    <span className="text-[11px] text-[#7A5D64] font-medium block mb-1.5">
                      🌤️ Tarde
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {afternoonSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                            selectedTime === time
                              ? 'bg-[#8C3A4B] text-white border-[#8C3A4B] shadow-xs'
                              : 'bg-white text-[#4A2E35] border-[#EBD0CB] hover:bg-[#F8ECE8]'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Noite */}
                  <div>
                    <span className="text-[11px] text-[#7A5D64] font-medium block mb-1.5">
                      🌙 Noite
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {eveningSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                            selectedTime === time
                              ? 'bg-[#8C3A4B] text-white border-[#8C3A4B] shadow-xs'
                              : 'bg-white text-[#4A2E35] border-[#EBD0CB] hover:bg-[#F8ECE8]'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Dados da Cliente */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-[#3E1C24]">
                  Seus Dados para o Atendimento
                </h4>
                <p className="text-xs text-[#7A5D64]">
                  Usaremos seu WhatsApp para enviar o link de confirmação imediata e lembretes da reserva.
                </p>
              </div>

              <div className="space-y-3">
                {/* Nome */}
                <div>
                  <label className="text-xs font-semibold text-[#4A2E35] block mb-1">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#A87E87] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ex: Amanda Ferreira"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBD0CB] rounded-xl text-sm text-[#3E1C24] focus:ring-2 focus:ring-[#8C3A4B]/30 focus:border-[#8C3A4B] outline-none"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="text-xs font-semibold text-[#4A2E35] block mb-1">
                    Número de WhatsApp com DDD *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#A87E87] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="(11) 98888-7777"
                      value={clientPhone}
                      onChange={handlePhoneChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBD0CB] rounded-xl text-sm text-[#3E1C24] focus:ring-2 focus:ring-[#8C3A4B]/30 focus:border-[#8C3A4B] outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-[#7A5D64] mt-1 block">
                    Integração oficial: enviaremos seu voucher instantâneo para este número.
                  </span>
                </div>

                {/* E-mail (opcional) */}
                <div>
                  <label className="text-xs font-semibold text-[#4A2E35] block mb-1">
                    E-mail (opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EBD0CB] rounded-xl text-sm text-[#3E1C24] focus:ring-2 focus:ring-[#8C3A4B]/30 focus:border-[#8C3A4B] outline-none"
                  />
                </div>

                {/* Observações / Preferências */}
                <div>
                  <label className="text-xs font-semibold text-[#4A2E35] block mb-1">
                    Observações ou Preferências (opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Possuo química recente no cabelo, prefiro atendimento sem secador muito quente, etc."
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#EBD0CB] rounded-xl text-xs sm:text-sm text-[#3E1C24] focus:ring-2 focus:ring-[#8C3A4B]/30 focus:border-[#8C3A4B] outline-none resize-none"
                  />
                </div>

                {/* WhatsApp reminder checkbox */}
                <div
                  onClick={() => setReminderWhatsApp(!reminderWhatsApp)}
                  className="p-3 bg-white rounded-xl border border-[#EBD0CB] flex items-center gap-3 cursor-pointer select-none"
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center ${
                      reminderWhatsApp ? 'bg-emerald-600 text-white' : 'border border-[#C99EA6]'
                    }`}
                  >
                    {reminderWhatsApp && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs text-[#4A2E35] font-medium">
                    Desejo receber lembrete gratuito no WhatsApp 24h antes do atendimento
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Sucesso & Notificação WhatsApp */}
          {currentStep === 5 && createdBooking && (
            <div className="space-y-5 text-center py-2 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-[#F9ECE9] text-[#8C3A4B] text-[11px] font-bold rounded-full uppercase tracking-wider mb-2">
                  Reserva Registrada com Sucesso!
                </span>
                <h4 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#3E1C24]">
                  Tudo pronto, {createdBooking.clientName.split(' ')[0]}!
                </h4>
                <p className="text-xs sm:text-sm text-[#6E535A] max-w-md mx-auto mt-1">
                  Seu horário foi pré-reservado no sistema. Clique abaixo para enviar a confirmação oficial no WhatsApp do salão e salvar seu comprovante.
                </p>
              </div>

              {/* Digital Voucher Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EAC4BC] shadow-sm text-left max-w-md mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#F9ECE9]/60 rounded-bl-full pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-[#F3DDD9] pb-3 mb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A5B64] font-semibold block">
                      Código do Agendamento
                    </span>
                    <span className="font-mono font-bold text-sm text-[#8C3A4B]">
                      #{createdBooking.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#8A5B64] font-semibold block">
                      Valor Total
                    </span>
                    <span className="font-serif-luxury font-bold text-lg text-[#3E1C24]">
                      {formatCurrency(createdBooking.totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#523239]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#84656C]">Data & Horário:</span>
                    <strong className="text-[#3E1C24]">
                      {formatDateBR(createdBooking.date)} às {createdBooking.time}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#84656C]">Profissional:</span>
                    <span className="font-medium text-[#3E1C24]">
                      {createdBooking.professional.name}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2 pt-1 border-t border-[#F5E5E2]">
                    <span className="text-[#84656C] shrink-0">Serviço(s):</span>
                    <span className="font-medium text-right text-[#3E1C24]">
                      {createdBooking.services.map((s) => s.name).join(' + ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Action: Direct WhatsApp Notification Button */}
              <div className="space-y-2.5 max-w-md mx-auto pt-2">
                <a
                  id="whatsapp-confirm-primary-btn"
                  href={getSalonWhatsAppUrl(createdBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer transform active:scale-98"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>📲 Enviar Confirmação no WhatsApp do Salão</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  {/* Add to Google Calendar */}
                  <a
                    href={getGoogleCalendarUrl(createdBooking)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-white hover:bg-[#FDF9F8] text-[#553037] border border-[#E9C7C0] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CalendarCheck className="w-3.5 h-3.5 text-[#8C3A4B]" />
                    <span>Google Agenda</span>
                  </a>

                  {/* Copy message text */}
                  <button
                    onClick={handleCopySummary}
                    className="py-2.5 px-3 bg-white hover:bg-[#FDF9F8] text-[#553037] border border-[#E9C7C0] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#8C3A4B]" />
                    <span>{copiedMessage ? 'Copiado!' : 'Copiar Texto'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Summary & Navigation (Steps 1-4) */}
        {currentStep < 5 && (
          <div className="p-4 bg-white border-t border-[#ECD0CA] flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-[#7A5D64] uppercase tracking-wider block">
                Total ({selectedServices.length} serviço{selectedServices.length > 1 ? 's' : ''} • {totalDuration} min)
              </span>
              <span className="font-serif-luxury font-bold text-lg sm:text-xl text-[#8C3A4B]">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="px-3 py-2.5 text-xs font-semibold text-[#663540] bg-[#FAF1EF] hover:bg-[#F2E0DC] rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Voltar</span>
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={() => {
                    setFormError('');
                    if (currentStep === 1 && selectedServices.length === 0) {
                      setFormError('Selecione pelo menos um serviço.');
                      return;
                    }
                    setCurrentStep((prev) => prev + 1);
                  }}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#7D3342] hover:bg-[#682633] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continuar</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="btn-finalize-booking"
                  onClick={handleConfirmBooking}
                  className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer transform active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmar & Notificar</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Finish button on step 5 */}
        {currentStep === 5 && (
          <div className="p-4 bg-white border-t border-[#ECD0CA] text-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#FAF1EF] hover:bg-[#F2E0DC] text-[#663540] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Fechar e Voltar ao Site
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
