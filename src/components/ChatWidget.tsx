'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { generateResponse } from '@/lib/chatbot/knowledge';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: 'Добро пожаловать в inVision U! Я ваш AI-помощник. Чем могу помочь?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const txt = inputValue.trim();
    if (!txt) return;

    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: txt,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate Network/Processing Delay
    setTimeout(() => {
      const responseText = generateResponse(txt);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: responseText,
        timestamp: new Date()
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 600 + Math.random() * 500); // 600-1100ms delay
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        
        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="origin-bottom-right mb-4 flex flex-col w-[350px] shadow-2xl rounded-2xl overflow-hidden glass-card-static border-brand-200 dark:border-brand-800"
              style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}
            >
              {/* Header */}
              <div className="bg-brand-600 dark:bg-brand-800 p-4 shrink-0 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">inVision U Assistant</h3>
                    <p className="text-[10px] text-white/70">Autonomous AI</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50 dark:bg-[#0A0D20]/50 scroll-smooth">
                {messages.map(msg => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[85%]">
                      {msg.sender === 'bot' && (
                        <div className="w-6 h-6 shrink-0 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center border border-brand-200 dark:border-brand-700">
                          <Bot size={12} className="text-brand-600 dark:text-brand-400" />
                        </div>
                      )}
                      <div 
                        className={`text-sm px-4 py-2.5 rounded-2xl ${
                          msg.sender === 'user' 
                          ? 'bg-brand-600 text-white rounded-br-sm' 
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-sm shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 mx-8">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-end gap-2"
                  >
                    <div className="w-6 h-6 shrink-0 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center border border-brand-200 dark:border-brand-700">
                       <Bot size={12} className="text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-sm p-3 shadow-sm flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white dark:bg-[#111633] border-t border-slate-100 dark:border-slate-800 shrink-0">
                <form onSubmit={handleSend} className="relative flex items-center">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Напишите ваш вопрос..."
                    className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-white dark:placeholder-slate-500 transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="absolute right-1 top-1 bottom-1 aspect-square bg-brand-600 hover:bg-brand-700 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={14} className="ml-0.5" />
                  </button>
                </form>
                <div className="text-center mt-2">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500">Autonomous Mock Assistant</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <div className="relative">
          {!isOpen && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -top-12 right-0 bg-brand-100 dark:bg-brand-900/50 border border-brand-200 dark:border-brand-700 text-brand-800 dark:text-brand-300 text-xs font-medium py-2 px-3 rounded-t-xl rounded-l-xl rounded-br-none shadow-sm whitespace-nowrap animate-bounce"
            >
              Есть вопросы? Задайте!
            </motion.div>
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
              isOpen 
              ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-black' 
              : 'btn-primary shadow-brand-500/30'
            }`}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <X size={24} /> : <MessageCircle size={28} className="text-current" />}
            </motion.div>
          </button>
        </div>
        
      </div>
    </>
  );
}
