import React from 'react';
import { Info, Box, Triangle, CircleOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ModelInfo: React.FC = () => {
  const { model } = useApp();
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-300 flex items-center">
        <Info size={16} className="mr-2" />
        Model Information
      </h3>
      
      {model ? (
        <>
          <div className="card p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">File Name</span>
              <span className="text-sm">{model.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Size</span>
              <span className="text-sm">{(model.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
          
          <div className="card p-3">
            <h4 className="text-xs font-medium text-gray-400 mb-2">Geometry</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <Triangle size={16} className="mr-1 text-primary-400" />
                <span className="text-xs">12,450 faces</span>
              </div>
              <div className="flex items-center">
                <Box size={16} className="mr-1 text-primary-400" />
                <span className="text-xs">8,320 vertices</span>
              </div>
            </div>
          </div>
          
          <div className="card p-3">
            <h4 className="text-xs font-medium text-gray-400 mb-2">Materials</h4>
            <div className="flex flex-wrap gap-2">
              <div className="px-2 py-1 bg-dark-600 rounded-md text-xs">
                Material 1
              </div>
              <div className="px-2 py-1 bg-dark-600 rounded-md text-xs">
                Material 2
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <CircleOff size={32} className="text-gray-500 mb-2" />
          <p className="text-sm text-gray-400">No model information available</p>
        </div>
      )}
    </div>
  );
};