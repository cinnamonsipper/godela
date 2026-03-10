/**
 * Simulation View Component
 * 
 * This component provides interactive simulation capabilities for two different demo paths:
 * 1. Airfoil Demo: Traditional slider-based parameter adjustment for airfoil properties
 * 2. Aircraft Aerodynamics Demo: Latent space exploration interface for complex design spaces
 * 
 * The component conditionally renders the appropriate interface based on the active demo path.
 */

import React, { useState, useEffect } from 'react';
import clAlphaPlotImage from '../../assets/placeholder_cl_alpha_plot.svg';
import cdClPlotImage from '../../assets/placeholder_cd_cl_plot.svg';
import ProgressHeader from './ProgressHeader';
import DynamicAirfoil from './DynamicAirfoil';
import LatentSpaceExplorer from './LatentSpaceExplorer';
import useDemoStore from '@/store/useDemoStore';

interface SimulationParams {
  aoa: number; // Angle of Attack (degrees)
  tc: number;  // Thickness ratio (t/c)
  re: number;  // Reynolds number (millions)
}

export default function SimulateView() {
  // Get the current demo path to determine which simulation view to show
  const { demoPath } = useDemoStore();
  
  const [params, setParams] = useState<SimulationParams>({
    aoa: 5,
    tc: 0.12,
    re: 1.0
  });
  
  const [predictions, setPredictions] = useState({
    cl: 0.58,
    cd: 0.0065
  });
  
  // Update predictions when parameters change (simulated ML model responses)
  useEffect(() => {
    // Simplified model for demo purposes
    const newCl = 0.1 * params.aoa + 0.1 * params.tc + 0.08;
    const newCd = 0.005 + 0.0003 * params.aoa * params.aoa + 0.005 * params.tc;
    
    setPredictions({
      cl: parseFloat(newCl.toFixed(3)),
      cd: parseFloat(newCd.toFixed(4))
    });
  }, [params]);
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, param: keyof SimulationParams) => {
    const value = parseFloat(e.target.value);
    setParams(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  // If the current demo path is aircraft-aerodynamics, show the latent space explorer instead
  if (demoPath === 'aircraft-aerodynamics') {
    return (
      <div className="flex flex-col h-full bg-[#10131E]">
        <ProgressHeader title="Latent Space Explorer" />
        <LatentSpaceExplorer />
      </div>
    );
  }
  
  // Default airfoil simulation view
  return (
    <div className="flex flex-col h-full p-6 bg-[#10131E]">
      <ProgressHeader title="Interactive Simulation" />
      
      <div className="text-sm text-blue-300 mb-6">
        Adjust parameters to see instant predictions from the ML model
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left column - Parameter controls */}
        <div className="bg-[#0D1017] rounded-lg p-4 border border-[#1A2030] shadow-md lg:col-span-1">
          <h3 className="text-lg font-medium text-blue-200 mb-4">Input Parameters</h3>
          
          <div className="space-y-6">
            {/* Angle of Attack slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-blue-300 font-medium">Angle of Attack (α)</label>
                <span className="text-sm text-indigo-300 font-mono">{params.aoa}°</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="15" 
                step="0.5" 
                value={params.aoa} 
                onChange={(e) => handleSliderChange(e, 'aoa')}
                className="w-full h-2 bg-[#1A2030] rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0°</span>
                <span>15°</span>
              </div>
            </div>
            
            {/* Thickness ratio slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-blue-300 font-medium">Thickness Ratio (t/c)</label>
                <span className="text-sm text-indigo-300 font-mono">{params.tc}</span>
              </div>
              <input 
                type="range" 
                min="0.06" 
                max="0.18" 
                step="0.01" 
                value={params.tc} 
                onChange={(e) => handleSliderChange(e, 'tc')}
                className="w-full h-2 bg-[#1A2030] rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0.06</span>
                <span>0.18</span>
              </div>
            </div>
            
            {/* Reynolds number slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-blue-300 font-medium">Reynolds Number (Re)</label>
                <span className="text-sm text-indigo-300 font-mono">{params.re.toFixed(1)}e6</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="5.0" 
                step="0.1" 
                value={params.re} 
                onChange={(e) => handleSliderChange(e, 're')}
                className="w-full h-2 bg-[#1A2030] rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0.5e6</span>
                <span>5.0e6</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#1A2030]">
            <h3 className="text-lg font-medium text-blue-200 mb-4">Model Predictions</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0A0E18] rounded-lg p-3 text-center">
                <div className="text-sm text-blue-300 mb-1">Lift Coefficient</div>
                <div className="text-2xl font-mono font-medium text-indigo-300 animate-pulse">
                  {predictions.cl}
                </div>
                <div className="text-xs text-gray-400 mt-1">CL</div>
              </div>
              
              <div className="bg-[#0A0E18] rounded-lg p-3 text-center">
                <div className="text-sm text-blue-300 mb-1">Drag Coefficient</div>
                <div className="text-2xl font-mono font-medium text-indigo-300 animate-pulse">
                  {predictions.cd}
                </div>
                <div className="text-xs text-gray-400 mt-1">CD</div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button className="px-3 py-1.5 bg-[#0A0E18] text-indigo-300 rounded-md text-sm font-medium hover:bg-[#151B29] transition-colors">
                Save Design
              </button>
              <button className="px-3 py-1.5 bg-[#0A0E18] text-indigo-300 rounded-md text-sm font-medium hover:bg-[#151B29] transition-colors">
                Compare
              </button>
            </div>
          </div>
        </div>
        
        {/* Right column - Visualization */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {/* Airfoil visualization */}
          <div className="bg-[#0D1017] rounded-lg p-4 border border-[#1A2030] shadow-md md:col-span-2 flex flex-col h-[210px]">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-medium text-blue-200">Airfoil Geometry</h3>
              <div className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded">
                Real-time Update
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <div className="relative w-full max-w-[500px] h-[180px] overflow-hidden">
                <DynamicAirfoil 
                  angleOfAttack={params.aoa} 
                  thickness={params.tc}
                  width={500}
                  height={180}
                />
              </div>
            </div>
          </div>
          
          {/* CL vs Alpha plot */}
          <div className="bg-[#0D1017] rounded-lg p-4 border border-[#1A2030] shadow-md">
            <h3 className="text-sm font-medium text-blue-200 mb-2">CL vs. Angle of Attack</h3>
            <div className="flex items-center justify-center">
              <img src={clAlphaPlotImage} alt="CL vs Alpha Plot" className="w-full max-w-[350px]" />
            </div>
          </div>
          
          {/* CD vs CL plot */}
          <div className="bg-[#0D1017] rounded-lg p-4 border border-[#1A2030] shadow-md">
            <h3 className="text-sm font-medium text-blue-200 mb-2">Drag Polar (CL vs. CD)</h3>
            <div className="flex items-center justify-center">
              <img src={cdClPlotImage} alt="Drag Polar Plot" className="w-full max-w-[350px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}