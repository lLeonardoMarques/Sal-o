import React from 'react';
import { SALON_INFO, CLIENT_REVIEWS } from '../data/salonData';
import { Sparkles, CheckCircle2, Star, Coffee, Car, Wifi, ShieldCheck, HeartHandshake, MessageCircle } from 'lucide-react';
import interiorImg from '../assets/images/salon_interior_1788544255699.jpg';
import hairImg from '../assets/images/hair_styling_beauty_1788544268410.jpg';

interface SalonExperienceProps {
  onOpenBooking: () => void;
}

export const SalonExperience: React.FC<SalonExperienceProps> = ({ onOpenBooking }) => {
  const amenityIcons = [
    Car,
    Coffee,
    Wifi,
    ShieldCheck,
    HeartHandshake,
    Sparkles,
  ];

  return (
    <section id="experiencia" className="py-12 sm:py-16 bg-[#FAF6F5] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Salon Experience & Amenities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3DCD7] text-[#803846] text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#B35A6C]" />
              <span>Conceito & Conforto</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#3D1A22] font-semibold tracking-tight mb-4">
              Mais que um salão, um refúgio de autocuidado na Vila Olímpia
            </h2>

            <p className="text-sm sm:text-base text-[#684F56] leading-relaxed mb-6 font-normal">
              Criamos uma atmosfera onde cada detalhe foi planejado para o seu relaxamento absoluto. Desde o estacionamento com manobrista gratuito até o menu exclusivo de cafés especiais e espumante, proporcionamos um atendimento pontual e acolhedor.
            </p>

            {/* Amenities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {SALON_INFO.amenities.map((amenity, idx) => {
                const Icon = amenityIcons[idx % amenityIcons.length];
                return (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-[#ECD0CA] flex items-center gap-2.5 shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF1EF] text-[#8C3A4B] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-[#482830] leading-snug">
                      {amenity}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onOpenBooking}
              className="px-6 py-3 bg-[#7D3342] hover:bg-[#682633] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Vivenciar a Experiência Toque da Beleza
            </button>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#E9CBC4]">
              <img
                src={interiorImg}
                alt="Ambiente sofisticado do Salão Toque da Beleza"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#260E14]/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-xs uppercase tracking-widest text-rose-200 font-medium">
                    Unidade Vila Olímpia
                  </span>
                  <p className="font-serif-luxury text-xl sm:text-2xl font-bold mt-0.5">
                    Ambiente intimista e climatizado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Reviews Section */}
        <div id="avaliacoes" className="pt-6 border-t border-[#EED7D2]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#3D1A22] mb-1">
              O que nossas clientes dizem
            </h3>
            <p className="text-xs sm:text-sm text-[#70565D]">
              Avaliação 4.9/5 estrelas baseada em mais de 1.280 atendimentos realizados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CLIENT_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-5 border border-[#ECD0CA] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-[#523A40] italic leading-relaxed mb-4">
                    "{review.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-[#F5E6E3]">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#E9C7C0]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="font-semibold text-xs text-[#3E1C24]">{review.name}</h5>
                    <p className="text-[10px] text-[#8C3A4B]">{review.service}</p>
                    <span className="text-[10px] text-[#9A7D84]">{review.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp Direct Help Banner */}
          <div className="mt-10 p-5 sm:p-6 bg-gradient-to-r from-[#F7ECE9] to-[#FDF4F2] rounded-3xl border border-[#EAC6BF] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-[#401C24]">
                  Dúvidas sobre qual procedimento escolher?
                </h4>
                <p className="text-xs text-[#6F535B]">
                  Fale diretamente com nossa consultora de atendimento no WhatsApp em tempo real.
                </p>
              </div>
            </div>

            <a
              href={`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encodeURIComponent('Olá! Gostaria de falar com a consultora do Toque da Beleza para tirar uma dúvida sobre os serviços.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chamar Consultora no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
