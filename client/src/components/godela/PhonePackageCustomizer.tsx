import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  PackageStyle,
  MaterialType,
  ProtectionLevel
} from './PhonePackagePreview';
import { DesignGoal } from './PhonePackageGoalSelector';
import { 
  Leaf, 
  Package, 
  Recycle, 
  Weight, 
  DollarSign, 
  CloudLightning,
  Check,
  Upload,
  Palette
} from 'lucide-react';

interface PhonePackageCustomizerProps {
  packageStyle: PackageStyle;
  designGoal: DesignGoal;
  onParamChange: (params: PhonePackageParams) => void;
  onRunSimulation: () => void;
  className?: string;
}

export interface PhonePackageParams {
  material: MaterialType;
  recycledContent: number;
  protectionLevel: ProtectionLevel;
  brandColor: string;
}

interface SustainabilityMetrics {
  sustainabilityScore: number; // 0-5
  recyclability: string;
  weight: number; // in kg
  estimatedCost: number; // in dollars
  carbonFootprint: number; // in g CO2e
  siocReadiness: 'yes' | 'no' | 'borderline';
}

// Default parameters based on design goals
const getDefaultParams = (style: PackageStyle, goal: DesignGoal): PhonePackageParams => {
  // Set defaults based on the selected goal
  switch (goal) {
    case 'eco-friendly':
      return {
        material: style === 'molded-pulp' ? 'molded-pulp' : 'white-recycled',
        recycledContent: 90,
        protectionLevel: 'standard',
        brandColor: '#4ade80' // Green
      };
    case 'protection':
      return {
        material: style === 'molded-pulp' ? 'molded-pulp' : 'white-recycled',
        recycledContent: 50,
        protectionLevel: 'enhanced',
        brandColor: '#60a5fa' // Blue
      };
    case 'cost':
      return {
        material: style === 'molded-pulp' ? 'molded-pulp' : 'kraft',
        recycledContent: 30,
        protectionLevel: 'standard',
        brandColor: '#fbbf24' // Amber
      };
    case 'balanced':
      return {
        material: style === 'molded-pulp' ? 'molded-pulp' : 'white-recycled',
        recycledContent: 70,
        protectionLevel: 'standard',
        brandColor: '#a78bfa' // Purple
      };
    default:
      return {
        material: style === 'molded-pulp' ? 'molded-pulp' : 'white-recycled',
        recycledContent: 70,
        protectionLevel: 'standard',
        brandColor: '#a78bfa' // Purple
      };
  }
};

// Calculate impact metrics based on current parameters
const calculateMetrics = (params: PhonePackageParams, style: PackageStyle): SustainabilityMetrics => {
  // Base metrics
  let sustainabilityScore = 3;
  let recyclability = 'Recyclable with paper streams';
  let weight = 0.08; // kg
  let estimatedCost = 0.22; // $
  let carbonFootprint = 75; // g CO2e
  let siocReadiness: 'yes' | 'no' | 'borderline' = 'yes';
  
  // Adjust based on material
  if (params.material === 'white-recycled') {
    sustainabilityScore += 0.5;
    weight += 0.01;
    estimatedCost += 0.04;
  } else if (params.material === 'molded-pulp') {
    sustainabilityScore += 1;
    recyclability = 'Widely recyclable, biodegradable';
    weight += 0.02;
    estimatedCost += 0.06;
    carbonFootprint -= 15;
  }
  
  // Adjust based on recycled content
  sustainabilityScore += (params.recycledContent - 50) / 100 * 1.5;
  carbonFootprint -= (params.recycledContent - 50) / 100 * 20;
  
  // Adjust based on protection level
  if (params.protectionLevel === 'enhanced') {
    sustainabilityScore -= 0.5;
    weight += 0.03;
    estimatedCost += 0.08;
    carbonFootprint += 15;
    siocReadiness = 'yes';
  } else {
    // Standard protection might not always pass SIOC
    siocReadiness = Math.random() > 0.7 ? 'borderline' : 'yes';
  }
  
  // Adjust based on style
  if (style === 'slim-fit-mailer') {
    // Default values are based on this
  } else if (style === 'molded-pulp') {
    sustainabilityScore += 0.7;
    weight += 0.02;
    estimatedCost += 0.07;
    carbonFootprint -= 10;
  } else if (style === 'cushioned-envelope') {
    sustainabilityScore -= 0.3;
    weight -= 0.03;
    estimatedCost -= 0.05;
    carbonFootprint -= 5;
    siocReadiness = params.protectionLevel === 'enhanced' ? 'borderline' : 'no';
  }
  
  // Ensure values stay within reasonable ranges
  sustainabilityScore = Math.max(1, Math.min(5, sustainabilityScore));
  weight = Math.max(0.03, weight);
  estimatedCost = Math.max(0.15, estimatedCost);
  carbonFootprint = Math.max(40, carbonFootprint);
  
  return {
    sustainabilityScore,
    recyclability,
    weight,
    estimatedCost,
    carbonFootprint,
    siocReadiness
  };
};

