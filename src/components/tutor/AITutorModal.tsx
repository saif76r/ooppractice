import React, { useState } from 'react';
import { askAITutor } from '../../services/javaRunner';
import { Sparkles, X, Send, Bot, Terminal, ShieldAlert } from 'lucide-react';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCode?: string;
  errorLog?: string;
  concept?: string;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  currentCode = '',
  errorLog = '',
  concept = 'Java Object-Oriented Programming',
}) => {
  const [question, setQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'tutor'; text: string }[]>([
    {
      sender: 'tutor',
      text: `Greetings, apprentice! I am your Arcane Java Tutor. Ask me anything about ${concept}, or request an explanation of any compiler error diagnostics. I will guide your understanding with progressive insights!`,
    },
  ]);

  if (!isOpen) return null;

  const handleAsk = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim() || isLoading) return;

    const userMsg = { sender: 'user' as const, text: q };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setIsLoading(true);

    try {
      const res = await askAITutor(currentCode, concept, q, errorLog);
      setMessages((prev) => [...prev, { sender: 'tutor', text: res.advice }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'tutor',
          text: 'The arcane connection wavers, but remember: ensure every method has a matching return type and fields are declared with appropriate access modifiers.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'Explain why we need private fields instead of public fields',
    'What is the difference between Method Overloading and Method Overriding?',
    'Explain Dynamic Method Dispatch in simple terms',
    'Why did my code throw a NullPointerException?',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#090c16] border border-indigo-900/80 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 bg-[#0d1020] border-b border-indigo-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Arcane AI Java Tutor</h3>
              <p className="text-[11px] text-slate-400">Powered by OpenJDK diagnostics & Gemini Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          {errorLog && (
            <div className="p-3 bg-red-950/30 border border-red-900/40 rounded-lg text-red-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-red-200">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Active Compiler/Runtime Diagnostics Attached:</span>
              </div>
              <pre className="font-mono text-[11px] whitespace-pre-wrap">{errorLog}</pre>
            </div>
          )}

          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'tutor' && (
                <div className="w-6 h-6 rounded bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3 rounded-lg max-w-[85%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-indigo-400 text-xs italic">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Java syntax and formulating pedagogical guidance...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 bg-[#070912] border-t border-slate-900 flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              className="text-[11px] px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-md transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#0d1020] border-t border-indigo-950 flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask about this challenge, concept, or error..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleAsk()}
            disabled={!question.trim() || isLoading}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
