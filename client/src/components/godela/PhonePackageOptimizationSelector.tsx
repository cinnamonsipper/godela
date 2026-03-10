import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  DollarSign, 
  Shield, 
  Scale,
  ChevronDown,
  Check,
  Lock,
  Trash2,
  Globe,
  Sparkles,
  Recycle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider";

// Define the optimization driver options
export type OptimizationDriver = 'sustainability' | 'cost' | 'protection' | 'balanced';

// Define the constraints types
export interface PackageConstraints {
  minRecycledContent: number;
  noPlastic: boolean;
  supplierRegion: string;
}

// Define the slider ranges for secondary tuning
export interface SecondaryTuning {
  costRange: [number, number]; // in dollars
  protectionThreshold: number; // 0-100
  sustainabilityScore: number; // 0-100
}

// Props for the component
interface PhonePackageOptimizationSelectorProps {
  selectedDriver: OptimizationDriver | null;
  onSelectDriver: (driver: OptimizationDriver) => void;
  onUpdateConstraints: (constraints: PackageConstraints) => void;
  onUpdateTuning: (tuning: SecondaryTuning) => void;
  onGenerateAIConcepts: () => void;
  isGeneratingConcepts: boolean;
  className?: string;
}

/**
 * A component for selecting package optimization parameters and constraints
 */
