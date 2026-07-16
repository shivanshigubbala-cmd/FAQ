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
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Teach the Bot</h2>
      <p className="text-xs text-gray-500 mb-4">Demonstrates: BR-05 (Authorized access only)</p>
      
      <form onSubmit={handleTeach} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter secret key..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What is the company policy on remote work?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Provide the correct answer..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
        >
          {isLoading ? 'Teaching...' : 'Teach Bot'}
        </button>
      </form>

      {status && (
        <div className={`mt-4 p-3 text-sm rounded-md border ${
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
