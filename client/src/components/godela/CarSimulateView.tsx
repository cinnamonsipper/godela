/**
 * Car Simulate View
 * 
 * This component displays a unified interface for car aerodynamics simulation
 * using NVIDIA's DoMINO API for automotive aerodynamics.
 * It allows uploading STL files and configuring simulation parameters.
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wind, Droplets, ArrowDown, ArrowUp, Database, RefreshCw,
  SlidersHorizontal, Layers, Upload, BarChart4, LineChart,
  AlertCircle, FileCheck, CheckCircle2, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import useDemoStore from '@/store/useDemoStore';
import { 
  DEFAULT_SIMULATION_PARAMS, 
  callDoMINOAPI, 
  isDoMINOError,
  checkDoMINOAPIHealth,
  DoMINOInferenceResponse
} from '@/lib/modulusSchemas';

// Inline SVG of car for visualization (would be replaced with real 3D renderer)
const CarModelSVG = () => (
  <svg width="500" height="200" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d)">
      <path d="M110 120 L140 120 L150 100 L350 100 L360 120 L390 120 L390 140 L370 140 C370 152 360 160 350 160 C340 160 330 152 330 140 L170 140 C170 152 160 160 150 160 C140 160 130 152 130 140 L110 140 Z" 
        fill="url(#paint0_linear)" stroke="#30374F" strokeWidth="2" />
      <path d="M150 100 L170 60 L330 60 L350 100" fill="url(#paint1_linear)" stroke="#30374F" strokeWidth="2" />
      <circle cx="150" cy="140" r="20" fill="#1A1E2E" stroke="#30374F" strokeWidth="2" />
      <circle cx="150" cy="140" r="10" fill="#0D1017" stroke="#30374F" strokeWidth="1" />
      <circle cx="350" cy="140" r="20" fill="#1A1E2E" stroke="#30374F" strokeWidth="2" />
      <circle cx="350" cy="140" r="10" fill="#0D1017" stroke="#30374F" strokeWidth="1" />
      <path d="M180 60 L320 60" stroke="#30374F" strokeWidth="1" />
      <path d="M190 60 L190 100" stroke="#30374F" strokeWidth="1" />
      <path d="M310 60 L310 100" stroke="#30374F" strokeWidth="1" />
      <path d="M200 80 L300 80" stroke="#30374F" strokeWidth="1" />
      <rect x="220" y="90" width="60" height="10" fill="#1E2338" />
    </g>
    <defs>
      <filter id="filter0_d" x="0" y="0" width="500" height="200" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="2"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
      </filter>
      <linearGradient id="paint0_linear" x1="250" y1="100" x2="250" y2="160" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2E3652"/>
        <stop offset="1" stopColor="#181C2E"/>
      </linearGradient>
      <linearGradient id="paint1_linear" x1="250" y1="60" x2="250" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3D4361"/>
        <stop offset="1" stopColor="#2E3652"/>
      </linearGradient>
    </defs>
  </svg>
);

export default function CarSimulateView() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Visualization state
  const [activeView, setActiveView] = useState('pressure');
  const [showVectors, setShowVectors] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedModel, setSelectedModel] = useState('sample');
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Simulation parameters - strictly matching NVIDIA DoMINO API schema
  const [streamVelocity, setStreamVelocity] = useState(DEFAULT_SIMULATION_PARAMS.streamVelocity);
  const [stencilSize, setStencilSize] = useState(DEFAULT_SIMULATION_PARAMS.stencilSize);
  const [pointCloudSize, setPointCloudSize] = useState(DEFAULT_SIMULATION_PARAMS.pointCloudSize);
  const [inferenceEndpoint, setInferenceEndpoint] = useState<'full' | 'volume' | 'surface'>('full');
  
  // Simulation results data
  const [results, setResults] = useState({
    dragCoefficient: 0.32,
    liftCoefficient: -0.15,
    dragForce: 180, // Newtons
    liftForce: -120, // Newtons (negative means downforce)
    maxPressure: 1200, // Pascals
    minPressure: -800, // Pascals
    topSpeed: 250, // km/h
    efficiency: 82, // percentage
  });
  
  // API response data
  const [apiResponse, setApiResponse] = useState<DoMINOInferenceResponse | null>(null);

  // Check if the NVIDIA DoMINO API is available
  useEffect(() => {
    const checkApiAvailability = async () => {
      setApiStatus('checking');
      const healthResponse = await checkDoMINOAPIHealth();
      
      if (isDoMINOError(healthResponse)) {
        setApiStatus('unavailable');
        setErrorMessage(healthResponse.message);
        toast({
          title: "API Unavailable",
          description: healthResponse.message,
          variant: "destructive"
        });
      } else {
        setApiStatus('available');
        setErrorMessage(null);
      }
    };
    
    checkApiAvailability();
  }, [toast]);
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.name.toLowerCase().endsWith('.stl')) {
      setUploadedFile(file);
      setSelectedModel('upload');
      toast({
        title: "File Uploaded",
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB) uploaded successfully.`
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload an STL file.",
        variant: "destructive"
      });
    }
  };
  
  // Handle file drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.name.toLowerCase().endsWith('.stl')) {
      setUploadedFile(file);
      setSelectedModel('upload');
      toast({
        title: "File Uploaded",
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB) uploaded successfully.`
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload an STL file.",
        variant: "destructive"
      });
    }
  };
  
  // Trigger file dialog
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Sample STL Data (this would be a real STL file in production)
  const getSampleStlBlob = () => {
    // Simple placeholder STL data
    const sampleStl = `solid sample
      facet normal 0 0 1
        outer loop
          vertex 0 0 0
          vertex 1 0 0
          vertex 0 1 0
        endloop
      endfacet
    endsolid sample`;
    
    return new Blob([sampleStl], { type: 'application/sla' });
  };

  // Handle running a new simulation with the NVIDIA DoMINO API
  const handleRunSimulation = async () => {
    setIsRunning(true);
    setErrorMessage(null);
    
    try {
      // Get the STL file (either uploaded or sample)
      const stlFile = selectedModel === 'upload' && uploadedFile 
        ? uploadedFile 
        : getSampleStlBlob();
      
      // Call the DoMINO API
      const response = await callDoMINOAPI(
        stlFile,
        streamVelocity,
        stencilSize,
        pointCloudSize,
        inferenceEndpoint
      );
      
      if (isDoMINOError(response)) {
        // Handle error
        setErrorMessage(response.message);
        toast({
          title: "Simulation Failed",
          description: response.message,
          variant: "destructive"
        });
      } else {
        // Process successful response
        setApiResponse(response as DoMINOInferenceResponse);
        
        // Check if we got binary data
        const typedResponse = response as DoMINOInferenceResponse & { _binaryData?: any };
        if (typedResponse._binaryData) {
          console.log('Binary data received:', typedResponse._binaryData.size, 'bytes');
          
          // Show success toast with download option
          toast({
            title: "Simulation Complete",
            description: (
              <div className="flex flex-col">
                <span>The aerodynamic simulation has completed successfully.</span>
                <span className="text-xs mt-1">Binary data received: {(typedResponse._binaryData.size / 1024).toFixed(1)} KB</span>
                <button 
                  onClick={() => typedResponse._binaryData.download()}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs"
                >
                  Download Simulation Data
                </button>
              </div>
            )
          });
        } else {
          toast({
            title: "Simulation Complete",
            description: "The aerodynamic simulation has completed successfully."
          });
        }
        
        // Extract key metrics from response for the results panel
        // In a real implementation, these would be calculated from actual API response
        const velocityRatio = streamVelocity / 40;
        const forceFactor = velocityRatio * velocityRatio; // Force scales with square of velocity
        
        // Update results with simulated data
        // In a real implementation, these would come from the API response
        setResults({
          ...results,
          dragForce: Math.round(180 * forceFactor),
          liftForce: Math.round(-120 * forceFactor),
          maxPressure: Math.round(1200 * forceFactor),
          minPressure: Math.round(-800 * forceFactor),
          dragCoefficient: 0.32,
          liftCoefficient: -0.15,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(errorMsg);
      toast({
        title: "Simulation Error",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#10131E] to-[#0A0D14] text-white p-6 overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto">
        {/* 1. Visualization Area - Taking central focus */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="bg-[#161927]/70 backdrop-blur-sm border border-[#2A2F3F] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#2A2F3F] flex justify-between items-center">
              <h2 className="text-lg font-medium flex items-center">
                <LineChart size={18} className="mr-2 text-blue-400" />
                Visualization
              </h2>
              <div className="flex space-x-2">
                <Button 
                  variant={activeView === 'pressure' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveView('pressure')}
                  className={activeView === 'pressure' ? "bg-blue-600" : ""}
                >
                  Pressure
                </Button>
                <Button 
                  variant={activeView === 'velocity' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveView('velocity')}
                  className={activeView === 'velocity' ? "bg-blue-600" : ""}
                >
                  Velocity
                </Button>
                <Button 
                  variant={activeView === 'streamlines' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveView('streamlines')}
                  className={activeView === 'streamlines' ? "bg-blue-600" : ""}
                >
                  Streamlines
                </Button>
                <Button 
                  variant={activeView === 'forces' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveView('forces')}
                  className={activeView === 'forces' ? "bg-blue-600" : ""}
                >
                  Forces
                </Button>
              </div>
            </div>
            
            <div className="w-full h-[400px] bg-[#0D1017] relative">
              {/* Visualization area - This would be replaced with your actual visualizer */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isRunning ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw size={40} className="animate-spin mb-3 text-blue-500" />
                    <p className="text-white">Running simulation at {streamVelocity} m/s</p>
                    <p className="text-xs mt-1 text-gray-400">This may take a few moments...</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {/* This is where your visualization would go */}
                    <div className="relative">
                      <CarModelSVG />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-xs font-medium bg-black/70 text-white px-2 py-1 rounded">
                          {activeView === 'pressure' && 'Pressure Distribution View'}
                          {activeView === 'velocity' && 'Velocity Field View'}
                          {activeView === 'streamlines' && 'Airflow Streamlines View'}
                          {activeView === 'forces' && 'Surface Forces View'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 border-t border-[#2A2F3F] text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span>Low Pressure</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  <span>High Pressure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="show-vectors" checked={showVectors} onCheckedChange={setShowVectors} />
                  <Label htmlFor="show-vectors">Show Vectors</Label>
                </div>
              </div>
              <div>
                Powered by NVIDIA Modulus
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* 2. Controls & Results Area - Split into two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Simulation Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-[#161927]/70 backdrop-blur-sm border border-[#2A2F3F] rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <SlidersHorizontal size={18} className="mr-2 text-blue-400" />
                Simulation Controls
              </h2>
              
              <div className="space-y-5">
                {/* API Status Indicator */}
                {apiStatus !== 'available' && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>API Unavailable</AlertTitle>
                    <AlertDescription>
                      {apiStatus === 'checking' 
                        ? 'Checking DoMINO API availability...' 
                        : errorMessage || 'The NVIDIA DoMINO API is currently unavailable.'}
                    </AlertDescription>
                  </Alert>
                )}

                {/* File Upload Area */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept=".stl"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div 
                  className={`border-2 border-dashed rounded-lg p-4 mb-4 text-center transition-colors ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 hover:border-blue-400'
                  } ${selectedModel === 'upload' && uploadedFile ? 'bg-green-500/10 border-green-500' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={handleUploadClick}
                >
                  {selectedModel === 'upload' && uploadedFile ? (
                    <div className="flex flex-col items-center justify-center py-2">
                      <FileCheck className="h-8 w-8 text-green-500 mb-2" />
                      <p className="text-sm font-medium text-green-500">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-400">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                          setSelectedModel('sample');
                        }}
                      >
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <Upload className="h-8 w-8 text-blue-400 mb-2" />
                      <p className="text-sm">Drag and drop your STL file here</p>
                      <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                    </div>
                  )}
                </div>

                {/* Model Selection */}
                <div className="flex items-center justify-between p-3 bg-[#1A1E2E] rounded-lg">
                  <div className="flex items-center">
                    <Database size={16} className="mr-2 text-blue-400" />
                    <span className="text-sm">Model Source</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={selectedModel === 'sample' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedModel('sample')}
                      className={selectedModel === 'sample' ? "bg-blue-600" : ""}
                    >
                      Sample STL
                    </Button>
                    <Button
                      variant={selectedModel === 'upload' ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (uploadedFile) {
                          setSelectedModel('upload');
                        } else {
                          handleUploadClick();
                        }
                      }}
                      className={selectedModel === 'upload' ? "bg-blue-600" : ""}
                    >
                      Uploaded STL
                    </Button>
                  </div>
                </div>
                
                {/* Inference Endpoint Selection */}
                <div className="flex items-center justify-between p-3 bg-[#1A1E2E] rounded-lg">
                  <div className="flex items-center">
                    <LineChart size={16} className="mr-2 text-blue-400" />
                    <span className="text-sm">Inference Type</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={inferenceEndpoint === 'full' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setInferenceEndpoint('full')}
                      className={inferenceEndpoint === 'full' ? "bg-blue-600" : ""}
                      title="Get both volume and surface predictions"
                    >
                      Full
                    </Button>
                    <Button
                      variant={inferenceEndpoint === 'volume' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInferenceEndpoint('volume')}
                      className={inferenceEndpoint === 'volume' ? "bg-blue-600" : ""}
                      title="Get only volume predictions"
                    >
                      Volume
                    </Button>
                    <Button
                      variant={inferenceEndpoint === 'surface' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInferenceEndpoint('surface')}
                      className={inferenceEndpoint === 'surface' ? "bg-blue-600" : ""}
                      title="Get only surface predictions"
                    >
                      Surface
                    </Button>
                  </div>
                </div>
                
                {/* Stream Velocity Parameter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Wind size={16} className="mr-2 text-blue-400" />
                      <label className="text-sm">Stream Velocity</label>
                    </div>
                    <span className="text-sm text-blue-300">{streamVelocity} m/s</span>
                  </div>
                  <Slider
                    value={[streamVelocity]}
                    min={10}
                    max={100}
                    step={5}
                    onValueChange={(value) => setStreamVelocity(value[0])}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    (~{Math.round(streamVelocity * 2.237)} mph or ~{Math.round(streamVelocity * 3.6)} km/h)
                  </p>
                </div>
                

                
                {/* Advanced Parameters (Stencil Size and Point Cloud) */}
                <div>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <Layers size={16} className="mr-2 text-blue-400" />
                      <label className="text-sm">Stencil Size</label>
                    </div>
                    <span className="text-sm text-blue-300">{stencilSize}</span>
                  </div>
                  <Slider
                    value={[stencilSize]}
                    min={1}
                    max={3}
                    step={1}
                    onValueChange={(value) => setStencilSize(value[0])}
                    className="cursor-pointer"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <BarChart4 size={16} className="mr-2 text-blue-400" />
                      <label className="text-sm">Point Cloud Size</label>
                    </div>
                    <span className="text-sm text-blue-300">{pointCloudSize.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[pointCloudSize]}
                    min={5000}
                    max={50000}
                    step={5000}
                    onValueChange={(value) => setPointCloudSize(value[0])}
                    className="cursor-pointer"
                  />
                </div>
                
                {/* Run Simulation Button */}
                <Button
                  onClick={handleRunSimulation}
                  disabled={isRunning}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                  size="lg"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      <span>Simulating...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} className="mr-2" />
                      <span>Run Simulation</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Right: Results Area */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-[#161927]/70 backdrop-blur-sm border border-[#2A2F3F] rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <Database size={18} className="mr-2 text-blue-400" />
                Simulation Results
              </h2>
              
              {errorMessage ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Simulation Error</AlertTitle>
                  <AlertDescription>
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {/* API Status Indicator */}
                  {apiStatus === 'available' && apiResponse && (
                    <Alert className="bg-green-900/20 border-green-800/30 text-green-400 mb-4">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>API Connected</AlertTitle>
                      <AlertDescription className="text-green-300">
                        Successfully connected to NVIDIA DoMINO API and received simulation data.
                      </AlertDescription>
                    </Alert>
                  )}
                
                  {/* Results Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1A1E2E] rounded-lg p-3">
                      <div className="flex items-center mb-1 text-xs text-gray-400">
                        <ArrowDown size={14} className="mr-1 text-red-400" />
                        Drag Force
                      </div>
                      <div className="text-lg font-medium">{results.dragForce} N</div>
                    </div>
                    
                    <div className="bg-[#1A1E2E] rounded-lg p-3">
                      <div className="flex items-center mb-1 text-xs text-gray-400">
                        <ArrowUp size={14} className="mr-1 text-green-400" />
                        Lift Force
                      </div>
                      <div className="text-lg font-medium">{results.liftForce} N</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1A1E2E] rounded-lg p-3">
                      <div className="flex items-center mb-1 text-xs text-gray-400">
                        <Database size={14} className="mr-1 text-blue-400" />
                        Drag Coefficient
                      </div>
                      <div className="text-lg font-medium">{results.dragCoefficient.toFixed(2)}</div>
                    </div>
                    
                    <div className="bg-[#1A1E2E] rounded-lg p-3">
                      <div className="flex items-center mb-1 text-xs text-gray-400">
                        <Droplets size={14} className="mr-1 text-blue-400" />
                        Lift Coefficient
                      </div>
                      <div className="text-lg font-medium">{results.liftCoefficient.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1E2E] rounded-lg p-3">
                    <div className="flex items-center mb-1 text-xs text-gray-400">
                      <Wind size={14} className="mr-1 text-purple-400" />
                      Pressure Range
                    </div>
                    <div className="text-sm">
                      <span className="text-red-400">{results.minPressure}</span>
                      <span className="mx-2 text-gray-500">to</span>
                      <span className="text-green-400">{results.maxPressure}</span>
                      <span className="ml-1 text-xs text-gray-500">Pa</span>
                    </div>
                  </div>
                  
                  {/* API Stats */}
                  {apiResponse && (
                    <div className="bg-[#1A1E2E] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
                        <div className="flex items-center">
                          <Database size={14} className="mr-1 text-blue-400" />
                          <span className="font-medium">API Response Summary</span>
                        </div>
                        
                        {/* Binary Data Download Button */}
                        {((apiResponse as any)._binaryData) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-0 h-6"
                            onClick={() => (apiResponse as any)._binaryData.download()}
                          >
                            <Download size={12} className="mr-1" />
                            Download Binary
                          </Button>
                        )}
                      </div>
                      
                      {/* Binary Data Size */}
                      {((apiResponse as any)._binaryData) && (
                        <div className="text-xs text-gray-300 mb-2 flex justify-between">
                          <span>Binary Data Size:</span>
                          <span className="text-green-400">
                            {((apiResponse as any)._binaryData.size / 1024).toFixed(2)} KB
                          </span>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-300 space-y-1">
                        {inferenceEndpoint !== 'surface' && (
                          <>
                            <div className="flex justify-between">
                              <span>Volume Points:</span>
                              <span className="text-blue-300">{apiResponse.coordinates ? apiResponse.coordinates.length.toLocaleString() : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>SDF Values:</span>
                              <span className="text-blue-300">{apiResponse.sdf ? apiResponse.sdf.length.toLocaleString() : 'N/A'}</span>
                            </div>
                          </>
                        )}
                        
                        {inferenceEndpoint !== 'volume' && (
                          <>
                            <div className="flex justify-between">
                              <span>Surface Points:</span>
                              <span className="text-blue-300">{(apiResponse as any).surface_coordinates ? (apiResponse as any).surface_coordinates.length.toLocaleString() : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Surface Pressure Values:</span>
                              <span className="text-blue-300">{(apiResponse as any).pressure_surface ? (apiResponse as any).pressure_surface.length.toLocaleString() : 'N/A'}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Physics Details */}
                  <div className="text-xs text-gray-400 border-t border-[#2A2F3F] pt-4 mt-4">
                    <h3 className="font-medium mb-2">Simulation Parameters</h3>
                    <div className="grid grid-cols-2 gap-y-1">
                      <div>Flow Velocity:</div>
                      <div className="text-blue-300">{streamVelocity} m/s</div>
                      
                      <div>Reynolds Number:</div>
                      <div className="text-blue-300">{Math.round(streamVelocity * 45000)}</div>
                      
                      <div>Stencil Size:</div>
                      <div className="text-blue-300">{stencilSize}</div>
                      
                      <div>Point Cloud Size:</div>
                      <div className="text-blue-300">{pointCloudSize.toLocaleString()}</div>
                      
                      <div>Turbulence Model:</div>
                      <div className="text-blue-300">k-ω SST</div>
                      
                      <div>Physics Model:</div>
                      <div className="text-blue-300">RANS</div>
                      
                      <div>Inference Type:</div>
                      <div className="text-blue-300">{inferenceEndpoint.charAt(0).toUpperCase() + inferenceEndpoint.slice(1)}</div>
                      
                      <div>Model Source:</div>
                      <div className="text-blue-300">{selectedModel === 'sample' ? 'Sample STL' : uploadedFile?.name || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}