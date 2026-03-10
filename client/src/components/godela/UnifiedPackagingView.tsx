import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, Package2, Box, Upload, CheckCircle, RotateCw, Shield, Recycle, Leaf } from 'lucide-react';

// Import GIFs directly
import dropGif from '../../assets/des_drop_filling_rates.gif';
import comparisonGif from '../../assets/des_sph_comparison.gif';

// Types for the component props
interface UnifiedPackagingViewProps {
  stage: 'upload' | 'design' | 'simulation';
  currentStep: number;
  expectedResponse?: string;
  onStepComplete: (response: string) => void;
}

/**
 * A unified view for all packaging design stages that maintains 
 * the same view across all steps without reloading
 */
export default function UnifiedPackagingView({ 
  stage, 
  currentStep, 
  expectedResponse = '', 
  onStepComplete 
}: UnifiedPackagingViewProps) {
  // Animation states for smooth transitions
  const [showUploaded, setShowUploaded] = useState(false);
  const [showPackaging, setShowPackaging] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  
  // State for packaging design parameters
  const [packagingParams, setPackagingParams] = useState({
    recycledMaterials: 60,
    recyclability: 80,
    stability: 70,
    strength: 50,
    weight: 30,
    cost: 20
  });
  
  // State for the simulation results
  const [simulationResults, setSimulationResults] = useState<{
    dropTest: boolean;
    vibrationTest: boolean;
    impactTest: boolean;
    compressionTest: boolean;
  }>({
    dropTest: false,
    vibrationTest: false,
    impactTest: false,
    compressionTest: false
  });
  
  // State for simulation loading
  const [isSimulating, setIsSimulating] = useState(false);
  
  // References for any file inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Effect to handle stage transitions
  useEffect(() => {
    // For the upload stage, reset the state to initial
    if (stage === 'upload') {
      setShowUploaded(false);
      setShowPackaging(false);
      setShowSimulation(false);
    }
    
    // For the design stage, show the uploaded model but not the packaging yet
    if (stage === 'design') {
      setShowUploaded(true);
      // The packaging will be shown only when the Generate Packaging button is clicked
      setShowPackaging(false);
    }
    
    // For the simulation stage, show both models and run tests
    if (stage === 'simulation') {
      setShowUploaded(true);
      setShowPackaging(true);
      
      // After a delay, show the simulation results
      const timer = setTimeout(() => {
        setShowSimulation(true);
        
        // Run the simulation tests sequentially
        const dropTimer = setTimeout(() => {
          setSimulationResults(prev => ({ ...prev, dropTest: true }));
          
          const vibrationTimer = setTimeout(() => {
            setSimulationResults(prev => ({ ...prev, vibrationTest: true }));
            
            const impactTimer = setTimeout(() => {
              setSimulationResults(prev => ({ ...prev, impactTest: true }));
              
              const compressionTimer = setTimeout(() => {
                setSimulationResults(prev => ({ ...prev, compressionTest: true }));
              }, 800);
              
              return () => clearTimeout(compressionTimer);
            }, 800);
            
            return () => clearTimeout(impactTimer);
          }, 800);
          
          return () => clearTimeout(vibrationTimer);
        }, 800);
        
        return () => clearTimeout(dropTimer);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [stage]);
  
  // Handle file upload for product model
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload the file to the server
      // For now, we'll just simulate it
      setShowUploaded(true);
      
      // Simulate processing time
      setTimeout(() => {
        onStepComplete("Product model uploaded successfully");
      }, 1500);
    }
  };
  
  // Handle generating packaging design
  const handleGeneratePackaging = () => {
    setShowPackaging(true);
    
    // Simulate processing time
    setTimeout(() => {
      onStepComplete("Generated packaging with " + 
        packagingParams.recycledMaterials + "% recycled materials, " +
        packagingParams.strength + "% strength, and " +
        packagingParams.stability + "% stability."
      );
    }, 1500);
  };
  
  // Handle running simulation
  const handleRunSimulation = () => {
    // Set simulation state to loading first
    setShowSimulation(true);
    setIsSimulating(true);
    
    // Show loading for 5 seconds
    setTimeout(() => {
      // After loading, show the actual simulation results
      setIsSimulating(false);
      
      // Run the simulation tests sequentially
      setTimeout(() => {
        setSimulationResults(prev => ({ ...prev, dropTest: true }));
        
        setTimeout(() => {
          setSimulationResults(prev => ({ ...prev, vibrationTest: true }));
          
          setTimeout(() => {
            setSimulationResults(prev => ({ ...prev, impactTest: true }));
            
            setTimeout(() => {
              setSimulationResults(prev => ({ ...prev, compressionTest: true }));
              
              // Complete the step
              onStepComplete("Simulation complete. All tests passed!");
            }, 800);
          }, 800);
        }, 800);
      }, 200);
    }, 5000); // 5 second loading animation
  };
  
  // Render file upload UI for the upload stage
  const renderUploadStage = () => (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-3 text-center"
      >
        <h2 className="text-lg font-light mb-1 text-white">Upload Product Model</h2>
        <p className="text-blue-200/80 text-xs">
          Upload your product file to design optimal protective packaging
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 shadow-lg w-full"
      >
        <div 
          className="border-2 border-dashed border-slate-600/50 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" strokeWidth={1} />
          <h3 className="text-slate-300 text-sm font-medium">Drop your file here</h3>
          <p className="text-slate-400 text-xs">or click to browse</p>
          <p className="text-slate-500 text-xs mt-1">Supports .STL, .STEP, .OBJ</p>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".stl,.step,.obj"
          />
        </div>
        
        <div className="mt-3 flex justify-center">
          <Button 
            variant="default" 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              // Simulate file upload
              setShowUploaded(true);
              
              setTimeout(() => {
                onStepComplete("Product model uploaded successfully");
              }, 1500);
            }}
          >
            <span>Use Demo Model</span>
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
  
  // Helper function to render a slider
  const PackagingSlider = ({
    name,
    icon,
    value,
    onChange
  }: {
    name: string;
    icon: React.ReactNode;
    value: number;
    onChange: (value: number) => void;
  }) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          {icon}
          <span className="text-slate-300 text-xs font-medium ml-1 uppercase">{name}</span>
        </div>
        <span className="text-slate-400 text-xs">{value}%</span>
      </div>
      <Slider 
        value={[value]} 
        min={0} 
        max={100} 
        step={1}
        onValueChange={(values) => onChange(values[0])}
        className="my-1"
      />
    </div>
  );
  
  // Render packaging design UI for the design stage
  const renderDesignStage = () => (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-3 text-center"
      >
        <h2 className="text-lg font-light mb-1 text-white">Design Protective Packaging</h2>
        <p className="text-blue-200/80 text-xs">
          {!showPackaging ? 
            "Adjust parameters below, then generate packaging" : 
            "Packaging generated! Review and proceed to simulation"
          }
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 shadow-lg w-full"
      >
        <div className="mb-4">
          <PackagingSlider 
            name="Recycled Materials" 
            icon={<Recycle className="h-3 w-3 text-green-400" />} 
            value={packagingParams.recycledMaterials}
            onChange={(value) => setPackagingParams({...packagingParams, recycledMaterials: value})}
          />
          
          <PackagingSlider 
            name="Recyclability" 
            icon={<Leaf className="h-3 w-3 text-green-400" />} 
            value={packagingParams.recyclability}
            onChange={(value) => setPackagingParams({...packagingParams, recyclability: value})}
          />
          
          <PackagingSlider 
            name="Stability" 
            icon={<Box className="h-3 w-3 text-blue-400" />} 
            value={packagingParams.stability}
            onChange={(value) => setPackagingParams({...packagingParams, stability: value})}
          />
          
          <PackagingSlider 
            name="Strength" 
            icon={<Shield className="h-3 w-3 text-blue-400" />} 
            value={packagingParams.strength}
            onChange={(value) => setPackagingParams({...packagingParams, strength: value})}
          />
          
          <PackagingSlider 
            name="Weight" 
            icon={<Package2 className="h-3 w-3 text-purple-400" />} 
            value={packagingParams.weight}
            onChange={(value) => setPackagingParams({...packagingParams, weight: value})}
          />
          
          <PackagingSlider 
            name="Cost" 
            icon={<span className="text-amber-400 text-xs font-bold">$</span>} 
            value={packagingParams.cost}
            onChange={(value) => setPackagingParams({...packagingParams, cost: value})}
          />
        </div>
        
        <div className="mt-3 flex justify-center">
          {!showPackaging ? (
            <Button 
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleGeneratePackaging}
            >
              <span>Generate Packaging</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          ) : (
            <Button 
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onStepComplete("Generated optimal packaging for the product")}
            >
              <span>Proceed to Simulation</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
  
  // Render simulation UI for the simulation stage
  const renderSimulationStage = () => (
    <div className={`flex flex-col h-full ${showSimulation ? 'w-full' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-3 text-center"
      >
        <h2 className="text-lg font-light mb-1 text-white">Simulate Packaging Performance</h2>
        <p className="text-blue-200/80 text-xs">
          Test packaging under various shipping and handling conditions
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 shadow-lg w-full"
      >
        {/* Loading animation */}
        {showSimulation && isSimulating && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="relative h-24 w-24">
              {/* Outer rotating circle */}
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-blue-400/50"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
              
              {/* Middle rotating circle */}
              <motion.div 
                className="absolute inset-4 rounded-full border-4 border-transparent border-t-green-400 border-l-green-400/50"
                animate={{ rotate: -360 }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
              
              {/* Inner circle pulse */}
              <motion.div 
                className="absolute inset-8 rounded-full bg-purple-500/30"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </div>
            
            <motion.div 
              className="mt-6 text-center"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-blue-300 text-sm font-medium">Running Physical Simulation</p>
              <p className="text-slate-400 text-xs mt-1">Calculating particle dynamics</p>
            </motion.div>
          </div>
        )}
        
        {/* Simulation visualization (GIFs) */}
        {showSimulation && !isSimulating && simulationResults.dropTest && (
          <div className={`mb-3 ${stage === 'simulation' && showSimulation ? 'flex flex-col md:flex-row gap-4 items-center justify-center' : 'space-y-3'}`}>
            {/* Drop Test GIF */}
            <div className={`rounded-lg overflow-hidden bg-slate-900/50 border border-slate-700/30 ${stage === 'simulation' && showSimulation ? 'md:w-1/2' : 'w-full'}`}>
              <img 
                src={dropGif} 
                alt="Drop Test Simulation" 
                className="w-full object-cover"
              />
              <div className="p-2 text-center">
                <span className={`${stage === 'simulation' && showSimulation ? 'text-sm' : 'text-xs'} text-slate-300`}>Particle Filling Simulation</span>
              </div>
            </div>
            
            {/* SPH Comparison GIF */}
            <div className={`rounded-lg overflow-hidden bg-slate-900/50 border border-slate-700/30 ${stage === 'simulation' && showSimulation ? 'md:w-1/2' : 'w-full'}`}>
              <img 
                src={comparisonGif} 
                alt="Physics Model Comparison" 
                className="w-full object-cover"
              />
              <div className="p-2 text-center">
                <span className={`${stage === 'simulation' && showSimulation ? 'text-sm' : 'text-xs'} text-slate-300`}>DES/SPH Physics Comparison</span>
              </div>
            </div>
          </div>
        )}
        
        <div className={`${stage === 'simulation' && showSimulation && !isSimulating ? 'flex flex-row justify-center gap-6 mb-6' : 'grid grid-cols-2 gap-3 mb-3'}`}>
          <div className={`bg-slate-900/50 p-3 rounded-lg border border-slate-700/30 ${stage === 'simulation' && showSimulation && !isSimulating ? 'w-1/4' : ''}`}>
            <h3 className={`text-slate-300 ${stage === 'simulation' && showSimulation && !isSimulating ? 'text-sm' : 'text-xs'} font-medium mb-1 flex items-center`}>
              <RotateCw className={`${stage === 'simulation' && showSimulation && !isSimulating ? 'h-4 w-4' : 'h-3 w-3'} mr-1 text-blue-400`} /> 
              Simulation Tests
            </h3>
            <div className={`text-slate-400 ${stage === 'simulation' && showSimulation && !isSimulating ? 'text-sm' : 'text-xs'} space-y-1`}>
              {isSimulating ? (
                <>
                  <p className="flex items-center">
                    <motion.div 
                      className="h-3 w-3 mr-1 rounded-full bg-blue-500/50"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    Running Drop Test...
                  </p>
                  <p className="flex items-center">
                    <motion.div 
                      className="h-3 w-3 mr-1 rounded-full bg-blue-500/20"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    />
                    Preparing Vibration Test...
                  </p>
                  <p className="flex items-center">
                    <motion.div 
                      className="h-3 w-3 mr-1 rounded-full bg-blue-500/10"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                    />
                    Impact Test Queued
                  </p>
                  <p className="flex items-center">
                    <span className="h-3 w-3 mr-1 rounded-full border border-slate-600"></span>
                    Compression Test Queued
                  </p>
                </>
              ) : (
                <>
                  <p className="flex items-center">
                    {simulationResults.dropTest ? 
                      <CheckCircle className={`${stage === 'simulation' && showSimulation && !isSimulating ? 'h-4 w-4' : 'h-3 w-3'} mr-1 text-green-500`} /> : 
                      <span className={`${stage === 'simulation' && showSimulation && !isSimulating ? 'h-4 w-4' : 'h-3 w-3'} mr-1 rounded-full border border-slate-600`}></span>
                    }
                    Drop Test (1.2m)
                  </p>
                  <p className="flex items-center">
                    {simulationResults.vibrationTest ? 
                      <CheckCircle className={`${stage === 'simulation' && showSimulation && !isSimulating ? 'h-4 w-4' : 'h-3 w-3'} mr-1 text-green-500`} /> : 
                      <span className={`${stage === 'simulation' && showSimulation && !isSimulating ? 'h-4 w-4' : 'h-3 w-3'} mr-1 rounded-full border border-slate-600`}></span>
                    }
                    Vibration Test
                  </p>
                  <p className="flex items-center">
                    {simulationResults.impactTest ? 
                      <CheckCircle className={`${stage === 'simulation' && showSimulation && !isSimulating ? 'h-4 w-4' : 'h-3 w-3'} mr-1 text-green-500`} /> : 
                      <span className={`${stage === 'simulation' && showSimulation && !isSimulating ? 'h-4 w-4' : 'h-3 w-3'} mr-1 rounded-full border border-slate-600`}></span>
                    }
                    Impact Test
                  </p>
                  <p className="flex items-center">
                    {simulationResults.compressionTest ? 
                      <CheckCircle className={`${stage === 'simulation' && showSimulation && !isSimulating ? 'h-4 w-4' : 'h-3 w-3'} mr-1 text-green-500`} /> : 
                      <span className={`${stage === 'simulation' && showSimulation && !isSimulating ? 'h-4 w-4' : 'h-3 w-3'} mr-1 rounded-full border border-slate-600`}></span>
                    }
                    Compression Test
                  </p>
                </>
              )}
            </div>
          </div>
          
          <div className={`bg-slate-900/50 p-3 rounded-lg border border-slate-700/30 ${stage === 'simulation' && showSimulation && !isSimulating ? 'w-1/4' : ''}`}>
            <h3 className={`text-slate-300 ${stage === 'simulation' && showSimulation && !isSimulating ? 'text-sm' : 'text-xs'} font-medium mb-1 flex items-center`}>
              <Shield className={`${stage === 'simulation' && showSimulation && !isSimulating ? 'h-4 w-4' : 'h-3 w-3'} mr-1 text-blue-400`} /> 
              Protection Metrics
            </h3>
            <div className={`text-slate-400 ${stage === 'simulation' && showSimulation && !isSimulating ? 'text-sm' : 'text-xs'} space-y-0.5`}>
              {isSimulating ? (
                <div className="italic text-slate-500">
                  <motion.div
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <p>Computing metrics...</p>
                    <div className="h-2 w-full bg-slate-700/30 rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        className="h-full bg-blue-500/50 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, ease: "easeInOut" }}
                      />
                    </div>
                  </motion.div>
                </div>
              ) : showSimulation ? (
                <>
                  <p>Shock Absorption: 95%</p>
                  <p>Vibration Dampening: 88%</p>
                  <p>Corner Protection: 97%</p>
                  <p>Overall Rating: Excellent</p>
                </>
              ) : (
                <p className="italic text-slate-500">Run simulation to see results</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex justify-center">
          {!showSimulation ? (
            <Button 
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleRunSimulation}
            >
              <span>Run Simulation</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          ) : isSimulating ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 3 }}
              className="text-slate-400 text-xs"
            >
              Simulation in progress...
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <Button 
                variant="default"
                size={stage === 'simulation' && showSimulation ? "default" : "sm"}
                className={`${stage === 'simulation' && showSimulation ? 
                  'bg-green-600 hover:bg-green-700 text-white py-6 px-8 text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-105' : 
                  'bg-green-600 hover:bg-green-700 text-white'}`}
                onClick={() => onStepComplete("Simulation complete. All tests passed!")}
              >
                <span>Download Packaging Report</span>
                <ArrowRight className={`ml-2 ${stage === 'simulation' && showSimulation ? 'h-5 w-5' : 'h-3 w-3'}`} />
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
  
  // Simple visual representation of the 3D model
  const renderVisualModel = () => {
    const getProductStyle = () => {
      if (!showUploaded) return {};
      return {
        opacity: 1,
        transform: 'scale(1) translateY(0px) rotate(0deg)',
      };
    };
    
    const getPackagingStyle = () => {
      if (!showPackaging) return { opacity: 0, transform: 'scale(0.8) translateY(20px)' };
      
      // Show different opacity levels based on the recycled materials percentage
      const opacity = 0.2 + (packagingParams.recycledMaterials / 300); // Max 0.53 opacity
      
      // Scale based on the weight parameter - lighter weight means bigger package
      const scaleFactor = 1.15 + ((100 - packagingParams.weight) / 400); // Range 1.15 - 1.4
      
      return {
        opacity: opacity,
        transform: `scale(${scaleFactor}) translateY(0px) rotate(0deg)`,
      };
    };
    
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
        {/* Visual effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full"></div>
        </div>
        
        {/* Simple visual representations instead of 3D models */}
        <div className="relative">
          {/* Product visualization - Milk Carton */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={getProductStyle()}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative w-32 h-48 shadow-lg"
            style={{ 
              perspective: "1000px", 
              transformStyle: "preserve-3d",
              transform: "rotateX(15deg) rotateY(15deg)"
            }}
          >
            {/* Milk carton body */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-sm">
              {/* Top of the carton (angled) */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-blue-200 transform-gpu origin-bottom -skew-x-12 rounded-t-sm border-b border-blue-300"></div>
              
              {/* Carton cap */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-blue-300 rounded-sm z-10">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-2 bg-blue-400 rounded-full"></div>
              </div>
              
              {/* Product label */}
              <div className="absolute top-12 left-2 right-2 bottom-8 bg-white/70 backdrop-blur-sm rounded-sm p-1">
                <div className="h-2 w-16 mx-auto mb-1 bg-blue-500/30 rounded-full"></div>
                <div className="h-1 w-12 mx-auto mb-2 bg-blue-500/30 rounded-full"></div>
                <div className="flex flex-col items-center justify-center h-16">
                  <span className="text-blue-800/70 text-[10px] font-medium">MILK</span>
                  <span className="text-blue-800/50 text-[6px]">PRODUCT</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Packaging visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={getPackagingStyle()}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
            className="absolute -inset-4 bg-transparent"
            style={{ 
              perspective: "1000px", 
              transformStyle: "preserve-3d",
              transform: "rotateX(15deg) rotateY(15deg)"
            }}
          >
            {/* Protective packaging structure */}
            <div className="absolute -inset-4 bg-gradient-to-br from-green-300/10 to-green-500/10 rounded-lg backdrop-blur-sm">
              {/* Corner protection elements */}
              <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-green-300/30 to-green-400/20 rounded-tl-lg border border-green-400/20"></div>
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-green-300/30 to-green-400/20 rounded-tr-lg border border-green-400/20"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-green-300/30 to-green-400/20 rounded-bl-lg border border-green-400/20"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-br from-green-300/30 to-green-400/20 rounded-br-lg border border-green-400/20"></div>
              
              {/* Absorption material visualization - honeycomb pattern */}
              <div className="absolute inset-12 flex items-center justify-center">
                <div className="w-full h-full grid grid-cols-6 grid-rows-6 gap-[2px]">
                  {Array(36).fill(0).map((_, i) => (
                    <div key={i} className="bg-green-400/10 border border-green-400/5 rounded-sm"></div>
                  ))}
                </div>
              </div>
              
              {/* Parameter indicators */}
              <div className="absolute top-2 right-2 flex items-center space-x-1">
                {/* Recycled materials indicator */}
                <div className="h-4 w-4 rounded-full flex items-center justify-center bg-green-400/20" 
                     style={{ opacity: packagingParams.recycledMaterials / 100 }}>
                  <Recycle className="h-2 w-2 text-green-600/60" />
                </div>
                
                {/* Strength indicator */}
                <div className="h-4 w-4 rounded-full flex items-center justify-center bg-blue-400/20"
                     style={{ opacity: packagingParams.strength / 100 }}>
                  <Shield className="h-2 w-2 text-blue-600/60" />
                </div>
                
                {/* Stability indicator */}
                <div className="h-4 w-4 rounded-full flex items-center justify-center bg-blue-400/20"
                     style={{ opacity: packagingParams.stability / 100 }}>
                  <Box className="h-2 w-2 text-blue-600/60" />
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Simulation effects */}
          {showSimulation && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.7, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                className="absolute -inset-4 border-2 border-purple-500/30 rounded-xl"
              ></motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay: 0.5 }}
                className="absolute -inset-8 border border-purple-400/20 rounded-xl"
              ></motion.div>
            </>
          )}
        </div>
        
        {/* Stage indicator */}
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-700/50">
          <div className="flex items-center space-x-2 text-sm">
            <span className={`h-2 w-2 rounded-full ${
              stage === 'upload' ? 'bg-blue-500' : 
              stage === 'design' ? 'bg-green-500' : 
              'bg-purple-500'
            }`}></span>
            <span className="text-slate-300">
              {stage === 'upload' ? 'Upload' : 
               stage === 'design' ? 'Design' : 
               'Simulation'}
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  // Render the appropriate UI based on the current stage
  const renderStageUI = () => {
    switch (stage) {
      case 'upload':
        return renderUploadStage();
      case 'design':
        return renderDesignStage();
      case 'simulation':
        return renderSimulationStage();
      default:
        return renderUploadStage();
    }
  };
  
  return (
    <div className="relative h-full w-full">
      {/* Visual Model View - Always present (full screen) */}
      <div className="w-full h-full">
        {renderVisualModel()}
      </div>
      
      {/* Glass overlay control panel - Expands when showing simulation GIFs */}
      <div className={`absolute ${
        stage === 'simulation' && showSimulation 
          ? 'inset-4 p-6 flex flex-col items-center justify-center'  /* Expanded for simulation GIFs */
          : 'top-4 right-4 md:w-[320px] max-h-[80vh] p-4 flex flex-col'  /* Normal size */
        } 
        bg-slate-900/60 backdrop-blur-md rounded-lg border border-slate-700/50 
        shadow-xl overflow-y-auto z-10 transition-all duration-700`}>
        {renderStageUI()}
      </div>
    </div>
  );
}