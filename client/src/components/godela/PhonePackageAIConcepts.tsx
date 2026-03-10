import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Leaf, 
  Recycle,
  Check, 
  Package,
  Layers,
  BarChart,
  ChevronDown,
  ChevronUp 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { PackageStyle } from './SimplePhonePackagePreview';
import { OptimizationDriver } from './PhonePackageOptimizationSelector';

// Define the concept data structure
export interface PackageConcept {
  id: string;
  title: string;
  style: PackageStyle;
  primaryOptimization: OptimizationDriver;
  metrics: {
    unitCost: number; // in dollars
    sustainabilityScore: number; // 0-100
    recyclability: string;
    testConfidence: number; // 0-100
    protectionLevel: number; // 0-100
  };
  materials: {
    outer: string;
    inner: string;
    recycledContent: number; // percentage
  };
  rationale: string;
}

// Props for the component
interface PhonePackageAIConceptsProps {
  concepts: PackageConcept[];
  selectedConceptId: string | null;
  onSelectConcept: (conceptId: string) => void;
  onReviewConcept: (conceptId: string) => void;
  isLoading: boolean;
  className?: string;
}

/**
 * A component to display AI-generated package concepts for selection
 */
const PhonePackageAIConcepts: React.FC<PhonePackageAIConceptsProps> = ({
  concepts,
  selectedConceptId,
  onSelectConcept,
  onReviewConcept,
  isLoading,
  className = ''
}) => {
  // Helper to render the sustainability score as leaf icons
  const renderSustainabilityScore = (score: number) => {
    // Convert to 0-5 scale
    const scaledScore = Math.round(score / 20);
    
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Leaf 
            key={i} 
            className={`h-4 w-4 ${i < scaledScore ? 'text-green-500 fill-green-500' : 'text-slate-500'}`} 
          />
        ))}
      </div>
    );
  };
  
  // Helper to render the test confidence indicator
  const renderTestConfidence = (confidence: number) => {
    let color = 'text-red-500';
    let level = 'Low';
    
    if (confidence >= 90) {
      color = 'text-green-500';
      level = 'High';
    } else if (confidence >= 70) {
      color = 'text-amber-500';
      level = 'Medium';
    }
    
    return (
      <span className={`font-medium ${color}`}>{level} Confidence</span>
    );
  };
  
  // Helper to get the appropriate primary color based on optimization driver
  const getDriverColor = (driver: OptimizationDriver) => {
    switch (driver) {
      case 'sustainability':
        return 'green';
      case 'cost':
        return 'amber';
      case 'protection':
        return 'blue';
      case 'balanced':
        return 'purple';
      default:
        return 'indigo';
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className={`${className} bg-slate-900/70 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6`}>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 border-4 border-indigo-300/20 rounded-full"></div>
            <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
          </div>
          
          <h3 className="text-xl font-medium text-slate-200 mb-3">
            Godela AI is engineering your optimal iPhone package...
          </h3>
          
          <p className="text-slate-400 max-w-lg mb-6">
            Considering sustainable materials, structural integrity for SIOC, and your cost goals. 
            Analyzing designs to pass ISTA 6-Amazon.com SIOC tests.
          </p>
          
          <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-indigo-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 15, repeat: Infinity }}
            />
          </div>
          
          <div className="mt-8 space-y-2 text-left max-w-md w-full">
            <div className="flex items-center text-slate-400 text-sm">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                <Check className="h-3 w-3 text-indigo-400" />
              </div>
              <span>Analyzing iPhone dimensions and vulnerability points</span>
            </div>
            <div className="flex items-center text-slate-400 text-sm">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                <Check className="h-3 w-3 text-indigo-400" />
              </div>
              <span>Evaluating material sustainability scores</span>
            </div>
            <div className="flex items-center text-slate-400 text-sm">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="h-3 w-3 bg-indigo-400 rounded-full"
                ></motion.div>
              </div>
              <span>Generating optimal package structures...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Display AI-generated concepts
  return (
    <div className={`${className} space-y-6`}>
      {/* Header section with elegant glass effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl blur"></div>
        <div className="relative bg-slate-900/60 backdrop-blur-sm border border-slate-700/40 rounded-xl p-5">
          <div className="flex flex-col">
            <h3 className="text-lg font-medium text-slate-200 mb-2">AI-Generated Package Concepts</h3>
            <p className="text-sm text-slate-400">
              Based on your optimization goals, Godela AI has generated these package design concepts. 
              Select one to review and customize further.
            </p>
            <div className="mt-3 flex items-center">
              <div className="bg-slate-800/60 py-1 px-3 rounded-full text-xs border border-slate-700/30 text-green-400 flex items-center">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                {concepts.length} Concepts Generated
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {concepts.map((concept, index) => {
          const isSelected = selectedConceptId === concept.id;
          const driverColor = getDriverColor(concept.primaryOptimization);
          
          return (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`
                bg-slate-900/70 backdrop-blur-sm rounded-xl border overflow-hidden transition-all
                ${isSelected ? `border-${driverColor}-500/50` : 'border-slate-700/50'}
                ${isSelected ? 'shadow-lg shadow-slate-900/50' : ''}
              `}
            >
              <div 
                className={`
                  p-5 cursor-pointer
                  ${isSelected ? `bg-${driverColor}-900/10` : 'hover:bg-slate-800/50'}
                `}
                onClick={() => onSelectConcept(concept.id)}
              >
                <div className="flex items-start">
                  {/* Concept preview thumbnail (placeholder) */}
                  <div className={`
                    w-20 h-20 rounded-lg mr-4 flex-shrink-0 overflow-hidden
                    bg-${driverColor}-900/20 border border-${driverColor}-700/30
                  `}>
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className={`h-8 w-8 text-${driverColor}-400/70`} />
                    </div>
                  </div>
                  
                  {/* Concept details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-slate-200 truncate pr-2">{concept.title}</h4>
                      <div className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 bg-${driverColor}-500/20 text-${driverColor}-400 whitespace-nowrap`}>
                        {concept.primaryOptimization.charAt(0).toUpperCase() + concept.primaryOptimization.slice(1)}
                      </div>
                    </div>
                    
                    {/* Key metrics */}
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="min-w-0">
                        <div className="text-xs text-slate-500 truncate">Cost</div>
                        <div className="text-sm font-medium text-slate-300 truncate">
                          ${concept.metrics.unitCost.toFixed(2)}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-slate-500 truncate">Eco Score</div>
                        <div className="text-sm truncate">
                          {renderSustainabilityScore(concept.metrics.sustainabilityScore)}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-slate-500 truncate">SIOC</div>
                        <div className="text-sm truncate">
                          {renderTestConfidence(concept.metrics.testConfidence)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chevron indicator */}
                  <div className="ml-2 flex-shrink-0">
                    {isSelected ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Expanded details when selected */}
              {isSelected && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6 pt-2 border-t border-slate-700/40"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left column - Materials & rationale */}
                    <div className="space-y-5">
                      {/* Materials */}
                      <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                        <h5 className="text-sm font-medium text-slate-200 mb-3 flex items-center">
                          <div className={`p-1.5 rounded-full bg-${driverColor}-500/20 mr-2`}>
                            <Layers className={`h-4 w-4 text-${driverColor}-400`} />
                          </div>
                          Primary Materials
                        </h5>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-xs">Outer Package</span>
                            <span className="text-slate-200 font-medium text-sm bg-slate-700/30 px-2 py-1 rounded-md">{concept.materials.outer}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-xs">Inner Protection</span>
                            <span className="text-slate-200 font-medium text-sm bg-slate-700/30 px-2 py-1 rounded-md">{concept.materials.inner}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-xs">Recycled Content</span>
                            <span className="text-green-400 font-medium text-sm bg-green-900/20 px-2 py-1 rounded-md">{concept.materials.recycledContent}%</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Rationale */}
                      <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                        <h5 className="text-sm font-medium text-slate-200 mb-3 flex items-center">
                          <div className={`p-1.5 rounded-full bg-${driverColor}-500/20 mr-2`}>
                            <BarChart className={`h-4 w-4 text-${driverColor}-400`} />
                          </div>
                          AI Design Rationale
                        </h5>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {concept.rationale}
                        </p>
                      </div>
                    </div>
                    
                    {/* Right column - Additional details */}
                    <div className="space-y-5">
                      {/* More details on recyclability */}
                      <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                        <h5 className="text-sm font-medium text-slate-200 mb-3 flex items-center">
                          <div className="p-1.5 rounded-full bg-green-500/20 mr-2">
                            <Recycle className="h-4 w-4 text-green-400" />
                          </div>
                          Recyclability
                        </h5>
                        <div className="flex items-start bg-slate-700/20 p-3 rounded-lg">
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {concept.metrics.recyclability}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action button to select this concept for customization */}
                      <div className="mt-auto pt-2">
                        <div className="relative">
                          <div className={`absolute inset-0 bg-${driverColor}-500/20 rounded-lg blur opacity-30`}></div>
                          <Button 
                            className={`w-full relative h-11 bg-gradient-to-r ${
                              concept.primaryOptimization === 'sustainability' ? 'from-green-600 to-emerald-500' : 
                              concept.primaryOptimization === 'cost' ? 'from-amber-500 to-yellow-400' : 
                              concept.primaryOptimization === 'protection' ? 'from-blue-600 to-cyan-500' : 
                              'from-indigo-600 to-purple-500'
                            } hover:brightness-110 shadow-lg transition-all overflow-hidden`}
                            onClick={() => onReviewConcept(concept.id)}
                          >
                            <span className="flex items-center justify-center font-medium text-sm whitespace-nowrap">
                              <span className="truncate">Review & Customize This Design</span>
                              <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                            </span>
                          </Button>
                        </div>
                        <p className="text-xs text-center text-slate-400 mt-2">
                          View detailed specifications and customize this design
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PhonePackageAIConcepts;