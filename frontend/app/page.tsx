'use client';

import { useState } from 'react';
import AskPanel from '@/components/AskPanel';
import TeachPanel from '@/components/TeachPanel';
import FaqList from '@/components/FaqList';

type Tab = 'chat' | 'teach' | 'knowledge';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const triggerRefresh = () => setRefreshCount(prev => prev + 1);

  const navItems = [
    { id: 'chat', label: 'Chat', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )},
    { id: 'teach', label: 'Teach the Bot', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    )},
    { id: 'knowledge', label: 'Knowledge Base', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5V5a2 2 0 0 1 2-2h4v14" />
        <path d="M12 5v14" />
        <path d="M16 5v14" />
        <path d="M20 5v14" />
        <path d="M8 19h8" />
        <path d="M8 15h8" />
        <path d="M8 11h8" />
      </svg>
    )},
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* TOPBAR */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-6 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            FAQ Assistant <span className="text-blue-600">Bot</span>
          </h1>
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className={`fixed top-16 bottom-0 left-0 bg-white border-r border-gray-200 transition-all duration-300 z-10 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex flex-col h-full p-3">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="mb-8 p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 flex justify-center group"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-all duration-300 ${isSidebarCollapsed ? 'scale-110' : ''} group-hover:text-blue-600`}>
              <path d="M12 2v4" />
              <rect x="4" y="8" width="16" height="12" rx="2" />
              <circle cx="9" cy="14" r="1" />
              <circle cx="15" cy="14" r="1" />
              <path d="M9 18h6" />
            </svg>
          </button>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <div className={`${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`}>
                  {item.icon}
                </div>
                {!isSidebarCollapsed && <span className="text-base">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-0 pl-0 transition-all duration-300 pt-16 h-screen overflow-y-auto" style={{ marginLeft: isSidebarCollapsed ? '64px' : '256px' }}>
        <div className="p-8 flex flex-col max-w-4xl mx-auto w-full min-h-[calc(100vh-4rem)]">
          <div className="flex-1 relative">
            {activeTab === 'chat' && (
              <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                <AskPanel />
              </div>
            )}
            {activeTab === 'teach' && (
              <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                <TeachPanel onSuccess={triggerRefresh} />
              </div>
            )}
            {activeTab === 'knowledge' && (
              <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                <FaqList key={refreshCount} refresh={triggerRefresh} />
              </div>
            )}
          </div>
          
          <footer className="mt-8 text-center text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} FAQ Assistant Project
          </footer>
        </div>
      </main>
    </div>
  );
}
