import React from 'react';
import { ModelInfo } from './sidebar/ModelInfo';
import { AnimationControls } from './sidebar/AnimationControls';
import { ViewSettings } from './sidebar/ViewSettings';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab }) => {
  const { hasModel } = useApp();
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {hasModel ? (
          <div className="p-4">
            {activeTab === 'model' && <ModelInfo />}
            {activeTab === 'animation' && <AnimationControls />}
            {activeTab === 'view' && <ViewSettings />}
            {activeTab === 'camera' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300">Camera Controls</h3>
                <p className="text-sm text-gray-400">Camera settings coming soon</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <span className="text-gray-500 mb-4" style={{ fontSize: 48 }}>📦</span>
            <h3 className="text-lg font-medium text-gray-300">No Model Loaded</h3>
            <p className="text-sm text-gray-400 mt-2">
              Import a GLB file to view and animate your 3D model
            </p>
          </div>
        )}
      </div>
    </div>
  );
};