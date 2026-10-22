import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const ObChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am OB, your personal assistant at NADEGE Logistics. How can I help you choose event equipment or proforma invoices today?',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error connecting to OB. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'How do I book equipment?',
    'What payment options exist?',
    'Do you provide proforma invoices?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 px-4 py-3 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] font-bold rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-[#0b0e14]"
          aria-label="Chat with OB"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#0b0e14]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#22c55e] rounded-full border-2 border-[#0b0e14]" />
          </div>
          <span className="text-xs font-extrabold tracking-wide">Ask OB</span>
        </button>
      )}

      {/* Chat modal window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[380px] h-[520px] bg-[#0f151e] border border-[#2a3a4a] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#131a24] border-b border-[#2a3a4a] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#f5b342]/20 border border-[#f5b342]/40 flex items-center justify-center text-[#f5b342]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-[#edf2f7]">OB (NADEGE Assistant)</span>
                  <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                </div>
                <span className="text-[10px] text-[#94a3b8]">Online • Powered by Gemini</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#94a3b8] hover:text-white rounded-lg hover:bg-[#1a232f] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b0e14]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#f5b342]/20 flex items-center justify-center text-[#f5b342] shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#f5b342] text-[#0b0e14] font-medium rounded-br-none'
                      : 'bg-[#1a232f] text-[#edf2f7] border border-[#2a3a4a] rounded-bl-none'
                  }`}
                >
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-[#f5b342]/20 flex items-center justify-center text-[#f5b342] shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="px-3.5 py-2.5 rounded-xl bg-[#1a232f] border border-[#2a3a4a] text-xs text-[#94a3b8] flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin text-[#f5b342]" />
                  <span>OB is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-[#131a24] border-t border-[#2a3a4a] flex flex-wrap gap-1.5">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(p);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#1a232f] hover:bg-[#212d3d] border border-[#2a3a4a] text-[10px] text-[#f5b342] transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-[#131a24] border-t border-[#2a3a4a] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask OB anything about equipment or booking..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#0b0e14] border border-[#2a3a4a] focus:border-[#f5b342] text-xs text-[#edf2f7] placeholder-[#64748b] rounded-xl px-3 py-2.5 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-[#f5b342] hover:bg-[#e6a63c] text-[#0b0e14] rounded-xl font-bold transition-all disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
