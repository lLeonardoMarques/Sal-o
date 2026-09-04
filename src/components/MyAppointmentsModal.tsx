import React from 'react';
import { X, Calendar, Clock, MessageCircle, CalendarCheck, AlertTriangle, Trash2, ArrowRight } from 'lucide-react';
import { Booking } from '../types';
import { formatCurrency, formatDateBR, getDayOfWeekName, getSalonWhatsAppUrl, getGoogleCalendarUrl } from '../utils/whatsapp';

interface MyAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onOpenNewBooking: () => void;
}

export const MyAppointmentsModal: React.FC<MyAppointmentsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onOpenNewBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FAF6F5] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#ECD0CA] overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#ECD0CA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#FAF1EF] border border-[#E9C7C0] flex items-center justify-center text-[#8C3A4B]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-lg sm:text-xl text-[#3E1C24] leading-tight">
                Meus Agendamentos
              </h3>
              <p className="text-[11px] text-[#7A5D64]">
                Histórico e reservas ativas no seu dispositivo
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-14 h-14 rounded-full bg-[#FAF1EF] border border-[#EAC4BC] flex items-center justify-center text-[#8C3A4B] mx-auto mb-3">
                <Calendar className="w-7 h-7" />
              </div>
              <h4 className="font-serif-luxury text-lg font-bold text-[#3E1C24] mb-1">
                Nenhum agendamento encontrado
              </h4>
              <p className="text-xs text-[#7A5D64] max-w-sm mx-auto mb-5 leading-relaxed">
                Você ainda não realizou agendamentos neste navegador. Escolha um de nossos serviços exclusivos e reserve em poucos segundos.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenNewBooking();
                }}
                className="px-5 py-2.5 bg-[#7D3342] hover:bg-[#6A2937] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
              >
                <span>Agendar Meu Primeiro Horário</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const isCancelled = booking.status === 'cancelled';

                return (
                  <div
                    key={booking.id}
                    className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
                      isCancelled
                        ? 'border-gray-200 opacity-60'
                        : 'border-[#EBD0CB] shadow-xs hover:border-[#DDAFA6]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-[#F6EBE8] pb-3 mb-3">
                      <div>
                        <span className="text-[10px] font-mono text-[#8C3A4B] font-bold">
                          #{booking.id}
                        </span>
                        <h4 className="font-semibold text-sm text-[#3E1C24] mt-0.5">
                          {booking.services.map((s) => s.name).join(' + ')}
                        </h4>
                        <p className="text-xs text-[#7A5D64]">
                          Com <strong>{booking.professional.name}</strong>
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isCancelled
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isCancelled ? 'Cancelado' : 'Confirmado'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#523239] mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#8C3A4B]" />
                        <span>
                          {formatDateBR(booking.date)} ({getDayOfWeekName(booking.date).slice(0, 3)})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#8C3A4B]" />
                        <span>
                          {booking.time} ({booking.totalDurationMinutes} min)
                        </span>
                      </div>

                      <div className="col-span-2 pt-1 font-medium text-[#7D3845]">
                        Total: {formatCurrency(booking.totalPrice)} • Cliente: {booking.clientName}
                      </div>
                    </div>

                    {/* Actions */}
                    {!isCancelled && (
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F6EBE8]">
                        {/* Open WhatsApp Confirmation */}
                        <a
                          href={getSalonWhatsAppUrl(booking)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>WhatsApp</span>
                        </a>

                        {/* Calendar */}
                        <a
                          href={getGoogleCalendarUrl(booking)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 bg-[#FAF1EF] hover:bg-[#F2E0DC] text-[#663540] text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors"
                        >
                          <CalendarCheck className="w-3.5 h-3.5 text-[#8C3A4B]" />
                          <span>Google Agenda</span>
                        </a>

                        {/* Cancel button */}
                        <button
                          onClick={() => {
                            if (window.confirm('Deseja realmente cancelar este agendamento?')) {
                              onCancelBooking(booking.id);
                            }
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Cancelar agendamento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#ECD0CA] flex items-center justify-between">
          <span className="text-xs text-[#7A5D64]">
            {bookings.filter((b) => b.status === 'confirmed').length} agendamento(s) ativo(s)
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenNewBooking();
            }}
            className="px-4 py-2 bg-[#7D3342] hover:bg-[#682633] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Novo Agendamento
          </button>
        </div>
      </div>
    </div>
  );
};