const PhonePackageCustomizer: React.FC<PhonePackageCustomizerProps> = ({
  packageStyle,
  designGoal,
  onParamChange,
  onRunSimulation,
  className = ''
}) => {
  // Initialize parameters based on design goal
  const [params, setParams] = useState<PhonePackageParams>(
    getDefaultParams(packageStyle, designGoal)
  );
  
  // Calculate metrics based on current parameters
  const metrics = calculateMetrics(params, packageStyle);
  
  // Update parameters when design goal changes
  useEffect(() => {
    const newParams = getDefaultParams(packageStyle, designGoal);
    setParams(newParams);
    onParamChange(newParams);
  }, [designGoal, packageStyle, onParamChange]);
  
  // Handle parameter changes
  const handleParamChange = (newParams: Partial<PhonePackageParams>) => {
    const updatedParams = { ...params, ...newParams };
    setParams(updatedParams);
    onParamChange(updatedParams);
  };
  
  // Generate leaf icons for sustainability score
  const renderLeafRating = (score: number) => {
    const fullLeaves = Math.floor(score);
    const halfLeaf = score % 1 >= 0.5;
    const emptyLeaves = 5 - fullLeaves - (halfLeaf ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullLeaves)].map((_, i) => (
          <Leaf key={`full-${i}`} className="h-5 w-5 text-green-500 fill-green-500" />
        ))}
        {halfLeaf && (
          <div className="relative w-5 h-5">
            <Leaf className="absolute h-5 w-5 text-green-500 fill-green-500" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
            <Leaf className="absolute h-5 w-5 text-green-500" />
          </div>
        )}
        {[...Array(emptyLeaves)].map((_, i) => (
          <Leaf key={`empty-${i}`} className="h-5 w-5 text-green-500" />
        ))}
      </div>
    );
  };

  return (
    <div className={`${className} grid md:grid-cols-2 gap-6`}>
      {/* Left column - Customization controls */}
      <div className="space-y-5">
        <h3 className="text-lg font-medium text-slate-200 mb-3">Customize Your iPhone Package</h3>
        
        {/* Material selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Material Selection</label>
          <Select
            value={params.material}
            onValueChange={(value: MaterialType) => handleParamChange({ material: value })}
          >
            <SelectTrigger className="bg-slate-800/70 border-slate-700/50">
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700/50">
              {packageStyle !== 'molded-pulp' && (
                <>
                  <SelectItem value="kraft">Corrugated Cardboard - Kraft (30% Recycled Content)</SelectItem>
                  <SelectItem value="white-recycled">Corrugated Cardboard - White (50% Recycled Content, FSC Certified)</SelectItem>
                </>
              )}
              {packageStyle === 'molded-pulp' && (
                <SelectItem value="molded-pulp">Molded Pulp (80% Recycled Paper Fibers)</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        {/* Recycled content slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300">Recycled Content</label>
            <span className="text-sm text-slate-400">{params.recycledContent}%</span>
          </div>
          <Slider
            value={[params.recycledContent]}
            min={params.material === 'molded-pulp' ? 80 : 30}
            max={90}
            step={5}
            onValueChange={(value) => handleParamChange({ recycledContent: value[0] })}
            className="py-1"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{params.material === 'molded-pulp' ? '80%' : '30%'}</span>
            <span>90%</span>
          </div>
        </div>
        
        {/* Protection level */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Protection Level</label>
          <div className="flex space-x-3">
            <Button
              variant={params.protectionLevel === 'standard' ? 'default' : 'outline'}
              className={params.protectionLevel === 'standard' 
                ? 'flex-1 bg-indigo-600 hover:bg-indigo-700' 
                : 'flex-1 border-slate-700/50 hover:bg-slate-800/50'}
              onClick={() => handleParamChange({ protectionLevel: 'standard' })}
            >
              Standard
            </Button>
            <Button
              variant={params.protectionLevel === 'enhanced' ? 'default' : 'outline'}
              className={params.protectionLevel === 'enhanced' 
                ? 'flex-1 bg-indigo-600 hover:bg-indigo-700' 
                : 'flex-1 border-slate-700/50 hover:bg-slate-800/50'}
              onClick={() => handleParamChange({ protectionLevel: 'enhanced' })}
            >
              Enhanced
            </Button>
          </div>
          <p className="text-xs text-slate-500">
            {params.protectionLevel === 'standard' 
              ? 'Standard protection suitable for normal shipping conditions' 
              : 'Enhanced protection with extra padding and reinforcement'}
          </p>
        </div>
        
        {/* Branding */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Branding</label>
          <div className="flex space-x-3 items-center">
            <Button
              variant="outline"
              className="flex-1 border-slate-700/50 hover:bg-slate-800/50"
              disabled
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Logo (mockup)
            </Button>
            
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Primary Color</label>
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-slate-400" />
                <input
                  type="color"
                  value={params.brandColor}
                  onChange={(e) => handleParamChange({ brandColor: e.target.value })}
                  className="w-8 h-8 bg-transparent border-none cursor-pointer rounded-md overflow-hidden"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Simulation button */}
        <div className="pt-3">
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all"
            onClick={onRunSimulation}
          >
            Next: Simulate Package Performance
          </Button>
        </div>
      </div>
      
      {/* Right column - Impact dashboard */}
      <div className="bg-slate-900/70 backdrop-blur-sm rounded-lg border border-slate-700/50 p-5">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Real-Time Impact Dashboard</h3>
        
        <div className="space-y-5">
          {/* Sustainability score */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-slate-300">Sustainability Score</label>
              <span className="text-sm text-green-400">{metrics.sustainabilityScore.toFixed(1)}/5</span>
            </div>
            {renderLeafRating(metrics.sustainabilityScore)}
          </div>
          
          {/* Recyclability */}
          <div className="p-3 rounded-md bg-slate-800/50 flex items-start space-x-3">
            <div className="p-1.5 bg-green-500/10 rounded-full text-green-400">
              <Recycle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-300">Recyclability</h4>
              <p className="text-sm text-green-400">{metrics.recyclability}</p>
            </div>
          </div>
          
          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Weight */}
            <div className="p-3 rounded-md bg-slate-800/50 flex flex-col">
              <div className="flex items-center space-x-2 mb-1">
                <Weight className="h-4 w-4 text-slate-400" />
                <h4 className="text-sm font-medium text-slate-300">Weight</h4>
              </div>
              <p className="text-sm font-medium text-slate-400">
                Package: {metrics.weight.toFixed(2)} kg
              </p>
            </div>
            
            {/* Cost */}
            <div className="p-3 rounded-md bg-slate-800/50 flex flex-col">
              <div className="flex items-center space-x-2 mb-1">
                <DollarSign className="h-4 w-4 text-slate-400" />
                <h4 className="text-sm font-medium text-slate-300">Est. Cost/Unit</h4>
              </div>
              <p className="text-sm font-medium text-slate-400">
                ${metrics.estimatedCost.toFixed(2)}
              </p>
            </div>
            
            {/* Carbon footprint */}
            <div className="p-3 rounded-md bg-slate-800/50 flex flex-col">
              <div className="flex items-center space-x-2 mb-1">
                <CloudLightning className="h-4 w-4 text-slate-400" />
                <h4 className="text-sm font-medium text-slate-300">Carbon Footprint</h4>
              </div>
              <p className="text-sm font-medium text-slate-400">
                {metrics.carbonFootprint.toFixed(0)}g CO₂e
              </p>
            </div>
            
            {/* SIOC readiness */}
            <div className="p-3 rounded-md bg-slate-800/50 flex flex-col">
              <div className="flex items-center space-x-2 mb-1">
                <Package className="h-4 w-4 text-slate-400" />
                <h4 className="text-sm font-medium text-slate-300">SIOC Readiness</h4>
              </div>
              <div className="flex items-center">
                {metrics.siocReadiness === 'yes' && (
                  <p className="text-sm font-medium text-green-400 flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Likely to Pass
                  </p>
                )}
                {metrics.siocReadiness === 'borderline' && (
                  <p className="text-sm font-medium text-amber-400">
                    Borderline
                  </p>
                )}
                {metrics.siocReadiness === 'no' && (
                  <p className="text-sm font-medium text-red-400">
                    Unlikely to Pass
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Design note */}
          <div className="mt-auto pt-2">
            <p className="text-xs text-slate-500 italic">
              Note: All metrics are for illustrative purposes. In a production environment, these would be based on real-time calculations from material databases and physics-based simulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhonePackageCustomizer;