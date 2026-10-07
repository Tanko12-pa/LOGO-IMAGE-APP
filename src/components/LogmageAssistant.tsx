import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  Trash2,
  Copy,
  Check,
  Palette,
  ScanEye,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { BrandKit, NavView } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface LogmageAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: NavView;
  brandKit: BrandKit;
  onApplyPrompt?: (prompt: string, targetView: 'logo-generator' | 'image-generator') => void;
}

export const LogmageAssistant: React.FC<LogmageAssistantProps> = ({
  isOpen,
  onClose,
  currentView,
  brandKit,
  onApplyPrompt,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        "Greetings! I am **LOGMAGE**, your AI Design & Computer Vision Advisor. I can optimize your prompts, audit color harmony (#800020 burgundy & #F27430 tangerine), inspect vector scalability, or guide you through creating an iconic brand identity.\n\nHow can I elevate your creative project right now?",
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await apiService.chatWithAssistant(chatHistory, currentView, brandKit);

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content:
            "I'm operating in high-speed offline mode! Feel free to ask about vector styling, color contrast, or computer vision prompt extraction.",
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const quickChips = [
    { label: 'Suggest Minimalist Logo Prompt', prompt: 'Give me a refined prompt for a minimalist fintech vector logo using #800020 and #F27430.' },
    { label: 'Color Theory Advice', prompt: 'Why do #800020 burgundy and #FFE566 gold build luxury brand authority?' },
    { label: 'Explain Computer Vision & AR', prompt: 'How does the Computer Vision tool extract prompts and bounding boxes?' },
    { label: 'A2A Judge Workflow', prompt: 'How does the A2A Judge Agent self-heal and debug prompts before generation?' },
  ];

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isExpanded ? 'w-[95vw] md:w-[600px] h-[85vh]' : 'w-[92vw] sm:w-[420px] h-[560px]'
      }`}
    >
      {/* Header */}
      <div className="h-14 px-4 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#800020] via-[#F27430] to-[#FFE566] p-0.5 shadow-md">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#FFE566]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-sm text-white">LOGMAGE</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <span className="text-[10px] text-zinc-400">AI Design & Vision Assistant</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Minimize' : 'Expand'}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMessages(messages.slice(0, 1))}
            title="Clear Chat"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close Assistant"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-zinc-950/90 text-xs">
        {messages.map((m) => {
          const isBot = m.role === 'assistant';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end justify-end'}`}
            >
              {isBot && (
                <div className="w-6 h-6 rounded-lg bg-[#800020] text-[#FFE566] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`relative group max-w-[85%] rounded-2xl p-3 shadow-md ${
                  isBot
                    ? 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                    : 'bg-gradient-to-r from-[#800020] to-[#F27430] text-white font-medium ml-auto'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>

                <div className="flex items-center justify-between gap-3 mt-1.5 pt-1 text-[10px] text-zinc-400 border-t border-zinc-800/40">
                  <span className="font-mono">{m.timestamp}</span>
                  {isBot && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(m.content, m.id)}
                        className="text-zinc-400 hover:text-white flex items-center gap-0.5"
                      >
                        {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs py-1">
            <Bot className="w-4 h-4 text-[#F27430] animate-spin" />
            <span className="font-mono">LOGMAGE is formulating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-3 py-2 bg-zinc-900/60 border-t border-zinc-800/80 overflow-x-auto flex gap-1.5 no-scrollbar">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(chip.prompt)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-[#800020]/40 text-zinc-300 hover:text-white text-[11px] border border-zinc-700/60 transition-colors shrink-0"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-zinc-950 border-t border-zinc-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask LOGMAGE anything about logos, prompts, or design..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27430]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-2 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
