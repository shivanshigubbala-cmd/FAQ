'use client';
import React, { useState } from 'react';
import { teachFaq } from '@/lib/api';

interface TeachPanelProps {
  onSuccess: () => void;
}

export default function TeachPanel({ onSuccess }: TeachPanelProps) {
  const [apiKey, setApiKey] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTeach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setIsLoading(true);
    setStatus(null);

    try {
      await teachFaq(question, answer, apiKey);
      setStatus({ type: 'success', message: 'Successfully taught new answer!' });
      setQuestion('');
      setAnswer('');
      onSuccess();
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err instanceof Error ? err.message : 'An unexpected error occurred' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 mb-8 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <h2 className="text-xl font-bold text-gray-800">Teach the Bot</h2>
      </div>

      <div className="flex items-center gap-3 p-3 mb-6 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Authorized personnel only — you'll need a valid API key to submit changes.</span>
      </div>
      
      <form onSubmit={handleTeach} className="space-y-4">
        <div className="transition-all">
          <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter secret key..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <div className="transition-all">
          <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What is the company policy on remote work?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <div className="transition-all">
          <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Provide the correct answer..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isLoading ? 'Teaching...' : 'Teach Bot'}
        </button>
      </form>

      {status && (
        <div className={`mt-4 p-3 text-sm rounded-lg border ${
          status.type === 'success' 
            ? 'text-green-700 bg-green-50 border-green-200' 
            : 'text-red-600 bg-red-50 border-red-200'
        }`}>
          {status.message}
        </div>
      )}
    </div>
  );
}
