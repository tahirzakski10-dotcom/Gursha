"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Sparkles, User, ArrowRight } from "lucide-react";
import { getTodaysMeals, getHealthProfile } from "@/lib/storage";
import { sumNutrients } from "@/lib/nutritionDB";
import { generateCoachResponse } from "@/lib/recommendationEngine";

interface ChatMessage {
  id: string;
  role: 'user' | 'coach';
  text: string;
}

export default function AICoachView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Suggested quick prompts
  const suggestions = [
    "What should I eat for dinner?",
    "Am I missing any nutrients today?",
    "How can I improve my energy?",
    "What foods fit my health conditions?"
  ];

  useEffect(() => {
    // Initial greeting
    const profile = getHealthProfile();
    const name = "there"; // Could add name to profile later
    setMessages([{
      id: 'welcome',
      role: 'coach',
      text: `Hello ${name}! I'm your Gursha AI Coach. I've analyzed your health profile and meal history. How can I help you optimize your Ethiopian nutrition today?`
    }]);
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Gather context for the engine
    const profile = getHealthProfile();
    const todaysMeals = getTodaysMeals();
    const todaysNutrients = todaysMeals.length > 0 
      ? sumNutrients(todaysMeals.map(m => m.totalNutrients)) 
      : null;

    // Simulate network delay for natural feel
    setTimeout(() => {
      const responseText = generateCoachResponse(text, todaysNutrients, todaysMeals.length, profile);
      const coachMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'coach', text: responseText };
      setMessages(prev => [...prev, coachMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 1000); // 0.8s to 1.8s delay
  };

  return (
    <div className="h-full max-w-3xl mx-auto flex flex-col">
      
      {/* Header */}
      <div className="glass p-4 rounded-2xl mb-4 flex items-center gap-4 shrink-0 border border-[var(--color-card-border)]">
        <div className="w-12 h-12 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center border border-[var(--color-primary)]/30 text-[var(--color-primary)]">
          <Sparkles size={24} />
        </div>
        <div>
          <h3 className="font-bold">Gursha AI Coach</h3>
          <p className="text-xs text-neutral-400">Context-aware Ethiopian nutrition guidance</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass rounded-2xl border border-[var(--color-card-border)] flex flex-col overflow-hidden">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'coach' 
                ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30' 
                : 'bg-[var(--color-neutral-dark)] text-neutral-400 border border-[var(--color-card-border)]'
              }`}>
                {msg.role === 'coach' ? <Sparkles size={16} /> : <User size={16} />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'coach'
                ? 'bg-[var(--color-neutral-dark)] text-neutral-200 rounded-tl-sm border border-[var(--color-card-border)]'
                : 'bg-[var(--color-primary)] text-white rounded-tr-sm shadow-glow'
              }`}>
                {/* Render newlines correctly */}
                {msg.text.split('\n').map((line, i) => (
                  <span key={i}>{line}<br/></span>
                ))}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)]">
                 <Sparkles size={16} />
               </div>
               <div className="bg-[var(--color-neutral-dark)] rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center">
                 <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/40 border-t border-[var(--color-card-border)] shrink-0">
          
          {/* Suggestions (only show if few messages) */}
          {messages.length < 3 && !isTyping && (
            <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => handleSend(s)}
                  className="whitespace-nowrap px-4 py-2 rounded-full bg-[var(--color-neutral-dark)] text-xs text-neutral-300 border border-[var(--color-card-border)] hover:bg-[var(--color-neutral-light)] transition flex items-center gap-2">
                  {s} <ArrowRight size={12} />
                </button>
              ))}
            </div>
          )}

          {/* Text Input */}
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask about your nutrition..."
              className="w-full bg-[var(--color-neutral-dark)] border border-[var(--color-card-border)] rounded-full pl-5 pr-12 py-3.5 text-sm text-white outline-none focus:border-[var(--color-primary)] transition placeholder:text-neutral-500"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
