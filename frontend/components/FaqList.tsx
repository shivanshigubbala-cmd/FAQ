'use client';
import React, { useState, useEffect } from 'react';
import { fetchFaqs, deleteFaq } from '@/lib/api';

export default function FaqList({ refresh }: { refresh: () => void }) {
  const [faqs, setFaqs] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const loadFaqs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFaqs();
      setFaqs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load FAQs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleDelete = async (question: string) => {
    if (!apiKey.trim()) {
      setError('Please enter an API key to delete entries');
      return;
    }
    if (!window.confirm('Delete this question?')) return;

    setError(null);
    try {
      await deleteFaq(question, apiKey);
      await loadFaqs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete FAQ');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
            <path d="M4 19.5V5a2 2 0 0 1 2-2h4v14" />
            <path d="M12 5v14" />
            <path d="M16 5v14" />
            <path d="M20 5v14" />
            <path d="M8 19h8" />
            <path d="M8 15h8" />
            <path d="M8 11h8" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800">Knowledge Base</h2>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {isOpen ? 'Hide' : 'Show'} Details
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-6">Everything the assistant currently knows. Answers persist across restarts.</p>
      
      <div className="flex items-center gap-3 p-3 mb-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>API Key (required to delete entries)</span>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter secret key..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button 
          onClick={loadFaqs} 
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isLoading ? 'animate-spin' : ''}>
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          {isLoading ? 'Refreshing...' : 'Refresh List'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {isOpen && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {faqs && Object.entries(faqs).length > 0 ? (
            Object.entries(faqs).map(([q, a], idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-700">{q}</p>
                    <p className="text-gray-600 mt-1">{a}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(q)}
                    className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete this entry"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">No FAQs found.</p>
          )}
        </div>
      )}
    </div>
  );
}
