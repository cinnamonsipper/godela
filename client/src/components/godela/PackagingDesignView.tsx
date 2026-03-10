import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Edit, Package, Check, Download, Save, PackageOpen } from 'lucide-react';
import ConsolidatedSTLViewer from './ConsolidatedSTLViewer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface PackagingDesignViewProps {
  onStepComplete: (response: string) => void;
  expectedResponse: string;
  currentStep: number;
}

const PackagingDesignView: React.FC<PackagingDesignViewProps> = ({ 
  onStepComplete,
  expectedResponse,
  currentStep
}) => {
  const [packagingGenerated, setPackagingGenerated] = useState(currentStep >= 3);
  const [cushionThickness, setCushionThickness] = useState(20);
  const [boxType, setBoxType] = useState('corrugate');
  const [packagingMaterial, setPackagingMaterial] = useState('expanded-polystyrene');
  const [showPackaging, setShowPackaging] = useState(true);
  const [showProduct, setShowProduct] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [designProgress, setDesignProgress] = useState(0);
  const [generatingDesign, setGeneratingDesign] = useState(false);

  useEffect(() => {
    if (currentStep === 3 && !packagingGenerated && !generatingDesign) {
      // This simulates the packaging being generated after the user asks for it
      handleGeneratePackaging();
    }
  }, [currentStep, packagingGenerated, generatingDesign]);

  const handleGeneratePackaging = () => {
    setGeneratingDesign(true);
    setDesignProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setDesignProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPackagingGenerated(true);
          setGeneratingDesign(false);
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 100);
  };

  const handleSliderChange = (value: number[]) => {
    setCushionThickness(value[0]);
  };

  return (
    <motion.div
      className="h-full w-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6">
        {/* 3D viewer and controls */}
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
                  disabled={!packagingGenerated}
                >
                  <PackageOpen size={16} />
                </button>
                <button 
                  className={`rounded-md p-1.5 transition-colors ${isRotating ? 'bg-indigo-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'}`}
                  onClick={() => setIsRotating(!isRotating)}
                  title="Toggle Auto-Rotation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 16h5v5" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="w-full h-full">
              {generatingDesign ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6">
                  <div className="w-20 h-20 border-4 border-t-indigo-500 border-slate-700/30 rounded-full animate-spin mb-4"></div>
                  <h3 className="text-lg font-medium text-slate-200 mb-2">Generating Packaging Design</h3>
                  <div className="w-64 bg-slate-800 rounded-full h-2 mb-3">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${Math.min(designProgress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-slate-400 text-sm">{Math.min(Math.round(designProgress), 100)}% complete</p>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <ConsolidatedSTLViewer
                    className="w-full h-full"
                    modelPath="/bottle.stl"
                  />
                  {packagingGenerated && (
                    <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm flex items-center">
                      <Check size={14} className="mr-1" />
                      Packaging Design Complete
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          {packagingGenerated && (
            <div className="mt-4 flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1 bg-slate-800 hover:bg-slate-700 border-slate-700"
                onClick={() => onStepComplete(expectedResponse)}
              >
                <Download size={16} className="mr-2" />
                Download Design (STEP)
              </Button>
              <Button 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => onStepComplete(expectedResponse)}
              >
                {expectedResponse === "Run a 1 meter drop test." ? (
                  <>
                    <PackageOpen size={16} className="mr-2" />
                    Run Drop Test
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Design
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Right sidebar controls */}
        <div className="lg:w-80 xl:w-96 bg-slate-900/70 backdrop-blur-lg rounded-xl border border-slate-700/50 flex flex-col">
          <Tabs defaultValue="design" className="flex flex-col h-full">
            <div className="border-b border-slate-700/50">
              <TabsList className="w-full bg-transparent border-b border-slate-700/50 rounded-none h-14">
                <TabsTrigger 
                  value="design" 
                  className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:shadow-none rounded-none"
                >
                  <Edit size={15} className="mr-2" />
                  <span>Design</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="properties" 
                  className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:shadow-none rounded-none"
                >
                  <Sliders size={15} className="mr-2" />
                  <span>Properties</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="design" className="flex-1 p-4 space-y-6 mt-0">
              <div>
                <h3 className="font-medium text-slate-200 mb-3">Box Type</h3>
                <Select 
                  value={boxType} 
                  onValueChange={setBoxType}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectGroup>
                      <SelectItem value="corrugate">Corrugated Box</SelectItem>
                      <SelectItem value="folding-carton">Folding Carton</SelectItem>
                      <SelectItem value="rigid-box">Rigid Box</SelectItem>
                      <SelectItem value="mailer">Padded Mailer</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-medium text-slate-200 mb-3">Cushioning Material</h3>
                <Select 
                  value={packagingMaterial} 
                  onValueChange={setPackagingMaterial}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectGroup>
                      <SelectItem value="expanded-polystyrene">Expanded Polystyrene (EPS)</SelectItem>
                      <SelectItem value="polyethylene">Polyethylene Foam</SelectItem>
                      <SelectItem value="air-cushion">Air Cushioning</SelectItem>
                      <SelectItem value="paper-pulp">Molded Paper Pulp</SelectItem>
                      <SelectItem value="bubble-wrap">Bubble Wrap</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <h3 className="font-medium text-slate-200">Cushion Thickness</h3>
                  <span className="text-slate-400 text-sm">{cushionThickness} mm</span>
                </div>
                <Slider
                  value={[cushionThickness]}
                  min={5}
                  max={50}
                  step={1}
                  onValueChange={handleSliderChange}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>5mm</span>
                  <span>25mm</span>
                  <span>50mm</span>
                </div>
              </div>

              <div className="pt-4">
                {!packagingGenerated && !generatingDesign && (
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => {
                      // Run the generation animation first
                      handleGeneratePackaging();
                      // Then use a timeout to move to the next step after a brief delay
                      setTimeout(() => {
                        onStepComplete(expectedResponse);
                      }, 1500);
                    }}
                  >
                    <Package size={16} className="mr-2" />
                    Generate Packaging Design
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="properties" className="flex-1 p-4 space-y-5 mt-0">
              <div className="space-y-4">
                <h3 className="font-medium text-slate-200">Product Properties</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Dimensions:</span>
                    <span className="font-mono">25cm × 8cm × 8cm</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Volume:</span>
                    <span className="font-mono">1,250 cm³</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Material:</span>
                    <span className="font-mono">PET (assumed)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Weight:</span>
                    <span className="font-mono">325g (estimated)</span>
                  </div>
                </div>
              </div>

              {packagingGenerated && (
                <div className="space-y-4 pt-4 border-t border-slate-700/50">
                  <h3 className="font-medium text-slate-200">Packaging Properties</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>Outer Dimensions:</span>
                      <span className="font-mono">29cm × 12cm × 12cm</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Package Weight:</span>
                      <span className="font-mono">470g (with product)</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Cushioning:</span>
                      <span className="font-mono">{cushionThickness}mm EPS</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Box Type:</span>
                      <span className="font-mono">Corrugated E-flute</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Volume Efficiency:</span>
                      <span className="font-mono">76%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 mt-auto">
                {packagingGenerated && (
                  <div className="bg-green-900/20 border border-green-900/30 rounded-lg p-3 text-sm text-green-400">
                    <div className="flex items-start">
                      <Check size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Packaging Design Ready</p>
                        <p className="text-xs mt-1 text-green-500/80">This design meets general shipping requirements for your product.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default PackagingDesignView;