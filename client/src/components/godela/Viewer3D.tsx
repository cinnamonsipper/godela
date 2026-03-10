import { useEffect } from "react";
import useDemoStore from "@/store/useDemoStore";
import { DEMO_STEPS } from "@/lib/demoConstants";
import {
  BladeBaseline,
  BladeResults,
  OptimAnimation,
  ResultsComparison,
  BladeOptimized
} from "./PlaceholderSVGs";

export default function Viewer3D() {
  const { demoStep, nextDemoStep } = useDemoStore();
  const currentStep = DEMO_STEPS[demoStep];

  // Handler for clicking the Opt 2 in step 4
  const handleOpt2Click = () => {
    if (demoStep === 4) {
      nextDemoStep();
    }
  };

  // Show insight highlight in step 2
  const showInsightHighlight = demoStep === 2;

  return (
    <div className="flex-1 p-6 border-b border-[#2D3748] overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium text-gray-100">WhisperWind Turbine Simulation</h2>
          <p className="text-sm text-gray-400">Results update automatically as you chat with Godela</p>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#1E2330] border border-[#2D3748]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#1E2330] border border-[#2D3748]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="relative w-full h-[calc(100%-70px)] rounded-lg bg-[#1E2330] p-0 overflow-hidden border border-[#2D3748]">
        {/* Baseline Blade View */}
        <div className={`absolute inset-0 flex items-center justify-center p-6 fade-in ${currentStep.viewer === 'blade-baseline' ? 'block' : 'hidden'}`}>
          <BladeBaseline />
          <div className="absolute top-4 left-4 bg-[#121722]/80 rounded-lg px-3 py-2 text-sm">
            <span className="text-gray-300">Starting Model: </span>
            <span className="text-indigo-400">WhisperWind V1 Baseline</span>
          </div>
        </div>
        
        {/* Analysis Results View */}
        <div className={`absolute inset-0 flex items-center justify-center p-6 fade-in ${currentStep.viewer === 'blade-results' ? 'block' : 'hidden'}`}>
          <BladeResults showInsightHighlight={showInsightHighlight} />
          <div className="absolute top-4 left-4 bg-[#121722]/80 rounded-lg px-3 py-2 text-sm">
            <span className="text-gray-300">Analysis Mode: </span>
            <span className="text-blue-400">AI-Surrogate Prediction</span>
          </div>
          {showInsightHighlight && (
            <div className="absolute top-4 right-4 bg-yellow-900/70 border border-yellow-600/50 rounded-lg px-3 py-2 text-sm text-yellow-200 max-w-xs">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 flex-shrink-0 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>AI identified turbulence issue at trailing edge (highlighted)</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Optimization Animation */}
        <div className={`absolute inset-0 flex items-center justify-center p-6 fade-in ${currentStep.viewer === 'optim-anim' ? 'flex flex-col' : 'hidden'}`}>
          <OptimAnimation />
        </div>
        
        {/* Comparison Layout */}
        <div className={`absolute inset-0 p-6 fade-in ${currentStep.viewer === 'results-comparison' ? 'flex flex-col' : 'hidden'}`}>
          <ResultsComparison onOpt2Click={handleOpt2Click} />
          <div className="absolute top-4 left-4 bg-[#121722]/80 rounded-lg px-3 py-2 text-sm">
            <span className="text-gray-300">Optimization Results: </span>
            <span className="text-green-400">3 Candidates Found</span>
          </div>
        </div>
        
        {/* Optimized Blade View */}
        <div className={`absolute inset-0 flex items-center justify-center p-6 fade-in ${currentStep.viewer === 'blade-optimized' ? 'block' : 'hidden'}`}>
          <BladeOptimized />
          <div className="absolute top-4 left-4 bg-[#121722]/80 rounded-lg px-3 py-2 text-sm">
            <span className="text-gray-300">Selected Model: </span>
            <span className="text-indigo-400">WhisperWind V2-AI_Opt2</span>
          </div>
        </div>
        
        {/* Controls overlay */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button className="p-2 rounded-full bg-[#121722] text-gray-300 hover:text-white hover:bg-indigo-600/30 border border-[#2D3748]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </button>
          <button className="p-2 rounded-full bg-[#121722] text-gray-300 hover:text-white hover:bg-indigo-600/30 border border-[#2D3748]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button className="p-2 rounded-full bg-[#121722] text-gray-300 hover:text-white hover:bg-indigo-600/30 border border-[#2D3748]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
