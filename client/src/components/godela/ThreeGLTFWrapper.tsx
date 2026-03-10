import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PresentationControls, 
  Stage, 
  Environment, 
  useGLTF 
} from '@react-three/drei';
import { LoaderCircle } from 'lucide-react';

interface ModelProps {
  modelPath: string;
  position?: [number, number, number];
  scale?: number;
}

// This component handles loading and displaying the 3D model
// It's based on the structure from Don McCurdy's viewer but simplified
function Model({ modelPath, position = [0, 0, 0], scale = 1 }: ModelProps) {
  // Load the model
  try {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene} position={position} scale={scale} />;
  } catch (error) {
    console.error("Error loading model:", error);
    // Return a fallback box if the model fails to load
    return (
      <mesh position={position}>
        <boxGeometry args={[1, 2, 0.1]} />
        <meshStandardMaterial color="#4F46E5" />
      </mesh>
    );
  }
}

interface ThreeGLTFWrapperProps {
  modelPath: string;
  backgroundColor?: string;
  className?: string;
  autoRotate?: boolean;
}

export default function ThreeGLTFWrapper({
  modelPath,
  backgroundColor = '#111827',
  className = '',
  autoRotate = true
}: ThreeGLTFWrapperProps) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle loading complete
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Handle error
  const handleError = (error: any) => {
    console.error("Error in 3D viewer:", error);
    setIsError(true);
    setIsLoading(false);
  };

  // CSS fallback if errors are detected
  if (isError) {
    return (
      <div className={`w-full h-full ${className} rounded-lg overflow-hidden`} style={{ background: backgroundColor }}>
        <div className="h-full w-full flex flex-col items-center justify-center perspective-800">
          {/* Fallback CSS iPhone 12 Pro */}
          <motion.div 
            className="w-60 h-[400px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-[36px] border border-slate-700 shadow-xl relative overflow-hidden transform-preserve-3d"
            animate={{ 
              rotateY: autoRotate ? [0, 10, 0, -10, 0] : 0,
              rotateX: autoRotate ? [2, 0, 2] : 0,
              scale: [0.98, 1, 0.98]
            }}
            transition={{ 
              rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Camera bump */}
            <div className="absolute top-10 right-5 w-16 h-16 bg-slate-800 rounded-2xl shadow-inner">
              <div className="w-6 h-6 absolute top-1 left-1 rounded-full bg-slate-900"></div>
              <div className="w-6 h-6 absolute top-1 right-1 rounded-full bg-slate-900"></div>
              <div className="w-6 h-6 absolute bottom-1 left-1 rounded-full bg-slate-900"></div>
              <div className="w-6 h-6 absolute bottom-1 right-1 rounded-full bg-slate-900"></div>
            </div>
          </motion.div>
          <p className="text-slate-400 mt-4">Unable to load 3D model</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`w-full h-full ${className} rounded-lg overflow-hidden flex items-center justify-center`} style={{ background: backgroundColor }}>
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto mb-2"
          >
            <LoaderCircle className="w-12 h-12 text-indigo-500" />
          </motion.div>
          <p className="text-slate-300 text-sm">Loading iPhone model...</p>
        </div>
      </div>
    );
  }

  // Main Three.js canvas
  return (
    <div className={`w-full h-full ${className} rounded-lg overflow-hidden`} style={{ background: backgroundColor }}>
      <ErrorBoundary onError={handleError}>
        <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 0, 5], fov: 45 }}>
          <color attach="background" args={[backgroundColor]} />
          <PresentationControls 
            global 
            zoom={1} 
            rotation={[0, 0, 0]} 
            polar={[-Math.PI / 4, Math.PI / 4]} 
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <Stage environment="city" intensity={0.6}>
              <Model modelPath={modelPath} />
            </Stage>
          </PresentationControls>
          <OrbitControls 
            autoRotate={autoRotate} 
            autoRotateSpeed={1} 
            enableZoom={false} 
            enablePan={false}
            maxPolarAngle={Math.PI / 2} 
            minPolarAngle={Math.PI / 3}
          />
          <Environment preset="city" />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

// Custom error boundary component to catch Three.js errors
class ErrorBoundary extends React.Component<{ 
  children: React.ReactNode;
  onError: (error: Error) => void;
}> {
  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    return this.props.children;
  }
}