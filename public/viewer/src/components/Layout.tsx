import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Toolbar } from './Toolbar';
import { MenuIcon, XIcon } from 'lucide-react';
import { FloatingToolbar } from './FloatingToolbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('model');
  // hasModel is needed for disabling buttons, so we get it from context
  // We'll pass it to FloatingToolbar
  // We'll also pass activeTab/setActiveTab to Sidebar
  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex items-center justify-between bg-dark-700 border-b border-dark-600 px-4 py-3">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-dark-600"
          >
            {sidebarOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
          <h1 className="text-xl font-bold text-white">3D CAD Modeling Platform</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Toolbar />
        </div>
      </header>
      {/* FloatingToolbar is rendered here, above the main content */}
      <FloatingToolbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div className="w-64 border-r border-dark-600 bg-dark-800 flex-shrink-0">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        )}
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
};