const PhonePackageOptimizationSelector: React.FC<PhonePackageOptimizationSelectorProps> = ({
  selectedDriver,
  onSelectDriver,
  onUpdateConstraints,
  onUpdateTuning,
  onGenerateAIConcepts,
  isGeneratingConcepts,
  className = ''
}) => {
  // State for secondary tuning sliders
  const [tuning, setTuning] = useState<SecondaryTuning>({
    costRange: [0.20, 0.40], // default cost range
    protectionThreshold: 80, // default protection threshold
    sustainabilityScore: 70  // default sustainability score
  });
  
  // State for constraints
  const [constraints, setConstraints] = useState<PackageConstraints>({
    minRecycledContent: 70,
    noPlastic: true,
    supplierRegion: 'north-america'
  });
  
  // Handle driver selection
  const handleDriverSelect = (driver: OptimizationDriver) => {
    onSelectDriver(driver);
    
    // Set default tuning values based on selected driver
    let newTuning = { ...tuning };
    
    switch (driver) {
      case 'sustainability':
        newTuning = {
          costRange: [0.25, 0.45],
          protectionThreshold: 75,
          sustainabilityScore: 90
        };
        break;
      case 'cost':
        newTuning = {
          costRange: [0.15, 0.30],
          protectionThreshold: 70,
          sustainabilityScore: 60
        };
        break;
      case 'protection':
        newTuning = {
          costRange: [0.30, 0.50],
          protectionThreshold: 95,
          sustainabilityScore: 65
        };
        break;
      case 'balanced':
        newTuning = {
          costRange: [0.22, 0.38],
          protectionThreshold: 85,
          sustainabilityScore: 80
        };
        break;
    }
    
    setTuning(newTuning);
    onUpdateTuning(newTuning);
  };
  
  // Handle constraint changes
  const handleConstraintChange = (key: keyof PackageConstraints, value: any) => {
    const newConstraints = { ...constraints, [key]: value };
    setConstraints(newConstraints);
    onUpdateConstraints(newConstraints);
  };
  
  // Handle tuning slider changes
  const handleTuningChange = (key: keyof SecondaryTuning, value: any) => {
    const newTuning = { ...tuning, [key]: value };
    setTuning(newTuning);
    onUpdateTuning(newTuning);
  };
  
  // Driver option config
  const driverOptions = [
    {
      id: 'sustainability' as OptimizationDriver,
      name: 'Optimize for Sustainability',
      description: 'Target highest eco-score, prioritize sustainable materials',
      icon: <Leaf className="h-5 w-5" />,
      color: 'bg-green-600 hover:bg-green-700',
      textColor: 'text-green-500'
    },
    {
      id: 'cost' as OptimizationDriver,
      name: 'Optimize for Cost',
      description: 'Target lowest unit price while meeting minimum protection standards',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-amber-600 hover:bg-amber-700',
      textColor: 'text-amber-500'
    },
    {
      id: 'protection' as OptimizationDriver,
      name: 'Optimize for Protection',
      description: 'Maximize product safety and durability, cost is secondary',
      icon: <Shield className="h-5 w-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-blue-500'
    },
    {
      id: 'balanced' as OptimizationDriver,
      name: 'Balanced Performance',
      description: 'Achieve good balance of cost, sustainability, and protection',
      icon: <Scale className="h-5 w-5" />,
      color: 'bg-purple-600 hover:bg-purple-700',
      textColor: 'text-purple-500'
    }
  ];
  
  // Get the currently selected driver details
  const selectedDriverOption = selectedDriver 
    ? driverOptions.find(option => option.id === selectedDriver) 
    : null;
  
  return (
    <div className={`${className} space-y-5`}>
      {/* Main heading */}
      <div>
        <h3 className="text-lg font-medium text-slate-200 mb-1">Specify Design Optimization Goals</h3>
        <p className="text-sm text-slate-400">
          Define your package design priorities and constraints to guide AI concept generation
        </p>
      </div>
      
      {/* Primary Optimization Driver Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-300">Primary Optimization Driver</label>
        <div className="grid grid-cols-1 gap-3">
          {driverOptions.map(option => {
            const colorScheme = option.id === 'sustainability' ? 'green' : 
                                option.id === 'cost' ? 'amber' : 
                                option.id === 'protection' ? 'blue' : 'purple';
            
            return (
              <div
                key={option.id}
                className={`
                  p-4 rounded-lg border cursor-pointer transition-all overflow-hidden
                  ${selectedDriver === option.id 
                    ? `border-${colorScheme}-500/50 bg-slate-800/80` 
                    : 'border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60'
                  }
                `}
                onClick={() => handleDriverSelect(option.id)}
              >
                <div className="flex items-center">
                  <div 
                    className={`
                      p-2 rounded-full shrink-0 mr-4
                      ${selectedDriver === option.id 
                        ? `bg-${colorScheme}-600/20` 
                        : 'bg-slate-700/30'
                      }
                    `}
                  >
                    <div className={selectedDriver === option.id ? option.textColor : 'text-slate-400'}>
                      {option.icon}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-slate-200 mb-1">{option.name}</h4>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-snug">{option.description}</p>
                  </div>
                  {selectedDriver === option.id && (
                    <div className="ml-3 shrink-0">
                      <div className={`
                        rounded-full p-1 
                        bg-${colorScheme}-500/20
                        text-${colorScheme}-500
                      `}>
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedDriver === option.id && (
                  <div className={`h-1 w-full mt-3 bg-${colorScheme}-500/30 rounded-full`}>
                    <div className={`h-full w-2/3 bg-${colorScheme}-500 rounded-full`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Secondary Tuning Sliders - shown after driver is selected */}
      {selectedDriver && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="space-y-5 overflow-hidden"
        >
          <div>
            <label className="text-sm font-medium text-slate-300">Secondary Tuning</label>
            <p className="text-xs text-slate-500 mt-1">
              Fine-tune your optimization parameters for more precise AI concept generation
            </p>
          </div>
          
          {/* Different sliders based on the selected driver */}
          {selectedDriver === 'sustainability' && (
            <>
              {/* Cost range for sustainability-focused designs */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300">Acceptable Cost Range</label>
                  <span className="text-sm text-slate-400">${tuning.costRange[0].toFixed(2)} - ${tuning.costRange[1].toFixed(2)}</span>
                </div>
                <Slider
                  value={[tuning.costRange[0], tuning.costRange[1]]}
                  min={0.15}
                  max={0.60}
                  step={0.01}
                  onValueChange={(value) => handleTuningChange('costRange', value)}
                  className="py-1"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>$0.15</span>
                  <span>$0.60</span>
                </div>
              </div>
              
              {/* Protection threshold */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300">Minimum Protection Threshold</label>
                  <span className="text-sm text-slate-400">{tuning.protectionThreshold}%</span>
                </div>
                <Slider
                  value={[tuning.protectionThreshold]}
                  min={50}
                  max={95}
                  step={5}
                  onValueChange={(value) => handleTuningChange('protectionThreshold', value[0])}
                  className="py-1"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>50%</span>
                  <span>95%</span>
                </div>
              </div>
            </>
          )}
          
          {selectedDriver === 'cost' && (
            <>
              {/* Minimum sustainability for cost-focused designs */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300">Minimum Sustainability Score</label>
                  <span className="text-sm text-slate-400">{tuning.sustainabilityScore}/100</span>
                </div>
                <Slider
                  value={[tuning.sustainabilityScore]}
                  min={40}
                  max={90}
                  step={5}
                  onValueChange={(value) => handleTuningChange('sustainabilityScore', value[0])}
                  className="py-1"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>40</span>
                  <span>90</span>
                </div>
              </div>
              
              {/* Protection threshold */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300">Minimum Protection Threshold</label>
                  <span className="text-sm text-slate-400">{tuning.protectionThreshold}%</span>
                </div>
                <Slider
                  value={[tuning.protectionThreshold]}
                  min={50}
                  max={95}
                  step={5}
                  onValueChange={(value) => handleTuningChange('protectionThreshold', value[0])}
                  className="py-1"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>50%</span>
                  <span>95%</span>
                </div>
              </div>
            </>
          )}
          
          {selectedDriver === 'protection' && (
            <>
              {/* Cost range for protection-focused designs */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300">Acceptable Cost Range</label>
                  <span className="text-sm text-slate-400">${tuning.costRange[0].toFixed(2)} - ${tuning.costRange[1].toFixed(2)}</span>
                </div>
                <Slider
                  value={[tuning.costRange[0], tuning.costRange[1]]}
                  min={0.15}
                  max={0.60}
                  step={0.01}
                  onValueChange={(value) => handleTuningChange('costRange', value)}
                  className="py-1"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>$0.15</span>
                  <span>$0.60</span>
                </div>
              </div>
              
              {/* Minimum sustainability */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300">Minimum Sustainability Score</label>
                  <span className="text-sm text-slate-400">{tuning.sustainabilityScore}/100</span>
                </div>
                <Slider
                  value={[tuning.sustainabilityScore]}
                  min={40}
                  max={90}
                  step={5}
                  onValueChange={(value) => handleTuningChange('sustainabilityScore', value[0])}
                  className="py-1"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>40</span>
                  <span>90</span>
                </div>
              </div>
            </>
          )}
          
          {selectedDriver === 'balanced' && (
            <>
              {/* Cost range for balanced designs */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300">Target Cost Range</label>
                  <span className="text-sm text-slate-400">${tuning.costRange[0].toFixed(2)} - ${tuning.costRange[1].toFixed(2)}</span>
                </div>
                <Slider
                  value={[tuning.costRange[0], tuning.costRange[1]]}
                  min={0.15}
                  max={0.60}
                  step={0.01}
                  onValueChange={(value) => handleTuningChange('costRange', value)}
                  className="py-1"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>$0.15</span>
                  <span>$0.60</span>
                </div>
              </div>
              
              {/* Balance of protection/sustainability */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-300">Protection</label>
                    <span className="text-sm text-slate-400">{tuning.protectionThreshold}%</span>
                  </div>
                  <Slider
                    value={[tuning.protectionThreshold]}
                    min={60}
                    max={95}
                    step={5}
                    onValueChange={(value) => handleTuningChange('protectionThreshold', value[0])}
                    className="py-1"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-300">Sustainability</label>
                    <span className="text-sm text-slate-400">{tuning.sustainabilityScore}/100</span>
                  </div>
                  <Slider
                    value={[tuning.sustainabilityScore]}
                    min={60}
                    max={95}
                    step={5}
                    onValueChange={(value) => handleTuningChange('sustainabilityScore', value[0])}
                    className="py-1"
                  />
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
      
      {/* Key Constraints - always visible */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-slate-300">Key Constraints</label>
            <p className="text-xs text-slate-500 mt-1">
              Specify hard requirements for your packaging design
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-full p-1">
            <Lock className="h-4 w-4 text-slate-400" />
          </div>
        </div>
        
        {/* Recycled content requirement with visual indicator */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-green-500/20 rounded-full p-1.5 mr-3">
                <Recycle className="h-4 w-4 text-green-400" />
              </div>
              <label className="text-sm font-medium text-slate-300">
                Minimum Recycled Content
              </label>
            </div>
            <span className="text-sm font-medium text-green-400">{constraints.minRecycledContent}%</span>
          </div>
          <Slider
            value={[constraints.minRecycledContent]}
            min={0}
            max={100}
            step={10}
            onValueChange={(value) => handleConstraintChange('minRecycledContent', value[0])}
            className="py-1"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
        
        {/* Other constraints in a card */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 space-y-4">
          {/* No plastic checkbox */}
          <div className="flex items-center space-x-3 justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 rounded-full p-1.5">
                <Trash2 className="h-4 w-4 text-blue-400" />
              </div>
              <label
                htmlFor="no-plastic"
                className="text-sm font-medium leading-none text-slate-300"
              >
                No plastic components
              </label>
            </div>
            <Checkbox 
              id="no-plastic" 
              checked={constraints.noPlastic}
              onCheckedChange={(checked) => handleConstraintChange('noPlastic', checked)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
          </div>
          
          <div className="border-t border-slate-700/30 my-2"></div>
          
          {/* Supplier region selection */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500/20 rounded-full p-1.5">
                <Globe className="h-4 w-4 text-purple-400" />
              </div>
              <label className="text-sm font-medium text-slate-300">Target Supplier Region</label>
            </div>
            <Select
              value={constraints.supplierRegion}
              onValueChange={(value) => handleConstraintChange('supplierRegion', value)}
            >
              <SelectTrigger className="bg-slate-700/50 border-slate-600/50 mt-2 ml-10 max-w-[200px] truncate">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700/50 w-[200px]">
                <SelectItem value="north-america" className="truncate">North America</SelectItem>
                <SelectItem value="europe" className="truncate">Europe</SelectItem>
                <SelectItem value="asia-pacific" className="truncate">Asia Pacific</SelectItem>
                <SelectItem value="global" className="truncate">Global (No Preference)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Generate AI Concepts button - enabled when driver is selected */}
      <div className="pt-6">
        {selectedDriver ? (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-20"></div>
              <Button
                className={`w-full relative h-12 text-base font-medium ${
                  selectedDriverOption 
                    ? `bg-gradient-to-r ${
                        selectedDriver === 'sustainability' ? 'from-green-600 to-emerald-500' : 
                        selectedDriver === 'cost' ? 'from-amber-500 to-yellow-400' : 
                        selectedDriver === 'protection' ? 'from-blue-600 to-cyan-500' : 
                        'from-indigo-600 to-purple-500'
                      } hover:brightness-110`
                    : 'bg-slate-600 hover:bg-slate-700'
                } shadow-lg transition-all`}
                disabled={!selectedDriver || isGeneratingConcepts}
                onClick={onGenerateAIConcepts}
              >
                {isGeneratingConcepts ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Godela AI is designing your package...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Let Godela AI Design My Package
                  </span>
                )}
              </Button>
            </div>
            
            <p className="text-xs text-center text-slate-400">
              AI will generate 5 optimized packaging concepts based on your preferences
            </p>
          </div>
        ) : (
          <Button
            className="w-full bg-slate-700/50 hover:bg-slate-700/70 h-12 text-base font-medium border border-slate-600/50"
            disabled={true}
          >
            <span className="flex items-center opacity-70">
              <Lock className="h-4 w-4 mr-2" />
              Select an optimization driver to continue
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PhonePackageOptimizationSelector;