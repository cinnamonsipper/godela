import React, { useState, useEffect } from 'react';
import nnDiagramImage from '../../assets/placeholder_nn_diagram.svg';
import useDemoStore from '@/store/useDemoStore';
import ProgressHeader from './ProgressHeader';
import EquationLibrary from './EquationLibrary';
import { PhysicsEquation } from '@/data/equations';

export default function ModelBuilderView() {
  const { nextDemoStep, demoPath } = useDemoStore();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isEquationLibraryOpen, setIsEquationLibraryOpen] = useState(false);
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([]);
  const [selectedEquations, setSelectedEquations] = useState<PhysicsEquation[]>([]);
  
  const isAircraftDemo = demoPath === 'aircraft-aerodynamics';
  
  // For aircraft demo, skip the loading model screen entirely
  useEffect(() => {
    if (isAircraftDemo) {
      // Skip immediately to the next step without any loading animation
      nextDemoStep();
    }
  }, [isAircraftDemo, nextDemoStep]);
  
  const toggleConstraint = (constraint: string) => {
    if (selectedConstraints.includes(constraint)) {
      setSelectedConstraints(selectedConstraints.filter(c => c !== constraint));
    } else {
      setSelectedConstraints([...selectedConstraints, constraint]);
    }
  };
  
  const handleOpenEquationLibrary = () => {
    setIsEquationLibraryOpen(true);
  };
  
  const handleCloseEquationLibrary = () => {
    setIsEquationLibraryOpen(false);
  };
  
  const handleAddEquations = (equations: PhysicsEquation[]) => {
    setSelectedEquations(equations);
    
    // Also update the simple constraint toggles based on equation IDs
    const constraintMap: Record<string, string> = {
      'potential-flow': 'kutta-condition',
      'thin-airfoil': 'thin-airfoil',
      'cl-alpha': 'cl-alpha-slope',
      'drag-quadratic': 'drag-polar'
    };
    
    const newConstraints = selectedConstraints.slice();
    Object.entries(constraintMap).forEach(([constraint, equationId]) => {
      const hasEquation = equations.some(eq => eq.id === equationId);
      const hasConstraint = newConstraints.includes(constraint);
      
      if (hasEquation && !hasConstraint) {
        newConstraints.push(constraint);
      } else if (!hasEquation && hasConstraint) {
        const index = newConstraints.indexOf(constraint);
        if (index !== -1) newConstraints.splice(index, 1);
      }
    });
    
    setSelectedConstraints(newConstraints);
  };
  
  // Aircraft demo loading screen content
  const renderAircraftLoading = () => (
    <>
      <div className="text-sm text-blue-300 mb-6">
        Building physics-informed neural network for aircraft performance and stability
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-[#0D1017] rounded-lg p-8 border border-[#1A2030] max-w-xl w-full">
          <div className="text-xl font-medium text-blue-200 mb-6 text-center">
            Building your model to explore performance & stability of different designs
          </div>
          
          <div className="relative mb-6 h-3 bg-[#151C28] rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-sm text-indigo-300">
            <div>Processing CAD geometries</div>
            <div className="flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {loadingProgress}%
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
  // Default model builder content
  const renderModelBuilder = () => (
    <>
      <div className="text-sm text-blue-300 mb-6">
        Configure your ML model for airfoil performance prediction
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="flex flex-col">
          <div className="bg-[#0D1017] rounded-lg p-4 mb-6 border border-[#1A2030] shadow-md flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-blue-200">AI-Recommended Model</h3>
              <div className="px-2 py-1 bg-indigo-900/50 text-indigo-300 text-xs rounded">
                AI-Optimized
              </div>
            </div>
            
            <div className="flex justify-center mb-3">
              <img src={nnDiagramImage} alt="Neural Network Architecture" className="w-full max-w-[400px]" />
            </div>
            
            <div className="bg-[#0A0E18] rounded p-3 text-sm">
              <h4 className="text-blue-300 font-medium mb-2">Architecture Details:</h4>
              <ul className="text-gray-300 space-y-1">
                <li><span className="text-indigo-400">Type:</span> Feedforward Neural Network</li>
                <li><span className="text-indigo-400">Hidden Layers:</span> 1 layer with 5 neurons</li>
                <li><span className="text-indigo-400">Activation:</span> ReLU</li>
                <li><span className="text-indigo-400">Output:</span> Linear (CL, CD predictions)</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="bg-[#0D1017] rounded-lg p-4 mb-6 border border-[#1A2030] shadow-md flex-1">
            <h3 className="text-lg font-medium text-blue-200 mb-3">Physics Constraints (Optional)</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-300 mb-3">
                Add physics-based constraints to improve model accuracy and generalization:
              </p>
              
              <div className="flex justify-center mb-2">
                <button 
                  className="px-4 py-2.5 bg-[#1A2030] text-blue-300 text-sm rounded-md hover:bg-[#252B3B] transition-colors flex items-center"
                  onClick={handleOpenEquationLibrary}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  Browse Equation Library
                </button>
              </div>
              
              {selectedEquations.length > 0 && (
                <div className="bg-[#0A0E18] rounded p-3 mb-3 animate-fadeIn">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-blue-300 font-medium text-sm">Selected Equations:</h4>
                    <span className="text-xs text-indigo-300 bg-indigo-900/30 px-2 py-0.5 rounded-full">
                      {selectedEquations.length} applied
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-400 space-y-2 max-h-40 overflow-y-auto pr-2">
                    {selectedEquations.map((equation) => (
                      <div key={equation.id} className="p-2 border border-[#1A2030] rounded">
                        <div className="text-blue-300 mb-1 flex justify-between">
                          <span>{equation.name}</span>
                          <span className="text-indigo-300 text-xs">{equation.category}</span>
                        </div>
                        <div className="font-mono">
                          {equation.latex.replace(/\\/, '').replace(/{|}/g, '')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-auto">
              <button 
                onClick={nextDemoStep}
                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-md shadow-md hover:from-indigo-700 hover:to-blue-700 transition-colors font-medium"
              >
                Build Model
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">
                This will train the ML model with your selected configurations
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Equation Library Modal */}
      <EquationLibrary 
        isOpen={isEquationLibraryOpen}
        onClose={handleCloseEquationLibrary}
        onAddEquations={handleAddEquations}
        existingEquationIds={selectedEquations.map(eq => eq.id)}
      />
    </>
  );
  
  return (
    <div className="flex flex-col h-full p-6 bg-[#10131E]">
      <ProgressHeader title="Model Builder" />
      {isAircraftDemo ? renderAircraftLoading() : renderModelBuilder()}
    </div>
  );
}