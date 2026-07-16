'use client';

import AskPanel from '@/components/AskPanel';
import TeachPanel from '@/components/TeachPanel';
import FaqList from '@/components/FaqList';
import { useState } from 'react';

export default function Home() {
  const [refreshCount, setRefreshCount] = useState(0);

  const triggerRefresh = () => setRefreshCount(prev => prev + 1);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">FAQ Assistant Bot</h1>
          <p className="text-lg text-gray-500 font-medium">Ask a question, get an instant answer.</p>
        </div>

        <AskPanel />
        <TeachPanel onSuccess={triggerRefresh} />
        <FaqList key={refreshCount} refresh={triggerRefresh} />
        
        <footer className="mt-12 text-center text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} FAQ Assistant Project
        </footer>
      </div>
    </main>
  );
}
