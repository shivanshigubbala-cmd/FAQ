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
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Ask a Question</h2>
      <p className="text-xs text-gray-500 mb-4">Demonstrates: BR-01 (Plain Language), BR-02 (Fuzzy Match), BR-04 (Unknowns), BR-07 (Performance)</p>
      
      <form onSubmit={handleAsk} className="flex gap-2 mb-6">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. How do I reset my password?"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isLoading ? 'Asking...' : 'Ask'}
        </button>
      </form>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {result && (
        <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
          {result.answer ? (
            <div>
              <p className="text-gray-800 text-lg">{result.answer}</p>
              {result.matched && (
                <p className="text-xs text-gray-400 mt-2 italic">matched: {result.matched}</p>
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
