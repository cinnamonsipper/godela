import React from 'react';
import useDemoStore from '@/store/useDemoStore';

interface ProgressHeaderProps {
  title?: string;
}

export default function ProgressHeader({ title }: ProgressHeaderProps) {
  const { demoStep } = useDemoStore();
  
  // Define the workflow stages
  const workflowStages = [
    { name: "Problem Analysis", complete: demoStep >= 1, current: demoStep === 1 },
    { name: "Data Processing", complete: demoStep >= 2, current: demoStep === 2 },
    { name: "Model Building", complete: demoStep >= 3, current: demoStep === 3 },
    { name: "Simulation", complete: demoStep >= 4, current: demoStep === 4 }
  ];

  return (
    <div className="mb-4 pb-3 border-b border-[#1A2030]">
      {title && (
        <h2 className="text-xl font-medium text-blue-100 mb-3">{title}</h2>
      )}
      
      <div className="flex items-center justify-between mb-2">
        {workflowStages.map((stage, index) => (
          <div 
            key={index}
            className={`relative flex flex-col items-center ${index < workflowStages.length - 1 ? 'flex-1' : ''}`}
          >
            {/* Step circle */}
            <div 
              className={`w-8 h-8 rounded-full ${
                stage.current 
                  ? 'bg-indigo-600 ring-4 ring-indigo-600/20' 
                  : stage.complete 
                    ? 'bg-indigo-600'
                    : 'bg-[#1A2030] border border-[#2A3040]'
              } flex items-center justify-center text-sm z-10`}
            >
              {stage.complete ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className={`${stage.current ? 'text-white' : 'text-gray-400'}`}>{index + 1}</span>
              )}
            </div>
            
            {/* Connector line */}
            {index < workflowStages.length - 1 && (
              <div className="absolute top-4 left-1/2 w-full h-0.5 -translate-y-1/2">
                <div 
                  className={`h-full ${
                    workflowStages[index + 1].complete || workflowStages[index + 1].current 
                      ? 'bg-indigo-600' 
                      : 'bg-[#1A2030]'
                  }`}
                ></div>
              </div>
            )}
            
            {/* Step name */}
            <span 
              className={`mt-2 text-xs ${
                stage.current 
                  ? 'text-indigo-300 font-medium' 
                  : stage.complete 
                    ? 'text-blue-300'
                    : 'text-gray-400'
              }`}
            >
              {stage.name}
            </span>
          </div>
        ))}
      </div>
      
      <div className="w-full bg-[#0D1017] rounded-full h-1">
        <div 
          className="bg-gradient-to-r from-indigo-600 to-blue-600 h-1 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${Math.min(100, (demoStep / (workflowStages.length - 1)) * 100)}%` }}
        ></div>
      </div>
    </div>
  );
}