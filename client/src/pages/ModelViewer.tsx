import React, { useState } from 'react';
import { Link } from 'wouter';
import { ModelType } from '../components/godela/GodelaModelViewer';
import ModelUploadView from '../components/godela/ModelUploadView';
import { useModelStore } from '../lib/modelStore';
import { Button } from '../components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function ModelViewer() {
  const { setCurrentModel, currentModel } = useModelStore();
  const [showUploadView, setShowUploadView] = useState(true);
  
  // Handle when a model is uploaded
  const handleModelUploaded = (type: ModelType, url: string, filename: string) => {
    setCurrentModel(type, url, filename);
  };
  
  // Handle continuing after upload
  const handleContinue = () => {
    setShowUploadView(false);
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <header className="fixed top-0 left-0 right-0 border-b border-slate-800/50 backdrop-blur-sm z-10">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-300">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <span className="text-xl font-semibold">Godela Model Viewer</span>
          </div>
          
          <div>
            {!showUploadView && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowUploadView(true)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Upload
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto pt-24 pb-12 px-4">
        {showUploadView ? (
          <ModelUploadView 
            onModelUploaded={handleModelUploaded}
            onContinue={handleContinue}
          />
        ) : (
          <ModelInteractionView 
            modelType={currentModel.type}
            modelUrl={currentModel.url}
            filename={currentModel.filename}
          />
        )}
      </main>
    </div>
  );
}

interface ModelInteractionViewProps {
  modelType: ModelType;
  modelUrl: string;
  filename: string;
}

function ModelInteractionView({ modelType, modelUrl, filename }: ModelInteractionViewProps) {
  // This component would contain the full model interaction, simulation, and visualization features
  // For now, it just displays the model information as a placeholder
  
  if (modelType === 'none' || !modelUrl) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No Model Selected</h2>
        <p className="text-slate-400 mb-6">Please upload or select a model to continue.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="bg-slate-800/70 rounded-xl border border-slate-700/50 p-6">
        <h2 className="text-2xl font-semibold mb-4">Model Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-slate-400 mb-2">Filename: <span className="text-slate-200">{filename}</span></p>
            <p className="text-slate-400 mb-2">Type: <span className="text-slate-200">{modelType.toUpperCase()}</span></p>
            <p className="text-slate-400">Status: <span className="text-green-400">Ready for simulation</span></p>
          </div>
          
          <div className="space-y-4">
            <Button className="w-full">Run Physics Simulation</Button>
            <Button variant="outline" className="w-full">Download Model</Button>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800/70 rounded-xl border border-slate-700/50 overflow-hidden">
        <iframe 
          src={`/model-viewer?url=${encodeURIComponent(modelUrl)}&type=${modelType}`}
          className="w-full h-[600px] border-0"
          title="Model Viewer"
        />
      </div>
      
      <div className="bg-slate-800/70 rounded-xl border border-slate-700/50 p-6">
        <h2 className="text-2xl font-semibold mb-4">Simulation Controls</h2>
        <p className="text-slate-400 mb-6">
          This section would contain controls for running different types of simulations
          on the model, adjusting parameters, and viewing results.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SimulationOptionCard 
            title="Physics Simulation"
            description="Run standard physics simulation with gravity, collision, and material properties."
          />
          <SimulationOptionCard 
            title="Fluid Dynamics"
            description="Analyze how the model performs in air or liquid with computational fluid dynamics."
          />
          <SimulationOptionCard 
            title="Stress Testing"
            description="Apply forces and analyze structural integrity and weak points."
          />
          <SimulationOptionCard 
            title="Thermal Analysis"
            description="Simulate heat distribution and thermal properties of the model."
          />
          <SimulationOptionCard 
            title="Optimization"
            description="AI-driven optimization to improve model performance and efficiency."
          />
          <SimulationOptionCard 
            title="Custom Simulation"
            description="Define custom parameters and simulation conditions."
          />
        </div>
      </div>
    </div>
  );
}

interface SimulationOptionCardProps {
  title: string;
  description: string;
}

function SimulationOptionCard({ title, description }: SimulationOptionCardProps) {
  return (
    <div className="bg-slate-900/80 rounded-lg border border-slate-700/50 p-4 hover:border-indigo-500/50 transition-all cursor-pointer">
      <h3 className="font-medium text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-3">{description}</p>
      <Button size="sm" variant="default" className="w-full">Run Simulation</Button>
    </div>
  );
}