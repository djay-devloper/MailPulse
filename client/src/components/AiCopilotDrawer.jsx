import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Bot,
  Sparkles,
  Send,
  CornerDownLeft,
  ChevronRight,
  User,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from './Toast';

const PROMPT_CHIPS = [
  'Show me emails that need my attention.',
  'Summarize this conversation.',
  'What am I waiting for a response on?',
  "Which emails require the client's attention?",
  'Why has this email been assigned to the client?',
  'Draft a reply to this conversation.',
];

export const AiCopilotDrawer = ({
  isOpen,
  onClose,
  selectedThread,
  role,
}) => {
  const { addToast } = useToast();
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! I'm your **MailPulse Inbox Copilot** powered by Gemini 2.5 Flash.\n\nI have full real-time context of your synced **Gmail** and **Outlook** inboxes. Ask me anything, or tap one of the evaluation chips below!`,
      timestamp: 'Now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.askCopilot(textToSend.trim(), selectedThread?.id, role);
      if (res.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: res.answer,
            timestamp: 'Just now',
          },
        ]);
      } else {
        throw new Error(res.error || 'Failed to get answer');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ Error consulting AI copilot: ${err.message}. Please try again.`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedMarkdown = (text) => {
    // Basic Markdown parser for headings, bold, bullet points, code blocks
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-900 mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const content = line.substring(2);
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-2 my-0.5 text-xs text-slate-700">
            <span className="text-brand-500 font-bold">•</span>
            <span>{parseInline(content)}</span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="ml-2 my-1 text-xs text-slate-800 font-medium">
            {parseInline(line)}
          </div>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="border-l-2 border-brand-500 bg-brand-50/50 pl-2.5 py-1 my-1 text-xs italic text-slate-700 rounded-r"
          >
            {parseInline(line.replace('> ', ''))}
          </blockquote>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs text-slate-800 leading-relaxed my-0.5">
          {parseInline(line)}
        </p>
      );
    });
  };

  const parseInline = (text) => {
    // Handle bold **text** and code `text`
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[11px]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900">Inbox Copilot</h3>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-mono px-1.5 py-0.2 rounded font-bold">
                gemini-2.5-flash
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Active Context: {selectedThread ? `"${selectedThread.subject.slice(0, 32)}..."` : 'Full Inbox'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Evaluation Prompt Chips */}
      <div className="p-3 border-b border-slate-100 bg-indigo-50/30">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
          Suggested Copilot Queries:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PROMPT_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-[11px] font-medium bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 shadow-subtle transition active:scale-95 text-left"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[92%] p-3.5 rounded-2xl shadow-subtle text-xs ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : 'bg-slate-50 text-slate-900 border border-slate-200 rounded-tl-none'
              }`}
            >
              {msg.sender === 'user' ? (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              ) : (
                <div className="space-y-1">{renderFormattedMarkdown(msg.text)}</div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 max-w-[70%]">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
            <span className="text-xs text-slate-500 font-medium">Analyzing inbox with Gemini...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot about any email, date, or decision..."
            className="w-full text-xs pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40 transition shadow-sm"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
        <span className="text-[10px] text-slate-400 text-center block mt-1.5">
          Trained on Executive Assistant workflows • Press Enter to send
        </span>
      </div>
    </div>
  );
};

export default AiCopilotDrawer;
