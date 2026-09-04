import React from 'react';
import { Logo } from './Logo';
import { SALON_INFO } from '../data/salonData';
import { MapPin, Phone, MessageCircle, Clock, Instagram, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenMyAppointments: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenMyAppointments }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${SALON_INFO.address}, ${SALON_INFO.city}`
  )}`;

  return (
    <footer id="localizacao" className="bg-[#2D161C] text-[#F9EDE9] pt-12 pb-24 sm:pb-12 border-t border-[#46232B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-[#4A2630]">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" className="brightness-125" />
            <p className="text-xs sm:text-sm text-[#D7B6BC] leading-relaxed max-w-sm">
              {SALON_INFO.tagline}
            </p>
            <div className="pt-1 flex items-center gap-3">
              <a
                href={`https://instagram.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#46232B] hover:bg-[#5E2E3A] flex items-center justify-center text-[#F9EDE9] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-700 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#F2C0B8]">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs text-[#D7B6BC]">
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('servicos');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Serviços & Preços
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('especialistas');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Especialistas
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMyAppointments}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Meus Agendamentos
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-white transition-colors cursor-pointer text-[#F2C0B8] font-semibold"
                >
                  Agendamento Online
                </button>
              </li>
            </ul>
          </div>

          {/* Horários */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#F2C0B8] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Horário de Atendimento</span>
            </h4>
            <div className="space-y-1.5 text-xs text-[#D7B6BC]">
              {SALON_INFO.hours.map((h, i) => (
                <div key={i} className="flex items-center justify-between gap-2 border-b border-[#3F1E26] pb-1">
                  <span>{h.days}:</span>
                  <span className="text-[#F9EDE9] font-medium">{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Endereço & Contato */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#F2C0B8] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Localização & Contato</span>
            </h4>
            <p className="text-xs text-[#D7B6BC] leading-relaxed">
              {SALON_INFO.address}
              <br />
              {SALON_INFO.city} - CEP {SALON_INFO.cep}
              <br />
              <span className="text-emerald-300 font-medium">✦ Valet com manobrista gratuito</span>
            </p>

            <div className="space-y-1.5 pt-1 text-xs">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F2C0B8] hover:text-white transition-colors"
              >
                <span>Ver rota no Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="pt-2 flex flex-col gap-1 text-xs text-[#D7B6BC]">
                <a href={`tel:${SALON_INFO.phone.replace(/\D/g, '')}`} className="hover:text-white transition-colors flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#F2C0B8]" />
                  <span>{SALON_INFO.phone}</span>
                </a>
                <a
                  href={`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-400" />
                  <span>WhatsApp: {SALON_INFO.whatsappDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A6838B] gap-2">
          <p>© {new Date().getFullYear()} Toque da Beleza - Salão de Estética. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1 text-[#8C6972]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Atendimento seguro com confirmação via WhatsApp</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
