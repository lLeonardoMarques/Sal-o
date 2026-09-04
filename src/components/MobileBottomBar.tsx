import React from 'react';
import { Calendar, Clock, MessageCircle, Sparkles, UserCheck } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

interface MobileBottomBarProps {
  onOpenBooking: () => void;
  onOpenMyAppointments: () => void;
  activeCount: number;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  onOpenBooking,
  onOpenMyAppointments,
  activeCount,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#EBD0CB] px-3 py-2 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Serviços */}
        <button
          onClick={() => scrollTo('servicos')}
          className="flex flex-col items-center justify-center p-1 text-[#6F4F56] hover:text-[#8C3A4B] transition-colors cursor-pointer"
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Serviços</span>
        </button>

        {/* Especialistas */}
        <button
          onClick={() => scrollTo('especialistas')}
          className="flex flex-col items-center justify-center p-1 text-[#6F4F56] hover:text-[#8C3A4B] transition-colors cursor-pointer"
        >
          <UserCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Equipe</span>
        </button>

        {/* Center Elevated CTA - Agendar */}
        <button
          id="mobile-bar-book-btn"
          onClick={onOpenBooking}
          className="relative -top-3.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#7D3342] to-[#994758] text-white shadow-lg border-2 border-white flex items-center gap-1.5 cursor-pointer transform active:scale-95 transition-transform"
        >
          <Calendar className="w-4 h-4" />
          <span className="text-xs font-bold whitespace-nowrap">Agendar</span>
        </button>

        {/* Meus Horários */}
        <button
          onClick={onOpenMyAppointments}
          className="relative flex flex-col items-center justify-center p-1 text-[#6F4F56] hover:text-[#8C3A4B] transition-colors cursor-pointer"
        >
          <Clock className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Horários</span>
          {activeCount > 0 && (
            <span className="absolute 0 top-0.5 right-2 w-4 h-4 rounded-full bg-[#8C3A4B] text-white text-[9px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre os serviços do Toque da Beleza.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-1 text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <MessageCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
