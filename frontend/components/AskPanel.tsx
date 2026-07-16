'use client';
import React, { useState, useEffect, useRef } from 'react';
import { queryFaq, QueryResponse } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  matched?: string | null;
  isUnknown?: boolean;
}

export default function AskPanel() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: question,
    };

    setMessages(prev => [...prev, userMsg]);
    const currentQuestion = question;
    setQuestion('');
    setIsLoading(true);
    setError(null);

    try {
      const data: QueryResponse = await queryFaq(currentQuestion);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: data.answer || data.message || "I don't know the answer to that yet.",
        matched: data.matched_question,
        isUnknown: !data.answer,
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Chat History Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
      >
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">How can I help you today?</p>
            <p className="text-xs text-gray-400 mt-1">Ask a question to start the conversation</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-md' 
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
            }`}>
              <p className={`text-sm leading-relaxed ${msg.isUnknown ? 'italic text-gray-500' : ''}`}>
                {msg.text}
              </p>
              {msg.matched && msg.role === 'bot' && (
                <p className="text-[10px] text-indigo-500 mt-1 font-semibold uppercase tracking-wider">
                  matched: {msg.matched}
                </p>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-400 px-4 py-2 rounded-2xl rounded-bl-md border border-gray-200 text-sm italic animate-pulse">
              Bot is thinking...
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="p-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg max-w-xs text-center">
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors text-sm"
          >
            {isLoading ? '...' : 'Ask'}
          </button>
        </form>
      </div>
    </div>
  );
}
