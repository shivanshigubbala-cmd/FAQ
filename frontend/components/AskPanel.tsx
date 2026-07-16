'use client';
import React, { useState } from 'react';
import { queryFaq } from '@/lib/api';

export default function AskPanel() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<{ question: string; matched: string | null; answer: string | null; message?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await queryFaq(question);
      setResult({
        question: data.question,
        matched: data.matched_question,
        answer: data.answer,
        message: data.message,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 mb-8 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-800">Ask a Question</h2>
      </div>
      <p className="text-xs text-gray-500 mb-6">Ask in plain language — the assistant handles typos and rewordings, and tells you honestly when it doesn't know.</p>
      
      <form onSubmit={handleAsk} className="flex gap-2 mb-6">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. How do I reset my password?"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isLoading ? 'Asking...' : 'Ask'}
        </button>
      </form>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <div className="p-4 rounded-lg bg-indigo-50/50 border border-indigo-100">
          {result.answer ? (
            <div className="animate-in fade-in duration-300">
              <p className="text-gray-800 text-lg leading-relaxed">{result.answer}</p>
              {result.matched && (
                <p className="text-xs text-indigo-500 mt-2 font-medium uppercase tracking-wider">matched: {result.matched}</p>
              )}
            </div>
          ) : (
            <div className="text-gray-600 italic">
              {result.message || "I don't know the answer to that yet."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
