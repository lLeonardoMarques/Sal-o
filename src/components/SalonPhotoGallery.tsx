import React, { useState } from 'react';
import { Camera, ChevronDown, ChevronUp, Sparkles, X, ZoomIn } from 'lucide-react';
import interiorImg from '../assets/images/salon_interior_1788544255699.jpg';
import hairImg from '../assets/images/hair_styling_beauty_1788544268410.jpg';

interface PhotoItem {
  id: string;
  title: string;
  category: 'espaco' | 'cabelos' | 'massagens' | 'mimos';
  tag: string;
  url: string;
  description: string;
}

const GALLERY_PHOTOS: PhotoItem[] = [
  {
    id: 'salao-interior',
    title: 'Ambiente Principal & Estações de Atendimento',
    category: 'espaco',
    tag: 'Espaço Vila Olímpia',
    url: interiorImg,
    description: 'Estações individuais com iluminação neutra para fidelidade de cor e conforto térmico.',
  },
  {
    id: 'flavia-cabelos',
    title: 'Finalização & Selagem Térmica por Flavia',
    category: 'cabelos',
    tag: 'Trabalhos da Flavia',
    url: hairImg,
    description: 'Alinhamento com brilho espelhado, toque aveludado e preservação total da saúde capilar.',
  },
  {
    id: 'massoterapia-yasmin',
    title: 'Sala Sensorial de Massoterapia por Yasmin',
    category: 'massagens',
    tag: 'Espaço da Yasmin',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'Maca aquecida, cromoterapia, óleos essenciais puros e ceras vegetais para relaxamento completo.',
  },
  {
    id: 'lavatorios-conforto',
    title: 'Espaço Lavatórios & Tratamentos Kérastase',
    category: 'espaco',
    tag: 'Lavatórios Relax',
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    description: 'Poltronas anatômicas reclináveis com massagem integrada durante a lavagem e hidratação.',
  },
  {
    id: 'morena-iluminada-flavia',
    title: 'Mechas & Morena Iluminada Natural',
    category: 'cabelos',
    tag: 'Colorimetria Flavia',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    description: 'Tons quentes e avelãs personalizados de acordo com o contraste pessoal de cada cliente.',
  },
  {
    id: 'bar-mimos',
    title: 'Bar Cortesia: Cafés Gourmet & Espumante',
    category: 'mimos',
    tag: 'Mimos Exclusivos',
    url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    description: 'Cardápio de boas-vindas com cappuccino especial, chás florais e espumante brut gelado.',
  },
];

export const SalonPhotoGallery: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  return (
    <section id="fotos" className="py-12 sm:py-16 bg-[#FDF8F7] border-b border-[#EED7D2]/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header with Title and Toggle Button */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3DCD7] text-[#803846] text-xs font-semibold mb-3">
            <Camera className="w-3.5 h-3.5 text-[#B35A6C]" />
            <span>Galeria Fotográfica</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#3D1A22] font-semibold tracking-tight mb-3">
            Fotos do Espaço & Resultados
          </h2>
          <p className="text-sm sm:text-base text-[#6E545B] mb-5">
            Conheça de perto nosso ambiente intimista na Vila Olímpia, a sala de massagem da Yasmin e os resultados capilares da Flavia.
          </p>

          {/* Minimize / Expand Toggle Button */}
          <div className="flex justify-center">
            <button
              id="toggle-photos-visibility-btn"
              onClick={() => setIsMinimized(!isMinimized)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D9AFAF] bg-white hover:bg-[#FAF0ED] text-[#7D3342] text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
              title={isMinimized ? 'Exibir fotos do salão' : 'Minimizar fotos do salão'}
            >
              {isMinimized ? (
                <>
                  <ChevronDown className="w-4 h-4 text-[#8C3A4B]" />
                  <span>Exibir Fotos ({GALLERY_PHOTOS.length} imagens)</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-4 h-4 text-[#8C3A4B]" />
                  <span>Minimizar Fotos</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Minimized View */}
        {isMinimized ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECD0CA] text-center max-w-2xl mx-auto shadow-xs">
            {/* Small image preview thumbnails */}
            <div className="flex justify-center -space-x-3 mb-4">
              {GALLERY_PHOTOS.slice(0, 4).map((item, idx) => (
                <img
                  key={idx}
                  src={item.url}
                  alt={item.title}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs"
                  referrerPolicy="no-referrer"
                />
              ))}
              <div className="w-14 h-14 rounded-2xl bg-[#FAF0ED] border-2 border-white text-[#7D3342] flex items-center justify-center text-xs font-bold shadow-xs">
                +{GALLERY_PHOTOS.length - 4}
              </div>
            </div>

            <h3 className="font-serif-luxury text-xl font-bold text-[#3E1C24] mb-1">
              Galeria de Fotos Minimizada
            </h3>
            <p className="text-xs sm:text-sm text-[#70565D] mb-5 max-w-md mx-auto">
              As fotos do espaço físico e dos procedimentos estão recolhidas. Clique para expandir e ver todas as imagens em alta resolução.
            </p>

            <button
              onClick={() => setIsMinimized(false)}
              className="px-5 py-2.5 bg-[#7D3342] hover:bg-[#682633] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <ChevronDown className="w-4 h-4" />
              <span>Exibir Galeria Completa ({GALLERY_PHOTOS.length} fotos)</span>
            </button>
          </div>
        ) : (
          <>
            {/* Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {GALLERY_PHOTOS.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#EBD0CB] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-xs font-medium flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5 text-rose-200" /> Clique para ampliar
                      </span>
                    </div>
                    <span className="absolute top-3 left-3 bg-[#3E1A22]/85 backdrop-blur-xs text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                      {photo.tag}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-serif-luxury font-bold text-base text-[#3D1A22] leading-snug mb-1">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-[#70555C] leading-relaxed">
                      {photo.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick bottom minimize button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setIsMinimized(true);
                  const el = document.getElementById('fotos');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#8C3A4B] hover:text-[#5F2330] font-medium py-1 px-3 rounded-full hover:bg-[#F5E6E3] transition-colors"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Minimizar fotos</span>
              </button>
            </div>
          </>
        )}

        {/* Modal Lightbox for Fullscreen Photo View */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full border border-[#ECD0CA] shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[65vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain max-h-[65vh]"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-5 sm:p-6 bg-[#FAF6F5]">
                <div className="inline-block bg-[#F3DCD7] text-[#803846] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1.5">
                  {selectedPhoto.tag}
                </div>
                <h4 className="font-serif-luxury text-xl font-bold text-[#3E1C24] mb-1">
                  {selectedPhoto.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#6C535A] leading-relaxed">
                  {selectedPhoto.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
