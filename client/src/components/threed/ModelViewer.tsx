import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
// Only import essential components to minimize potential compatibility issues
import { 
  OrbitControls, 
  Center, 
  Environment, 
  Html,
  useProgress,
  PerspectiveCamera
} from '@react-three/drei';
import { Model } from './Model';
import { useApp } from '../../context/AppContext';
import { Upload } from 'lucide-react';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-t-indigo-500 border-indigo-500/30 rounded-full animate-spin mb-2"></div>
        <p className="text-sm text-gray-300">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  );
}

const Scene = () => {
  const { 
    modelUrl, 
    hasModel, 
    showGrid, 
    renderMode,
  } = useApp();

  return (
    <>
      {/* Grid removed to simplify component for troubleshooting */}
      
      {hasModel && (
        <group position={[0, 0, 0]}>
          <Center scale={1.5}>
            <Model url={modelUrl} renderMode={renderMode} />
          </Center>
        </group>
      )}
      
      <Environment preset="warehouse" />
      <OrbitControls 
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={1}
        maxDistance={100}
        target={[0, 0, 0]}
      />
    </>
  );
};

const FrontViewPanel = () => (
  <div className="relative h-full">
    <Canvas
      gl={{
        antialias: true,
        alpha: false,
      }}
      shadows
    >
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 5]}
        fov={50}
        near={0.1}
        far={1000}
      />
      <color attach="background" args={['#1a1a1a']} />
      <Suspense fallback={<Loader />}>
        <Scene />
      </Suspense>
    </Canvas>
    <div className="absolute top-4 left-4 text-xs text-gray-100 bg-black/80 px-4 py-2 rounded-lg shadow-lg z-10 select-none pointer-events-none">
      Front View
    </div>
  </div>
);

export const ModelViewer: React.FC = () => {
  const { hasModel, uploadFile } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.glb') || file.name.endsWith('.gltf') || file.name.endsWith('.stl')) {
        uploadFile(file);
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };
  
  return (
    <div 
      className="h-full w-full relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {hasModel ? (
        <div className="h-full w-full">
          <FrontViewPanel />
        </div>
      ) : (
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center ${
            isDragging ? 'bg-indigo-500/10 border-2 border-dashed border-indigo-500/50' : ''
          }`}
        >
          <div className="text-center max-w-md p-6">
            <Upload size={48} className="mx-auto mb-4 text-indigo-400" />
            <h2 className="text-xl font-bold mb-2">Import 3D Model</h2>
            <p className="text-gray-400 mb-4">
              Drag and drop a GLB, GLTF, or STL file or click the button below to upload
            </p>
            <label className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 hover:bg-indigo-700 h-10 px-4 py-2 text-white cursor-pointer">
              Choose 3D Model File
              <input 
                type="file" 
                accept=".glb,.gltf,.stl" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};