import { Booking, ServiceItem } from '../types';
import { SALON_INFO } from '../data/salonData';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function cleanPhone(value: string): string {
  let cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 10 || cleaned.length === 11) {
    if (!cleaned.startsWith('55')) {
      cleaned = '55' + cleaned;
    }
  }
  return cleaned;
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function getDayOfWeekName(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return days[date.getDay()];
}

/**
 * Creates the formatted WhatsApp message for booking confirmation
 */
export function buildWhatsAppMessage(booking: Booking): string {
  const servicesList = booking.services
    .map((s) => `• *${s.name}* (${s.durationMinutes}min - ${formatCurrency(s.price)})`)
    .join('\n');

  const professionalName = booking.professional?.name || 'Qualquer Especialista Disponível';

  return `✨ *AGENDAMENTO - TOQUE DA BELEZA* ✨
_Salão de Estética & Bem-Estar_

Olá! Gostaria de confirmar meu agendamento online:

📋 *Código da Reserva:* #${booking.id.toUpperCase()}
👤 *Cliente:* ${booking.clientName}
📱 *Telefone:* ${booking.clientPhone}
${booking.clientEmail ? `📧 *E-mail:* ${booking.clientEmail}\n` : ''}
📅 *Data:* ${formatDateBR(booking.date)} (${getDayOfWeekName(booking.date)})
⏰ *Horário:* ${booking.time}
⏱️ *Duração Estimada:* ${booking.totalDurationMinutes} minutos

💆‍♀️ *Serviço(s) Selecionado(s):*
${servicesList}

✨ *Profissional:* ${professionalName}
💰 *Valor Total:* *${formatCurrency(booking.totalPrice)}*
${booking.notes ? `\n📝 *Observações:* ${booking.notes}` : ''}

📍 *Endereço:* ${SALON_INFO.address}, ${SALON_INFO.city}
☕ *Cortesia:* Valet com manobrista gratuito, café e espumante.

Aguardo a confirmação da equipe. Muito obrigada!`;
}

/**
 * Generates WhatsApp URL targeting the salon's reception number
 */
export function getSalonWhatsAppUrl(booking: Booking): string {
  const text = encodeURIComponent(buildWhatsAppMessage(booking));
  return `https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${text}`;
}

/**
 * Generates WhatsApp URL targeting the client's own number with their reminder
 */
export function getClientReminderWhatsAppUrl(booking: Booking): string {
  const clientClean = cleanPhone(booking.clientPhone);
  const text = encodeURIComponent(buildWhatsAppMessage(booking));
  return `https://api.whatsapp.com/send?phone=${clientClean}&text=${text}`;
}

/**
 * Generate Google Calendar Link
 */
export function getGoogleCalendarUrl(booking: Booking): string {
  const [year, month, day] = booking.date.split('-');
  const [hours, minutes] = booking.time.split(':');

  const startDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
  const endDate = new Date(startDate.getTime() + booking.totalDurationMinutes * 60000);

  const formatISO = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const title = encodeURIComponent(`Toque da Beleza - ${booking.services.map(s => s.name).join(', ')}`);
  const details = encodeURIComponent(
    `Agendamento no Toque da Beleza Salão de Estética\nProfissional: ${booking.professional.name}\nValor: ${formatCurrency(booking.totalPrice)}\nCódigo: #${booking.id}`
  );
  const location = encodeURIComponent(`${SALON_INFO.name}, ${SALON_INFO.address}, ${SALON_INFO.city}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatISO(startDate)}/${formatISO(endDate)}&details=${details}&location=${location}`;
}

// LocalStorage helpers for saved client bookings
const STORAGE_KEY = 'toque_da_beleza_bookings';

export function getSavedBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveBooking(booking: Booking): void {
  try {
    const existing = getSavedBookings();
    const updated = [booking, ...existing.filter((b) => b.id !== booking.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving booking to localStorage:', err);
  }
}

export function cancelBookingInStorage(id: string): void {
  try {
    const existing = getSavedBookings();
    const updated = existing.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error cancelling booking:', err);
  }
}
