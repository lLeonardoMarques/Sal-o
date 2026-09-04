import React from 'react';
import { Calendar, Sparkles, Star, MessageCircle, ShieldCheck, Clock, MapPin } from 'lucide-react';
import interiorImg from '../assets/images/salon_interior_1788544255699.jpg';
import hairImg from '../assets/images/hair_styling_beauty_1788544268410.jpg';
import { SALON_INFO } from '../data/salonData';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onExploreServices }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 md:pt-12 md:pb-16 bg-gradient-to-b from-[#FAF6F5] via-[#F6ECE8] to-[#FAF6F5]">
      {/* Delicate background ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F3D5D0]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#E8A598]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Location & Prestige Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#E9C7C0] shadow-sm text-xs text-[#7A3442] mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#B35A6C]" />
              <span className="font-semibold tracking-wide uppercase text-[10px] sm:text-xs">
                Vila Olímpia • São Paulo
              </span>
              <span className="text-[#CFA49D]">•</span>
              <span className="font-medium text-[#8C5862]">Agendamento 100% Online</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.12] text-[#3E1C24] font-medium tracking-tight mb-4">
              A harmonia perfeita entre{' '}
              <span className="font-normal italic text-[#9B4556]">estilo, cuidado</span>{' '}
              e a sua essência.
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-[#61494F] leading-relaxed max-w-xl mx-auto lg:mx-0 mb-6 font-normal">
              Inspirado no conceito do IT Salão, o <strong>Toque da Beleza</strong> oferece uma experiência de estética de alto padrão: especialistas em mechas, selagem térmica, estética facial e nail design com confirmação instantânea no seu WhatsApp.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-8">
              <button
                id="hero-book-now-btn"
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-[#7D3342] via-[#8C3A4B] to-[#994758] hover:from-[#6B2835] hover:to-[#843A49] rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer transform active:scale-98 group"
              >
                <Calendar className="w-4 h-4 text-[#FDECE9] group-hover:scale-110 transition-transform" />
                <span>Agendar Horário Online</span>
              </button>

              <button
                id="hero-explore-btn"
                onClick={onExploreServices}
                className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-semibold text-[#663540] bg-white hover:bg-[#FDF9F8] border border-[#E7CAC4] rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ver Serviços & Valores</span>
              </button>
            </div>

            {/* Micro badges & WhatsApp reassurance */}
            <div className="pt-4 border-t border-[#EBCECA]/80 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs sm:text-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9 / 5.0</span>
                </div>
                <span className="text-[11px] text-[#7E656B] mt-0.5">+1.280 avaliações</span>
              </div>

              <div className="flex flex-col border-l border-[#EBCECA] pl-2 sm:pl-4">
                <div className="flex items-center gap-1 text-[#4A2E35] font-semibold text-xs sm:text-sm">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </div>
                <span className="text-[11px] text-[#7E656B] mt-0.5">Lembrete & Confirmação</span>
              </div>

              <div className="flex flex-col border-l border-[#EBCECA] pl-2 sm:pl-4">
                <div className="flex items-center gap-1 text-[#4A2E35] font-semibold text-xs sm:text-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8D3A4B]" />
                  <span>Vila Olímpia</span>
                </div>
                <span className="text-[11px] text-[#7E656B] mt-0.5">Valet cortesia no local</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composite Card */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative halo */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#E6B0A8]/40 via-[#F3D5D0]/30 to-[#FAF6F5]/10 rounded-3xl blur-lg" />

              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/60 bg-white">
                <img
                  src={interiorImg}
                  alt="Espaço Toque da Beleza na Vila Olímpia"
                  className="w-full h-64 sm:h-72 object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid preview badge */}
                <div className="p-4 sm:p-5 bg-gradient-to-b from-white/95 to-[#FCF8F7] border-t border-[#F0D8D3]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={hairImg}
                        alt="Especialista em Mechas e Estética"
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#E7CAC4] shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xs font-semibold text-[#48232B]">
                          Atendimento Personalizado
                        </h4>
                        <p className="text-[11px] text-[#7D5F66]">
                          Kérastase, L'Oréal & Visagismo sob medida
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={onOpenBooking}
                      className="px-3 py-1.5 bg-[#FAF1EF] text-[#8D3A4B] hover:bg-[#F3E2DE] text-[11px] font-bold rounded-lg border border-[#E9C8C2] transition-colors cursor-pointer"
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Floating Pill on mobile/desktop */}
              <div className="absolute -top-3 -right-2 sm:-right-4 bg-white px-3.5 py-1.5 rounded-full shadow-md border border-[#E8CAC4] flex items-center gap-2 text-xs font-semibold text-[#502831]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Horários disponíveis hoje</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
