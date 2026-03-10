import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Grid, 
  Center, 
  Environment, 
  Html,
  useProgress,
  PerspectiveCamera
} from '@react-three/drei';
import { Model } from './Model';
import { useApp } from '../context/AppContext';
import { Upload } from 'lucide-react';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-t-primary-500 border-primary-500/30 rounded-full animate-spin mb-2"></div>
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
      {showGrid && <Grid 
        infiniteGrid 
        cellSize={0.5} 
        cellThickness={0.5} 
        cellColor="#333" 
        sectionSize={3} 
        sectionThickness={1} 
        sectionColor="#444" 
        fadeDistance={30} 
        fadeStrength={1}
      />}
      
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
      if (file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
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
            isDragging ? 'bg-primary-500/10 border-2 border-dashed border-primary-500/50' : ''
          }`}
        >
          <div className="text-center max-w-md p-6">
            <Upload size={48} className="mx-auto mb-4 text-primary-400" />
            <h2 className="text-xl font-bold mb-2">Import 3D Model</h2>
            <p className="text-gray-400 mb-4">
              Drag and drop a GLB or GLTF file or click the button below to upload
            </p>
            <label className="btn btn-primary cursor-pointer">
              Choose GLB or GLTF File
              <input 
                type="file" 
                accept=".glb,.gltf" 
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