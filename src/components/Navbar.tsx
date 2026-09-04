import React, { useState } from 'react';
import { Logo } from './Logo';
import { Calendar, Clock, MapPin, MessageCircle, Phone, Sparkles, Menu, X, Camera } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenMyAppointments: () => void;
  onOpenBella?: () => void;
  activeAppointmentsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenMyAppointments,
  onOpenBella,
  activeAppointmentsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F5]/95 backdrop-blur-md border-b border-[#EED7D2]/80 transition-all">
      {/* Top micro bar for salon hours and Vila Olímpia highlight */}
      <div className="bg-[#48232B] text-[#F9ECE9] text-[10.5px] sm:text-xs py-1 sm:py-1.5 px-3.5 sm:px-4 select-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            <span className="font-medium tracking-wide truncate">Aberto hoje • 07:30 às 21:00</span>
            <span className="hidden md:inline text-rose-200/50">•</span>
            <span className="hidden md:inline text-rose-100/90 items-center gap-1">
              <MapPin className="w-3 h-3 text-[#E8A598]" /> R. Alvorada, 1289 - Vila Olímpia, SP
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a
              href={`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre os serviços do Toque da Beleza.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-300 transition-colors flex items-center gap-1 font-medium text-[10.5px] sm:text-xs"
            >
              <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp:</span> {SALON_INFO.whatsappDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2">
        <Logo size="md" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#4A2E35]">
          <button
            onClick={() => scrollToSection('servicos')}
            className="hover:text-[#8D3A4B] transition-colors cursor-pointer"
          >
            Serviços
          </button>
          <button
            onClick={() => scrollToSection('especialistas')}
            className="hover:text-[#8D3A4B] transition-colors cursor-pointer"
          >
            Especialistas
          </button>
          <button
            onClick={() => scrollToSection('fotos')}
            className="hover:text-[#8D3A4B] transition-colors cursor-pointer"
          >
            Fotos
          </button>
          <button
            onClick={() => scrollToSection('experiencia')}
            className="hover:text-[#8D3A4B] transition-colors cursor-pointer"
          >
            O Salão
          </button>
          <button
            onClick={() => scrollToSection('avaliacoes')}
            className="hover:text-[#8D3A4B] transition-colors cursor-pointer"
          >
            Avaliações
          </button>
          <button
            onClick={() => scrollToSection('localizacao')}
            className="hover:text-[#8D3A4B] transition-colors cursor-pointer"
          >
            Contato
          </button>
        </nav>

        {/* Actions (Desktop & Mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3">
          {/* Bella IA Discrete Trigger (Desktop & Tablet) */}
          {onOpenBella && (
            <button
              id="nav-bella-btn"
              onClick={onOpenBella}
              className="hidden md:inline-flex relative px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#7D3342] bg-[#FAF0ED] hover:bg-[#F5E2DE] rounded-full items-center gap-1.5 transition-all cursor-pointer border border-[#EACEC8] shadow-xs active:scale-95"
              title="Tirar dúvidas com Bella (IA)"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8D3A4B]" />
              <span>Bella IA</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          )}

          {/* My Appointments Button (Desktop & Tablet) */}
          <button
            id="nav-my-appointments-btn"
            onClick={onOpenMyAppointments}
            className="hidden sm:inline-flex relative px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#64343F] bg-[#F3E5E2] hover:bg-[#EBDBD7] rounded-full items-center gap-1.5 transition-colors cursor-pointer border border-[#E4C8C2] active:scale-95"
            title="Ver meus horários agendados"
          >
            <Clock className="w-3.5 h-3.5 text-[#8D3A4B]" />
            <span>Meus Horários</span>
            {activeAppointmentsCount > 0 && (
              <span className="w-5 h-5 bg-[#8D3A4B] text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                {activeAppointmentsCount}
              </span>
            )}
          </button>

          {/* Direct CTA - Clean, Compact & Fluid on Mobile */}
          <button
            id="nav-schedule-btn"
            onClick={onOpenBooking}
            className="px-3.5 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#7D3342] to-[#994758] hover:from-[#6A2937] hover:to-[#843A49] rounded-full shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer transform active:scale-95 whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Agendar</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center text-[#4A2E35] hover:bg-[#F3E5E2] active:bg-[#EBD7D2] rounded-full transition-colors cursor-pointer"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF6F5] border-b border-[#EED7D2] px-6 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-2.5 text-sm font-medium text-[#4A2E35]">
            {onOpenBella && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBella();
                }}
                className="text-left py-2 border-b border-[#F0DCD7] flex items-center justify-between text-[#7D3342] font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8D3A4B]" />
                  Tirar Dúvidas com Bella (IA)
                </span>
                <span className="text-[10px] bg-rose-100 text-[#8D3A4B] px-2 py-0.5 rounded-full font-bold">
                  Online
                </span>
              </button>
            )}
            <button
              onClick={() => scrollToSection('servicos')}
              className="text-left py-2 border-b border-[#F0DCD7] flex items-center justify-between"
            >
              <span>Serviços & Tabela de Preços</span>
              <Sparkles className="w-4 h-4 text-[#8D3A4B]" />
            </button>
            <button
              onClick={() => scrollToSection('especialistas')}
              className="text-left py-2 border-b border-[#F0DCD7]"
            >
              Nossas Especialistas (Flavia & Yasmin)
            </button>
            <button
              onClick={() => scrollToSection('fotos')}
              className="text-left py-2 border-b border-[#F0DCD7] flex items-center justify-between"
            >
              <span>Fotos do Salão & Resultados</span>
              <Camera className="w-4 h-4 text-[#8D3A4B]" />
            </button>
            <button
              onClick={() => scrollToSection('experiencia')}
              className="text-left py-2 border-b border-[#F0DCD7]"
            >
              Espaço & Comodidades
            </button>
            <button
              onClick={() => scrollToSection('avaliacoes')}
              className="text-left py-2 border-b border-[#F0DCD7]"
            >
              Depoimentos de Clientes
            </button>
            <button
              onClick={() => scrollToSection('localizacao')}
              className="text-left py-2 flex items-center justify-between"
            >
              <span>Endereço & Horários</span>
              <MapPin className="w-4 h-4 text-[#8D3A4B]" />
            </button>
          </div>

          <div className="pt-2 border-t border-[#EED7D2] flex gap-2">
            <a
              href={`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encodeURIComponent('Olá! Gostaria de informações do salão Toque da Beleza.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chamar no WhatsApp</span>
            </a>
            <a
              href={`tel:${SALON_INFO.phone.replace(/\D/g, '')}`}
              className="px-3.5 py-2.5 bg-[#F3E5E2] text-[#64343F] text-xs font-semibold rounded-xl flex items-center justify-center"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
