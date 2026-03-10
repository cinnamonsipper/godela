import React from 'react';
import { Box, Radiation as Animation, Eye, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FloatingToolbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'model', label: 'Model', icon: <Box size={18} /> },
  { id: 'animation', label: 'Animation', icon: <Animation size={18} /> },
  { id: 'view', label: 'View', icon: <Eye size={18} /> },
  { id: 'camera', label: 'Camera', icon: <Camera size={18} /> },
];

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ activeTab, setActiveTab }) => {
  const { hasModel } = useApp();
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                  bg-white/10 backdrop-blur-md rounded-xl shadow-lg
                  flex gap-x-6 px-6 py-2 items-center">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex items-center px-2 py-1 text-sm font-medium transition-colors
            ${activeTab === tab.id ? 'text-primary-400' : 'text-gray-300 hover:text-white'}`}
          onClick={() => setActiveTab(tab.id)}
          disabled={!hasModel}
        >
          {tab.icon}
          <span className="ml-1 hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}; 