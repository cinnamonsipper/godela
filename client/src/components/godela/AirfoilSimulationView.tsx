import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AirfoilSimulationViewProps {
  onStepComplete: (response: string) => void;
  expectedResponse?: string;
}

export default function AirfoilSimulationView({ 
  onStepComplete, 
  expectedResponse = '' 
}: AirfoilSimulationViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploadedFile(file);
    
    // Simulate file processing
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Set up for simulation
      onStepComplete("Model uploaded successfully");
    }, 1500);
  };
  
  // Start simulation
  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationRunning(true);
    
    // Simulate processing time
    setTimeout(() => {
      setSimulationRunning(false);
      setIsComplete(true);
      onStepComplete("Simulation complete");
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <h2 className="text-xl font-semibold text-slate-200">Airfoil Pressure Simulation</h2>
        <p className="text-slate-400 mt-1">
          Upload your airfoil model and simulate pressure distribution
        </p>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-6 flex flex-col overflow-hidden">
        {!uploadedFile ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Upload Area */}
            <div className="max-w-lg w-full border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/50 flex flex-col items-center justify-center p-8">
              {isLoading ? (
                <div className="text-center py-10">
                  <RotateCw size={48} className="mx-auto text-indigo-500 animate-spin mb-4" />
                  <p className="text-slate-300 font-medium mb-1">Processing file...</p>
                  <p className="text-slate-500 text-sm">Please wait while we process your model</p>
                </div>
              ) : (
                <>
                  <Upload className="h-16 w-16 text-slate-500 mb-4" />
                  <p className="text-center text-slate-300 font-medium mb-2">
                    Upload your airfoil model
                  </p>
                  <p className="text-center text-slate-500 text-sm mb-6">
                    Supported file formats: STEP, STL, IGES
                  </p>
                  
                  <Button
                    variant="default"
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => {
                      // Simulate file upload
                      setUploadedFile(new File([], "airfoil_model.step"));
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                        onStepComplete("Model uploaded successfully");
                      }, 1500);
                    }}
                  >
                    Select File
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : isSimulating ? (
          <div className="flex-1 flex flex-col">
            {/* Simulation Results */}
            <div className="h-full rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900/50">
              {simulationRunning ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <RotateCw size={64} className="mx-auto text-indigo-500 animate-spin mb-6" />
                    <h3 className="text-xl font-medium text-slate-200 mb-2">Running Simulation</h3>
                    <p className="text-slate-400 max-w-md">
                      Analyzing pressure distribution across the airfoil surface...
                    </p>
                  </div>
                </div>
              ) : (
                <div 
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{
                    __html: `<div class="sketchfab-embed-wrapper">
                      <iframe 
                        title="Pressure around an aircraft wing" 
                        frameborder="0" 
                        allowfullscreen 
                        mozallowfullscreen="true" 
                        webkitallowfullscreen="true" 
                        allow="autoplay; fullscreen; xr-spatial-tracking" 
                        xr-spatial-tracking 
                        execution-while-out-of-viewport 
                        execution-while-not-rendered 
                        web-share 
                        src="https://sketchfab.com/models/d88cbc16b21f4c93abe003f194b25d55/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
                        style="width: 100%; height: 100%; min-height: 500px;"
                      ></iframe>
                    </div>`
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center">
            {/* Model Uploaded, Ready to Simulate */}
            <div className="max-w-lg w-full mb-8">
              <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
                <h3 className="text-lg font-medium text-slate-200 mb-3">Model Ready for Simulation</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                  <div className="text-slate-400">File Name:</div>
                  <div className="text-slate-200">{uploadedFile.name}</div>
                  
                  <div className="text-slate-400">Model Type:</div>
                  <div className="text-slate-200">NACA Airfoil</div>
                  
                  <div className="text-slate-400">Simulation Type:</div>
                  <div className="text-slate-200">Pressure Distribution</div>
                </div>
                
                <Button
                  variant="default"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2"
                  onClick={startSimulation}
                >
                  Run Pressure Simulation
                </Button>
              </div>
              
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/30 p-4">
                <p className="text-sm text-slate-400 mb-2">
                  <span className="font-medium text-slate-300">Simulation Parameters</span>
                </p>
                <ul className="list-disc pl-5 text-sm text-slate-500 space-y-1">
                  <li><span className="text-slate-400">Wind Speed:</span> 200 mph</li>
                  <li><span className="text-slate-400">Angle of Attack:</span> 5°</li>
                  <li><span className="text-slate-400">Fluid Medium:</span> Air at sea level</li>
                  <li><span className="text-slate-400">Reynolds Number:</span> 6.5×10⁶</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}