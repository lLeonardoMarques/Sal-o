import React from 'react';
import { PROFESSIONALS } from '../data/salonData';
import { Professional } from '../types';
import { Sparkles, Star, Calendar, Award } from 'lucide-react';

interface SpecialistsSectionProps {
  onSelectProfessional: (professional: Professional) => void;
}

export const SpecialistsSection: React.FC<SpecialistsSectionProps> = ({
  onSelectProfessional,
}) => {
  return (
    <section id="especialistas" className="py-12 sm:py-16 bg-[#FDF9F8] border-y border-[#EED7D2]/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3DCD7] text-[#803846] text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5 text-[#B35A6C]" />
            <span>Nossa Equipe de Especialistas</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#3D1A22] font-semibold tracking-tight mb-3">
            Conheça Nossas Profissionais
          </h2>
          <p className="text-sm sm:text-base text-[#6E545B]">
            Cuidado artesanal, pontualidade e consultoria personalizada com quem entende da sua beleza e bem-estar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {PROFESSIONALS.map((pro) => (
            <div
              key={pro.id}
              className="bg-white rounded-3xl p-6 border border-[#ECD0CA] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative mb-4 overflow-hidden rounded-2xl aspect-4/3 sm:aspect-16/10">
                  <img
                    src={pro.photoUrl}
                    alt={pro.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-amber-700 flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{pro.rating}</span>
                    <span className="text-[#8C6971] text-[10px] font-normal">
                      ({pro.reviewsCount})
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#4E242C]/85 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-semibold text-rose-100 flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="w-3 h-3 text-rose-200" />
                    <span>{pro.id === 'flavia-cabeleireira' ? 'Especialista em Cabelos' : 'Especialista em Massagens'}</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-serif-luxury font-bold text-2xl text-[#3D1A22]">
                    {pro.name}
                  </h3>
                  <span className="text-xs font-semibold text-[#8C3A4B]">
                    {pro.id === 'flavia-cabeleireira' ? 'Cabeleireira' : 'Massagista'}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#7D4F5A] mb-2">{pro.role}</p>
                <p className="text-xs text-[#6C555C] leading-relaxed mb-4">{pro.bio}</p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {pro.specialties.map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-[#FAF1EF] text-[#693944] border border-[#EED7D2]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectProfessional(pro)}
                className="w-full py-3 px-4 bg-[#7D3342] hover:bg-[#682633] text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Agendar com {pro.name}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
