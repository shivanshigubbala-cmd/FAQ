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
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Knowledge Base</h2>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {isOpen ? 'Hide' : 'Show'} Details
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-4">Demonstrates: BR-06 (Persistence check) & Overview</p>
      
      <div className="flex gap-2 mb-4">
        <button 
          onClick={loadFaqs} 
          disabled={isLoading}
          className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-gray-600"
        >
          {isLoading ? 'Refreshing...' : 'Refresh List'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {isOpen && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {faqs && Object.entries(faqs).length > 0 ? (
            Object.entries(faqs).map(([q, a], idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-100 text-sm">
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
