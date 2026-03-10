import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowDownCircle, 
  Gauge, 
  Download, 
  PackageCheck, 
  Plane, 
  Truck, 
  BarChart4, 
  AreaChart, 
  PackageOpen,
  Check,
  Package,
  AlertTriangle,
  Info,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConsolidatedSTLViewer from './ConsolidatedSTLViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface PackagingSimulationViewProps {
  onStepComplete: (response: string) => void;
  expectedResponse: string;
  currentStep: number;
}

const PackagingSimulationView: React.FC<PackagingSimulationViewProps> = ({ 
  onStepComplete,
  expectedResponse,
  currentStep
}) => {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(currentStep >= 5);
  const [dropTestComplete, setDropTestComplete] = useState(currentStep >= 5);
  const [flightSimComplete, setFlightSimComplete] = useState(currentStep >= 5);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [showStressOverlay, setShowStressOverlay] = useState(true);
  const [showPackaging, setShowPackaging] = useState(true);
  const [showProduct, setShowProduct] = useState(true);
  const [currentSimulation, setCurrentSimulation] = useState<'drop' | 'flight' | null>(
    currentStep === 4 ? 'drop' : currentStep >= 5 ? null : null
  );

  useEffect(() => {
    if (currentStep === 4 && !simulationComplete && !simulationRunning) {
      // Start drop test simulation if we're on step 4
      runDropTest();
    }
  }, [currentStep, simulationComplete, simulationRunning]);

  const runDropTest = () => {
    setSimulationRunning(true);
    setCurrentSimulation('drop');
    setSimulationProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDropTestComplete(true);
          setSimulationRunning(false);
          setSimulationComplete(true);
          return 100;
        }
        return prev + (Math.random() * 3 + 1); // Random increment between 1-4%
      });
    }, 100);
  };

  const runFlightSimulation = () => {
    setSimulationRunning(true);
    setCurrentSimulation('flight');
    setSimulationProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setFlightSimComplete(true);
          setSimulationRunning(false);
          setSimulationComplete(true);
          return 100;
        }
        return prev + (Math.random() * 2 + 0.5); // Slower progress, random increment between 0.5-2.5%
      });
    }, 80);
  };

  useEffect(() => {
    if (simulationComplete && dropTestComplete && !flightSimComplete && currentStep === 5) {
      // If drop test is complete and we're on step 5, run flight simulation
      setTimeout(() => {
        setSimulationComplete(false);
        runFlightSimulation();
      }, 1000);
    }
  }, [simulationComplete, dropTestComplete, flightSimComplete, currentStep]);

  return (
    <motion.div
      className="h-full w-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6">
        {/* 3D Viewer area */}
        <div className="flex-1 flex flex-col">
          {/* 3D Viewer */}
          <div className="flex-1 bg-slate-900/70 backdrop-blur-lg rounded-xl border border-slate-700/50 relative">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 flex flex-col gap-1.5">
                <button 
                  className={`rounded-md p-1.5 transition-colors ${showProduct ? 'bg-indigo-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'}`}
                  onClick={() => setShowProduct(!showProduct)}
                  title="Toggle Product Visibility"
                >
                  <Package size={16} />
                </button>
                <button 
                  className={`rounded-md p-1.5 transition-colors ${showPackaging ? 'bg-indigo-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'}`}
                  onClick={() => setShowPackaging(!showPackaging)}
                  title="Toggle Packaging Visibility"
                >
                  <PackageOpen size={16} />
                </button>
                <button 
                  className={`rounded-md p-1.5 transition-colors ${showStressOverlay ? 'bg-indigo-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'}`}
                  onClick={() => setShowStressOverlay(!showStressOverlay)}
                  title="Toggle Stress Overlay"
                  disabled={!simulationComplete}
                >
                  <AreaChart size={16} />
                </button>
              </div>
            </div>

            <div className="w-full h-full">
              {simulationRunning ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6">
                  <div className="w-20 h-20 border-4 border-t-indigo-500 border-slate-700/30 rounded-full animate-spin mb-4"></div>
                  <h3 className="text-lg font-medium text-slate-200 mb-2">
                    {currentSimulation === 'drop' ? 'Running Drop Test' : 'Simulating Flight Conditions'}
                  </h3>
                  <div className="w-64 bg-slate-800 rounded-full h-2 mb-3">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${Math.min(simulationProgress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-slate-400 text-sm">
                    {currentSimulation === 'drop' 
                      ? `Calculating impact forces and deformation... ${Math.min(Math.round(simulationProgress), 100)}%`
                      : `Analyzing vibration, pressure, and stress... ${Math.min(Math.round(simulationProgress), 100)}%`
                    }
                  </p>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <ConsolidatedSTLViewer
                    className="w-full h-full"
                    modelPath="/bottle.stl"
                  />
                  
                  {dropTestComplete && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm flex items-center bg-green-500/20 text-green-400">
                      <Check size={14} className="mr-1" />
                      {currentSimulation === 'flight' || flightSimComplete 
                        ? "Flight Impact Analysis Complete" 
                        : "Drop Test Complete - PASS"
                      }
                    </div>
                  )}
                  
                  {simulationComplete && (
                    <div className="absolute top-16 right-4 flex flex-col gap-2 items-end">
                      {dropTestComplete && (
                        <div className="bg-slate-800/80 backdrop-blur-sm text-slate-200 px-3 py-1.5 rounded-md text-xs flex items-center">
                          <Gauge size={12} className="mr-1.5 text-green-400" />
                          <span>Max Deceleration: <span className="font-medium text-green-400">28G</span></span>
                        </div>
                      )}
                      
                      {flightSimComplete && (
                        <div className="bg-slate-800/80 backdrop-blur-sm text-slate-200 px-3 py-1.5 rounded-md text-xs flex items-center">
                          <AlertTriangle size={12} className="mr-1.5 text-amber-400" />
                          <span>Dimple Risk: <span className="font-medium text-amber-400">12%</span></span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          {simulationComplete && (
            <div className="mt-4 flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1 bg-slate-800 hover:bg-slate-700 border-slate-700"
              >
                <FileText size={16} className="mr-2" />
                Download Report
              </Button>
              <Button 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => onStepComplete(expectedResponse)}
              >
                {!flightSimComplete ? (
                  <>
                    <Plane size={16} className="mr-2" />
                    Test Air Transport
                  </>
                ) : (
                  <>
                    <PackageCheck size={16} className="mr-2" />
                    Optimize Design
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Right sidebar - Simulation controls and results */}
        <div className="lg:w-80 xl:w-96 bg-slate-900/70 backdrop-blur-lg rounded-xl border border-slate-700/50 flex flex-col">
          <Tabs defaultValue="results" className="flex flex-col h-full">
            <div className="border-b border-slate-700/50">
              <TabsList className="w-full bg-transparent border-b border-slate-700/50 rounded-none h-14">
                <TabsTrigger 
                  value="results" 
                  className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:shadow-none rounded-none"
                >
                  <BarChart4 size={15} className="mr-2" />
                  <span>Results</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="tests" 
                  className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:shadow-none rounded-none"
                >
                  <PackageCheck size={15} className="mr-2" />
                  <span>Available Tests</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="results" className="flex-1 p-4 space-y-6 mt-0 overflow-y-auto">
              {!simulationComplete ? (
                <div className="text-center text-slate-400 flex flex-col items-center justify-center h-full">
                  <PackageCheck size={48} className="mb-4 text-slate-500/50" />
                  <p>Run a simulation to see results</p>
                </div>
              ) : (
                <>
                  {dropTestComplete && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <ArrowDownCircle size={18} className="text-indigo-400" />
                        <h3 className="font-medium text-slate-200">1-Meter Drop Test Results</h3>
                      </div>
                      
                      <div className="bg-green-900/20 border border-green-900/30 rounded-lg p-3 text-sm">
                        <div className="flex items-start">
                          <Check size={16} className="mt-0.5 mr-2 flex-shrink-0 text-green-400" />
                          <div>
                            <p className="font-medium text-green-400">Test Passed</p>
                            <p className="text-xs mt-1 text-green-500/80">Your packaging design successfully protected the product during a 1-meter vertical drop test.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Impact Deceleration</span>
                            <span className="text-slate-200 font-medium">28G</span>
                          </div>
                          <Progress value={28} max={100} className="h-2" />
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-green-400">Safe (&lt;40G)</span>
                            <span className="text-red-400">Damage (&gt;80G)</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Maximum Stress</span>
                            <span className="text-slate-200 font-medium">0.42 MPa</span>
                          </div>
                          <Progress value={42} max={100} className="h-2" />
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-green-400">Safe (&lt;0.6)</span>
                            <span className="text-red-400">Failure (&gt;1.0)</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Energy Absorption</span>
                            <span className="text-slate-200 font-medium">92%</span>
                          </div>
                          <Progress value={92} max={100} className="h-2" />
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-red-400">Poor (&lt;70%)</span>
                            <span className="text-green-400">Excellent (&gt;90%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {flightSimComplete && (
                    <div className="space-y-4 pt-6 mt-6 border-t border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <Plane size={18} className="text-indigo-400" />
                        <h3 className="font-medium text-slate-200">Air Transport Simulation Results</h3>
                      </div>
                      
                      <div className="bg-amber-900/20 border border-amber-900/30 rounded-lg p-3 text-sm">
                        <div className="flex items-start">
                          <AlertTriangle size={16} className="mt-0.5 mr-2 flex-shrink-0 text-amber-400" />
                          <div>
                            <p className="font-medium text-amber-400">Minor Risk Identified</p>
                            <p className="text-xs mt-1 text-amber-500/80">The packaging design is acceptable for air transport but has a small risk of product dimpling during severe turbulence.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Pressure Resistance</span>
                            <span className="text-slate-200 font-medium">Very Good</span>
                          </div>
                          <Progress value={85} max={100} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Vibration Dampening</span>
                            <span className="text-slate-200 font-medium">Good</span>
                          </div>
                          <Progress value={72} max={100} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Dimple Protection</span>
                            <span className="text-slate-200 font-medium">Moderate</span>
                          </div>
                          <Progress value={62} max={100} className="h-2" />
                        </div>
                      </div>

                      <div className="bg-slate-800/60 rounded-lg p-3 text-sm">
                        <div className="flex items-start">
                          <Info size={16} className="mt-0.5 mr-2 flex-shrink-0 text-indigo-400" />
                          <div>
                            <p className="font-medium text-slate-200">Recommendation</p>
                            <p className="text-xs mt-1 text-slate-400">Increase corner cushioning by 5mm for enhanced protection during air transport.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="tests" className="flex-1 p-4 space-y-4 mt-0">
              <div className="space-y-4">
                <h3 className="font-medium text-slate-200 mb-2">Available Simulations</h3>
                
                <div 
                  className={`border rounded-lg p-3 flex items-start gap-3 cursor-pointer transition-colors ${dropTestComplete ? 'bg-slate-800/30 border-slate-700' : 'border-indigo-600/70 bg-indigo-600/10 hover:bg-indigo-600/20'}`}
                  onClick={() => !simulationRunning && !dropTestComplete && runDropTest()}
                >
                  <div className="mt-0.5">
                    <ArrowDownCircle size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-200">Drop Test</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Simulates product impact from a 1-meter vertical drop. Analyzes cushioning effectiveness and product integrity.
                    </p>
                    {dropTestComplete && (
                      <div className="flex items-center mt-2 text-green-400 text-xs">
                        <Check size={12} className="mr-1" />
                        <span>Test Completed</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div 
                  className={`border rounded-lg p-3 flex items-start gap-3 cursor-pointer transition-colors ${flightSimComplete ? 'bg-slate-800/30 border-slate-700' : dropTestComplete ? 'border-indigo-600/70 bg-indigo-600/10 hover:bg-indigo-600/20' : 'border-slate-700/50 bg-slate-800/30 cursor-not-allowed'}`}
                  onClick={() => !simulationRunning && dropTestComplete && !flightSimComplete && runFlightSimulation()}
                >
                  <div className="mt-0.5">
                    <Plane size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-200">Air Transport Simulation</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Tests package performance under air transport conditions including pressure changes, vibration, and impact forces.
                    </p>
                    {!dropTestComplete && (
                      <div className="flex items-center mt-2 text-amber-500 text-xs">
                        <Info size={12} className="mr-1" />
                        <span>Complete drop test first</span>
                      </div>
                    )}
                    {flightSimComplete && (
                      <div className="flex items-center mt-2 text-green-400 text-xs">
                        <Check size={12} className="mr-1" />
                        <span>Test Completed</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border border-slate-700/50 bg-slate-800/30 rounded-lg p-3 flex items-start gap-3 cursor-not-allowed">
                  <div className="mt-0.5">
                    <Truck size={20} className="text-slate-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-200">Road Transport Simulation</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Simulates vibration and shock conditions during road transportation. Tests long-duration stress effects.
                    </p>
                    <div className="flex items-center mt-2 text-slate-500 text-xs">
                      <Info size={12} className="mr-1" />
                      <span>Premium feature</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default PackagingSimulationView;