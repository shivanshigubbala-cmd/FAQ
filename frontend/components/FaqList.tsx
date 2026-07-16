'use client';
import React, { useState, useEffect } from 'react';
import { fetchFaqs } from '@/lib/api';

export default function FaqList({ refresh }: { refresh: () => void }) {
  const [faqs, setFaqs] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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
                <p className="font-medium text-gray-700">{q}</p>
                <p className="text-gray-600 mt-1">{a}</p>
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
