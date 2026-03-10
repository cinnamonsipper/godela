/**
 * Universal3DViewer Component
 * 
 * A persistent 3D viewer that handles model transitions seamlessly.
 * This component maintains its mount state while only updating the displayed model,
 * preventing flickering or remounting when switching between different models.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GodelaModelViewer from './GodelaModelViewer';
import { ModelType } from './GodelaModelViewer';

// Sample models for demo purposes - using relative paths from public directory
const DEMO_MODELS = {
  // Phone models
  phone: './test.stl', // Fallback to test.stl in root directory
  phone_detailed: './test.stl', 
  
  // Packaging models
  box_simple: './test.stl',
  box_with_protection: './test.stl',
  box_optimized: './test.stl',
  
  // Simulation models
  simulation_initial: './test.stl',
  simulation_final: './test.stl',
};

export type ModelKey = keyof typeof DEMO_MODELS;

interface Universal3DViewerProps {
  currentModel: ModelKey;
  showControls?: boolean;
  backgroundColor?: string;
  autoRotate?: boolean;
  className?: string;
}

// Error boundary component for 3D rendering errors
class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode, fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode, fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("3D Model Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center h-full w-full bg-slate-900 rounded-lg">
          <div className="text-center p-6">
            <div className="mx-auto h-16 w-16 text-red-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-slate-300 mb-2">Unable to load 3D model</p>
            <p className="text-slate-400 text-sm">A placeholder model will be shown instead</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Universal3DViewer - A seamless 3D model viewer with smooth transitions
 */
export default function Universal3DViewer({
  currentModel = 'phone',
  showControls = true,
  backgroundColor = '#111827',
  autoRotate = true,
  className = '',
}: Universal3DViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [modelUrl, setModelUrl] = useState(DEMO_MODELS[currentModel]);
  const [modelType, setModelType] = useState<ModelType>('stl');
  const [hasError, setHasError] = useState(false);
  const previousModelRef = useRef<string | null>(null);

  // Reset error state when model changes
  useEffect(() => {
    setHasError(false);
  }, [currentModel]);

  // Effect to handle model transitions
  useEffect(() => {
    try {
      const nextModelUrl = DEMO_MODELS[currentModel];
      const fileExtension = nextModelUrl.split('.').pop()?.toLowerCase();
      
      // Only show loading state if the model is actually changing
      if (nextModelUrl !== previousModelRef.current) {
        setIsLoading(true);
        
        // Update model type based on file extension
        if (fileExtension === 'glb') {
          setModelType('glb');
        } else {
          setModelType('stl');
        }
        
        // Delay model update slightly to allow for transition animation
        setTimeout(() => {
          setModelUrl(nextModelUrl);
          setIsLoading(false);
          previousModelRef.current = nextModelUrl;
        }, 300);
      }
    } catch (err) {
      console.error('Error transitioning models:', err);
      setHasError(true);
      setIsLoading(false);
    }
  }, [currentModel]);

  // Fallback UI for error state
  const renderFallback = () => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center p-6">
        <div className="mx-auto h-16 w-16 text-amber-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-slate-300">Model preview unavailable</p>
      </div>
    </div>
  );

  return (
    <div className={`relative w-full h-full min-h-[300px] bg-slate-900 rounded-lg overflow-hidden ${className}`}>
      {/* Loading overlay with smooth transition */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-indigo-300">Loading model...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Persistent model viewer with error boundary */}
      <div className="absolute inset-0">
        <ModelErrorBoundary>
          {hasError ? renderFallback() : (
            <GodelaModelViewer
              modelType={modelType}
              modelUrl={modelUrl}
              enableControls={showControls}
              options={{
                autoRotate: autoRotate,
                backgroundColor: backgroundColor,
                intensity: 0.8,
                environmentPreset: 'apartment',
              }}
              scale={1.5}
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
            />
          )}
        </ModelErrorBoundary>
      </div>
    </div>
  );
}