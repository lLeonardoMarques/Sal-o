import React, { useState, useMemo } from 'react';
import { ServiceCategory, ServiceItem } from '../types';
import { SERVICES } from '../data/salonData';
import { formatCurrency } from '../utils/whatsapp';
import { Clock, Search, Sparkles, Plus, Check, Filter, ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface ServiceCatalogProps {
  onSelectServiceToBook: (service: ServiceItem) => void;
  selectedServices?: ServiceItem[];
}

const CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: 'todos', label: 'Todos os Serviços' },
  { id: 'cabelos', label: 'Cabelos & Mechas' },
  { id: 'unhas', label: 'Unhas & Spa' },
  { id: 'estetica', label: 'Estética Facial' },
  { id: 'olhar', label: 'Cílios & Sobrancelhas' },
  { id: 'massagens', label: 'Massagens' },
  { id: 'masculino', label: 'Linha Masculina' },
];

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  onSelectServiceToBook,
  selectedServices = [],
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = useMemo(() => {
    return SERVICES.filter((service) => {
      const matchesCategory = activeCategory === 'todos' || service.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const isSelected = (serviceId: string) => {
    return selectedServices.some((s) => s.id === serviceId);
  };

  return (
    <section id="servicos" className="py-12 sm:py-16 bg-[#FAF6F5] relative transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3DCD7] text-[#803846] text-xs font-semibold mb-3">
            <Sparkles className="w-3 h-3 text-[#B35A6C]" />
            <span>Menu Exclusivo de Procedimentos</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#3D1A22] font-semibold tracking-tight mb-3">
            Serviços & Tabela de Preços
          </h2>
          <p className="text-sm sm:text-base text-[#6E545B] mb-5">
            Selecione o procedimento desejado para visualizar a duração média e garantir seu horário online com notificação pelo WhatsApp.
          </p>

          {/* Minimize / Expand Toggle Button */}
          <div className="flex justify-center">
            <button
              id="toggle-services-visibility-btn"
              onClick={() => setIsMinimized(!isMinimized)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D9AFAF] bg-white hover:bg-[#FAF0ED] text-[#7D3342] text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
              title={isMinimized ? 'Exibir catálogo de serviços' : 'Minimizar catálogo de serviços'}
            >
              {isMinimized ? (
                <>
                  <ChevronDown className="w-4 h-4 text-[#8C3A4B]" />
                  <span>Exibir Serviços ({SERVICES.length} procedimentos)</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-4 h-4 text-[#8C3A4B]" />
                  <span>Minimizar Serviços</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Minimized Placeholder View */}
        {isMinimized ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ECD0CA] text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF0ED] text-[#8C3A4B] flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#3E1C24] mb-1">
              Catálogo de Serviços Minimizado
            </h3>
            <p className="text-xs sm:text-sm text-[#70565D] mb-5 max-w-md mx-auto">
              A lista de procedimentos está recolhida para uma navegação mais ágil. Clique abaixo para abrir a tabela de preços ou agende diretamente.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setIsMinimized(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#7D3342] hover:bg-[#682633] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <ChevronDown className="w-4 h-4" />
                <span>Exibir Tabela de Serviços</span>
              </button>
              <button
                onClick={() => onSelectServiceToBook(SERVICES[0])}
                className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-[#FAF0ED] text-[#7D3342] border border-[#D9AFAF] rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Agendar Horário</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Search & Category Filter Bar */}
            <div className="mb-8 space-y-4">
              {/* Search bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="w-4 h-4 text-[#A87E87] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar serviço (ex: mechas, selagem, botox, cílios)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8CBC5] rounded-xl text-sm text-[#3E1C24] placeholder-[#A6888F] focus:outline-none focus:ring-2 focus:ring-[#8C3A4B]/30 focus:border-[#8C3A4B] shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9B6A75] hover:text-[#4A242C] font-medium"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Horizontal scrollable category pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center px-1">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#7D3342] text-white shadow-xs'
                          : 'bg-white text-[#5F4349] border border-[#EBD0CB] hover:bg-[#F8EFEB]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results grid */}
            {filteredServices.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#F0DCD7] max-w-md mx-auto p-6">
                <Filter className="w-8 h-8 text-[#B88791] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#48232B]">Nenhum serviço encontrado</p>
                <p className="text-xs text-[#7A6167] mt-1">
                  Tente buscar por outro termo ou limpar os filtros de categoria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('todos');
                  }}
                  className="mt-4 px-4 py-2 bg-[#F3DCD7] text-[#7D3342] text-xs font-semibold rounded-lg hover:bg-[#ECD0CA]"
                >
                  Ver todos os serviços
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredServices.map((service) => {
                  const selected = isSelected(service.id);
                  return (
                    <div
                      key={service.id}
                      className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between ${
                        selected
                          ? 'border-[#8C3A4B] shadow-md ring-1 ring-[#8C3A4B]'
                          : 'border-[#ECD0CA]/80 hover:border-[#DFB8B0] shadow-xs hover:shadow-sm'
                      }`}
                    >
                      <div>
                        {/* Header with tags and price */}
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {service.highlight && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F9ECE9] text-[#8C3A4B] border border-[#E9C7C0]">
                                {service.highlight}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-[11px] text-[#7E656B] bg-[#FAF5F4] px-2 py-0.5 rounded-md border border-[#F0DDD9]">
                              <Clock className="w-3 h-3 text-[#A87E87]" />
                              {service.durationMinutes} min
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-serif-luxury font-bold text-lg sm:text-xl text-[#4A222B]">
                              {formatCurrency(service.price)}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-base sm:text-lg text-[#3B1921] leading-snug mb-2">
                          {service.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-[#6C555C] leading-relaxed mb-4">
                          {service.description}
                        </p>
                      </div>

                      {/* Footer Action */}
                      <div className="pt-3 border-t border-[#F5E7E4] flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#93757C]">
                          Confirmação via WhatsApp
                        </span>

                        <button
                          onClick={() => onSelectServiceToBook(service)}
                          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            selected
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-[#7D3342] hover:bg-[#682633] text-white shadow-xs'
                          }`}
                        >
                          {selected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Selecionado</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Agendar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick bottom collapse button for convenience */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setIsMinimized(true);
                  const el = document.getElementById('servicos');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#8C3A4B] hover:text-[#5F2330] font-medium py-1 px-3 rounded-full hover:bg-[#F5E6E3] transition-colors"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Minimizar lista de serviços</span>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
