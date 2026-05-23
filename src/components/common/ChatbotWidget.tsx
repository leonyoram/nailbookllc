"use client";

import { MessageSquare, X, Send, Bot, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { processChat } from "@/actions/chat";

interface ChatbotWidgetProps {
  tenant: any;
}

export function ChatbotWidget({ tenant }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<{role: 'bot'|'user', text: string}[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tenant?.chatbotConfig) {
      try {
        setConfig(typeof tenant.chatbotConfig === 'string' ? JSON.parse(tenant.chatbotConfig) : tenant.chatbotConfig);
      } catch (e) {
        console.error("Failed to parse chatbot config", e);
      }
    }
  }, [tenant]);

  useEffect(() => {
    if (isOpen && config && chatHistory.length === 0) {
      setChatHistory([{ role: 'bot', text: config.welcomeMessage || "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?" }]);
    }
  }, [isOpen, config]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isOpen, isLoading]);

  if (!tenant?.chatbotEnabled || !config) return null;

  const defaultFaq = [
    { q: "Tôi muốn đặt lịch", a: "Tuyệt vời! Bạn có thể sử dụng tính năng Đặt lịch trên website hoặc để lại số điện thoại, nhân viên sẽ liên hệ lại nha." },
    { q: "Giá dịch vụ thế nào?", a: "Giá dịch vụ phụ thuộc vào yêu cầu cụ thể. Bạn vui lòng xem bảng giá trên web nhé." },
    { q: "Giờ mở cửa", a: "Tiệm mở cửa từ 9:00 AM đến 8:00 PM mỗi ngày." }
  ];

  const faq = config.faq || defaultFaq;

  const handleOpenBot = () => {
    setIsOpen(!isOpen);
  };

  const handleQuestionClick = async (item: any) => {
    setChatHistory(prev => [
      ...prev,
      { role: 'user', text: item.q },
      { role: 'bot', text: item.a }
    ]);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage.trim();
    setInputMessage("");
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await processChat(tenant.id, userMsg);
      if (response.success && response.reply) {
        setChatHistory(prev => [...prev, { role: 'bot', text: response.reply }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'bot', text: response.reply || "Xin lỗi, tôi đang gặp lỗi kết nối." }]);
      }
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'bot', text: "Xin lỗi, hiện tại tôi không thể trả lời. Vui lòng thử lại sau." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLiveChat = () => {
    if (config.type === 'whatsapp') {
      const phone = config.value?.replace(/[^0-9]/g, '');
      if (phone) window.open(`https://wa.me/${phone}`, '_blank');
    } else if (config.type === 'messenger') {
      const url = `https://m.me/${config.value}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 sm:w-96 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col h-[500px] max-h-[80vh]">
          {/* Header */}
          <div className="p-4 bg-primary text-white flex justify-between items-center shadow-md z-10 shrink-0">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <div>
                <div className="font-bold text-sm">{tenant.name || "Chatbot AI"}</div>
                <div className="text-[10px] text-white/80">Trợ lý ảo 24/7</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-md transition-colors">
              <X size={18} />
            </button>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 flex-col flex gap-4 scroll-smooth">
            {chatHistory.length === 1 && (
              <div className="space-y-2 mb-2">
                <p className="text-xs text-gray-500 font-medium text-center mb-3">Câu hỏi thường gặp</p>
                <div className="flex flex-col gap-2">
                  {faq.map((item: any, idx: number) => item.q?.trim() !== "" ? (
                    <button
                      key={idx}
                      onClick={() => handleQuestionClick(item)}
                      className="text-left p-2.5 bg-white border border-primary/20 hover:border-primary text-primary rounded-xl text-sm transition-colors shadow-sm"
                    >
                      {item.q}
                    </button>
                  ) : null)}
                </div>
              </div>
            )}

            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-sm' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex w-full justify-start">
                <div className="p-3 bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-primary" />
                  <span className="text-xs text-gray-500">Đang trả lời...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập câu hỏi..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shrink-0"
              >
                <Send size={16} className="ml-1" />
              </button>
            </form>
            
            {config.value && (
              <button 
                type="button"
                onClick={handleStartLiveChat}
                className="w-full mt-2 py-1.5 text-xs text-primary font-medium hover:underline flex items-center justify-center gap-1"
              >
                <MessageSquare size={12} />
                Hoặc Chat với nhân viên (Live Chat)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleOpenBot}
          className="w-14 h-14 rounded-full bg-primary text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 relative group"
        >
          <Bot size={28} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}
    </div>
  );
}

