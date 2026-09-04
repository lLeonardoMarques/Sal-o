import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  MessageCircle,
  Calendar,
  RotateCcw,
  Minimize2,
  Maximize2,
  Clock,
  Heart,
} from 'lucide-react';
import { ChatMessage, sendBellaMessage } from '../services/bellaChat';
import { SALON_INFO } from '../data/salonData';

interface BellaChatModalProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenBooking: () => void;
}

const INITIAL_BELLA_MESSAGE: ChatMessage = {
  id: 'welcome-bella',
  sender: 'bella',
  text: 'Oi! 🌸 Eu sou a Bella, sua consultora de beleza e bem-estar do Toque da Beleza! 💖\n\nEstou aqui para tirar qualquer dúvida sobre nossos procedimentos (cabelos, unhas, estética, massagens), valores, dicas de cuidados ou te ajudar a escolher o tratamento ideal. Como posso te ajudar hoje? ✨',
  timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
};

const SUGGESTIONS = [
  'Diferença entre Selagem e Botox',
  'Como funciona a Morena Iluminada?',
  'Quais os horários de funcionamento?',
  'Quanto tempo dura um Spa dos Pés?',
  'Quero dicas para cuidar do cabelo',
];

export const BellaChatModal: React.FC<BellaChatModalProps> = ({
  isOpen,
  onToggle,
  onOpenBooking,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('bella_chat_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [INITIAL_BELLA_MESSAGE];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasNewBadge, setHasNewBadge] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem('bella_chat_history', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasNewBadge(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      const replyText = await sendBellaMessage(messageText, newHistory);
      const bellaMsg: ChatMessage = {
        id: `bella-${Date.now()}`,
        sender: 'bella',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, bellaMsg]);
      if (!isOpen) {
        setHasNewBadge(true);
      }
    } catch (error) {
      console.error('Failed to get Bella response', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_BELLA_MESSAGE]);
  };

  // Format response text with basic bolding, paragraphs and bullet points
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Check if bullet point
      const isBullet = line.trim().startsWith('-') || line.trim().startsWith('*');
      const cleanLine = isBullet ? line.trim().substring(1).trim() : line;

      // Handle **bold**
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const formattedContent = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-[#48232B]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5">
            <span className="text-[#8C3A4B] font-bold text-xs mt-0.5">•</span>
            <span>{formattedContent}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="my-0.5">
          {formattedContent}
        </p>
      );
    });
  };

  return (
    <>
      {/* Discrete Floating Trigger (Mobile and Desktop) */}
      {!isOpen && (
        <button
          id="bella-ai-floating-trigger"
          onClick={onToggle}
          aria-label="Conversar com a Bella, assistente virtual"
          className="fixed bottom-16 sm:bottom-20 right-3 sm:right-6 z-40 group flex items-center gap-2.5 bg-gradient-to-r from-[#7D3342] via-[#8C3A4B] to-[#994758] text-white p-2.5 sm:px-4 sm:py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 border border-rose-200/30 cursor-pointer backdrop-blur-sm"
          title="Tirar dúvidas com a Bella (IA)"
        >
          <div className="relative flex items-center justify-center">
            {/* Bella Avatar Glow & Icon */}
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#FDEBE8] group-hover:rotate-12 transition-transform" />
            </div>
            {/* Pulsing online indicator */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#7D3342] animate-pulse" />
          </div>

          <div className="hidden sm:flex flex-col items-start text-left pr-1">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="text-xs font-bold tracking-wide text-white">Bella</span>
              <span className="text-[9px] uppercase tracking-wider bg-white/20 px-1.5 py-0.2 rounded-full font-semibold text-rose-100">
                IA
              </span>
            </div>
            <span className="text-[10px] text-rose-200/90 font-medium">Dúvidas & Dicas</span>
          </div>

          {hasNewBadge && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E8A598] rounded-full border-2 border-white animate-ping" />
          )}
        </button>
      )}

      {/* Bella Chat Popup / Drawer */}
      {isOpen && (
        <div
          id="bella-chat-modal"
          role="dialog"
          aria-label="Chat com Bella"
          className={`fixed z-50 transition-all duration-300 flex flex-col ${
            isExpanded
              ? 'inset-2 sm:inset-6 md:inset-10 lg:inset-16 max-w-4xl mx-auto rounded-2xl shadow-2xl bg-[#FCFAF9] border border-[#EBD0CB]'
              : 'bottom-0 right-0 sm:bottom-5 sm:right-5 w-full sm:w-[390px] h-[86vh] sm:h-[570px] max-h-[720px] rounded-t-2xl sm:rounded-2xl shadow-2xl bg-[#FCFAF9] border-t sm:border border-[#EBD0CB]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4E242C] via-[#65303B] to-[#7B3A48] text-white px-4 py-3 sm:py-3.5 rounded-t-2xl flex items-center justify-between border-b border-[#E8A598]/20 shadow-sm select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/25 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#FADAD4]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#4E242C] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-wide">Bella</h3>
                  <span className="text-[9px] px-1.5 py-0.5 bg-rose-200/20 text-rose-100 rounded-full font-semibold uppercase">
                    Assistente Virtual
                  </span>
                </div>
                <p className="text-[11px] text-rose-200/90 font-normal">
                  Toque da Beleza • Respostas instantâneas
                </p>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1 text-rose-200">
              {/* Clear chat history */}
              <button
                onClick={handleClearHistory}
                title="Reiniciar conversa"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Reiniciar conversa"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Expand / Minimize (desktop only) */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Reduzir janela' : 'Expandir janela'}
                className="hidden sm:flex p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Expandir ou reduzir"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                onClick={onToggle}
                title="Fechar conversa com Bella"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Quick Action Subbar: Instant Book / WhatsApp */}
          <div className="bg-[#F6EBE8] px-3.5 py-2 border-b border-[#EED7D2] flex items-center justify-between text-xs text-[#5D3740]">
            <span className="flex items-center gap-1 font-medium text-[11px]">
              <Heart className="w-3 h-3 text-[#8C3A4B] fill-[#8C3A4B]" />
              Aqui para cuidar de você
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onToggle();
                  onOpenBooking();
                }}
                className="text-[11px] font-semibold text-[#8C3A4B] hover:text-[#6E2A38] flex items-center gap-1 bg-white/70 hover:bg-white px-2 py-0.5 rounded-full border border-[#E4C7C0] transition-colors cursor-pointer"
              >
                <Calendar className="w-3 h-3" />
                <span>Agendar Horário</span>
              </button>
              <a
                href={`https://api.whatsapp.com/send?phone=${SALON_INFO.whatsappRaw}&text=${encodeURIComponent('Olá! Estava conversando com a Bella no site e gostaria de falar com uma atendente.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 transition-colors"
                title="Falar no WhatsApp"
              >
                <MessageCircle className="w-3 h-3" />
                <span className="hidden xs:inline">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#FAF6F5] to-[#F7F0EE]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#7D3342] to-[#8F3D4E] text-white rounded-br-xs'
                      : 'bg-white text-[#3C2A2E] border border-[#EBD0CB] rounded-bl-xs'
                  }`}
                >
                  {msg.sender === 'bella' ? (
                    <div className="space-y-1">{renderFormattedText(msg.text)}</div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
                <span className="text-[9px] text-[#9A7D84] mt-1 px-1 flex items-center gap-1">
                  {msg.sender === 'bella' && <Sparkles className="w-2.5 h-2.5 text-[#8C3A4B]" />}
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Bella Typing / Loading State */}
            {isLoading && (
              <div className="flex flex-col items-start animate-in fade-in duration-200">
                <div className="bg-white border border-[#EBD0CB] rounded-2xl rounded-bl-xs px-3.5 py-2.5 text-xs text-[#6F4F56] shadow-sm flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#8C3A4B] animate-spin" />
                  <span className="font-medium text-[11px]">Bella está digitando</span>
                  <div className="flex items-center gap-1 ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C3A4B] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C3A4B] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C3A4B] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="bg-[#FAF4F2] px-3 py-2 border-t border-[#EED7D2] overflow-x-auto no-scrollbar flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[#8A676F] font-bold shrink-0">
              Sugestões:
            </span>
            {SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSendMessage(item)}
                className="shrink-0 text-[11px] bg-white hover:bg-[#F3E5E2] text-[#653B44] border border-[#E5CAC3] hover:border-[#8C3A4B] px-2.5 py-1 rounded-full transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap active:scale-95"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-[#EED7D2] rounded-b-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Pergunte algo para a Bella..."
                disabled={isLoading}
                className="flex-1 bg-[#FAF6F5] border border-[#E4C8C1] focus:border-[#8C3A4B] focus:bg-white rounded-full px-4 py-2 text-xs sm:text-sm text-[#2C2426] placeholder-[#A4888E] outline-none transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-[#7D3342] to-[#994758] hover:from-[#6A2937] hover:to-[#843A49] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm shrink-0 active:scale-95"
                title="Enviar mensagem"
                aria-label="Enviar mensagem"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-1 text-center">
              <span className="text-[10px] text-[#A6888E]">
                Bella IA • Tire dúvidas sobre procedimentos e tratamentos
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
