import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stage, 
  useGLTF, 
  useAnimations, 
  Environment, 
  PerspectiveCamera,
  Html,
  Center
} from '@react-three/drei';
import * as THREE from 'three';
import { Mesh, Group } from 'three';
import { ArrowUpCircle, Upload, RotateCw, PlayCircle, PauseCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

// Define the types of models supported
export type ModelType = 'glb' | 'stl' | 'none';

// Interface for model loading options
interface ModelLoadingOptions {
  autoRotate?: boolean;
  enableAnimation?: boolean;
  environmentPreset?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
  intensity?: number;
  backgroundColor?: string;
}

// Props for the GLB model component
interface GLBModelProps {
  url: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  options?: ModelLoadingOptions;
}

// Component to render GLB models with animation support
function GLBModel({ url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], options }: GLBModelProps) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions, mixer } = useAnimations(animations, group);
  const [animationNames, setAnimationNames] = useState<string[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (scene) {
      // Center and normalize the model
      scene.position.set(0, 0, 0);
      
      // Get all animation names
      const names = Object.keys(actions);
      setAnimationNames(names);
      
      // Auto-play the first animation if available and animations are enabled
      if (names.length > 0 && options?.enableAnimation !== false) {
        const firstAnimation = names[0];
        setCurrentAnimation(firstAnimation);
        actions[firstAnimation]?.reset().play();
      }
    }
    
    return () => {
      if (mixer) {
        // Clean up the mixer when component unmounts
        mixer.stopAllAction();
      }
    };
  }, [scene, actions, mixer, options?.enableAnimation]);

  // Handle animation playback
  useEffect(() => {
    if (!currentAnimation || !actions[currentAnimation]) return;
    
    if (isPlaying) {
      actions[currentAnimation]?.reset().play();
    } else {
      // Set paused state instead of calling pause()
      if (actions[currentAnimation]) {
        actions[currentAnimation].paused = true;
      }
    }
    
    return () => {
      if (currentAnimation && actions[currentAnimation]) {
        actions[currentAnimation]?.stop();
      }
    };
  }, [currentAnimation, actions, isPlaying]);
  
  // Auto-rotate the model if enabled
  useFrame(() => {
    if (group.current && options?.autoRotate) {
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation as any} scale={[scale, scale, scale]}>
      <primitive object={scene} />
      
      {/* Animation controls UI */}
      {animationNames.length > 0 && options?.enableAnimation !== false && (
        <Html position={[0, -2, 0]} center>
          <div className="bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-slate-700/50 text-white">
            <div className="mb-2 font-medium">Animations</div>
            <div className="flex gap-2 mb-2">
              <Button
                size="sm"
                variant={isPlaying ? "default" : "outline"}
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-8 w-8 p-0"
              >
                {isPlaying ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (currentAnimation && actions[currentAnimation]) {
                    actions[currentAnimation]?.reset();
                    if (isPlaying) {
                      actions[currentAnimation]?.play();
                    }
                  }
                }}
                className="h-8 w-8 p-0"
              >
                <RefreshCw size={16} />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {animationNames.map((name) => (
                <Button
                  key={name}
                  size="sm"
                  variant={currentAnimation === name ? "default" : "outline"}
                  onClick={() => {
                    if (currentAnimation) {
                      actions[currentAnimation]?.stop();
                    }
                    setCurrentAnimation(name);
                    if (isPlaying) {
                      actions[name]?.reset().play();
                    } else if (actions[name]) {
                      actions[name].reset();
                      actions[name].paused = true;
                    }
                  }}
                  className="text-xs"
                >
                  {name}
                </Button>
              ))}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Props for the STL model component
interface STLModelProps {
  url: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  options?: ModelLoadingOptions;
}

// Component to render STL models
function STLModel({ url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], options }: STLModelProps) {
  const meshRef = useRef<Mesh>(null);
  const [loadError, setLoadError] = useState(false);
  
  // Create a fallback geometry
  const fallbackGeometry = new THREE.BoxGeometry(1, 1, 1);

  // Try to load the STL with error handling
  let geometry;
  try {
    // Only attempt to load if we have a valid URL
    if (url && url.endsWith('.stl')) {
      try {
        geometry = useLoader(THREE.BufferGeometryLoader, url);
      } catch (err) {
        console.warn(`Failed to load STL model from ${url}:`, err);
        setLoadError(true);
        geometry = fallbackGeometry;
      }
    } else {
      // Use fallback if URL is invalid
      geometry = fallbackGeometry;
    }
  } catch (err) {
    console.error('Error in STL loading:', err);
    geometry = fallbackGeometry;
  }
  
  useEffect(() => {
    if (meshRef.current && geometry) {
      try {
        // Center the geometry
        if (typeof geometry.center === 'function') {
          geometry.center();
        }
        
        if (typeof geometry.computeBoundingBox === 'function') {
          geometry.computeBoundingBox();
        }
        
        // Normalize the size
        const box = geometry.boundingBox;
        if (box) {
          const size = new THREE.Vector3();
          box.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const scaleFactor = 2 / maxDim;
            meshRef.current.scale.set(scaleFactor * scale, scaleFactor * scale, scaleFactor * scale);
          }
        }
      } catch (err) {
        console.warn('Error sizing model:', err);
      }
    }
  }, [geometry, scale]);
  
  // Auto-rotate the model if enabled
  useFrame(() => {
    if (meshRef.current && options?.autoRotate) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry || fallbackGeometry} 
      position={position}
      rotation={rotation as any}
    >
      <meshStandardMaterial 
        color={loadError ? "#ff6b6b" : "#88ccff"} 
        roughness={0.3} 
        metalness={0.8}
        envMapIntensity={options?.intensity || 1}
      />
    </mesh>
  );
}

// Props for the main model viewer component
interface GodelaModelViewerProps {
  modelType: ModelType; 
  modelUrl: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  enableControls?: boolean;
  options?: ModelLoadingOptions;
  onFileUpload?: (file: File) => void;
  className?: string;
}

/**
 * Enhanced 3D Model Viewer that supports GLB (with animations) and STL files
 */
export default function GodelaModelViewer({ 
  modelType, 
  modelUrl, 
  scale = 1, 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  enableControls = true,
  options = {
    autoRotate: false,
    enableAnimation: true,
    environmentPreset: 'studio',
    intensity: 1,
    backgroundColor: 'transparent'
  },
  onFileUpload,
  className = ''
}: GodelaModelViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setIsLoading(true);
      const file = event.target.files[0];
      
      // If an upload handler is provided, call it
      if (onFileUpload) {
        onFileUpload(file);
      }
      
      // Reset the input value so the same file can be uploaded again
      event.target.value = '';
      
      // Simulate loading completion
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };
  
  return (
    <div className={`relative w-full h-full rounded-xl overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-indigo-300/20 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-200">Processing model...</p>
          </div>
        </div>
      )}
      
      {/* 3D Canvas */}
      <Canvas
        shadows
        style={{ 
          background: options.backgroundColor || 'transparent',
          width: '100%',
          height: '100%' 
        }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        
        {/* Environment and lighting */}
        <Environment preset={options.environmentPreset || 'studio'} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
        />
        
        {/* Controls */}
        {enableControls && (
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={options.autoRotate}
            autoRotateSpeed={2}
          />
        )}
        
        {/* Center and Stage the model */}
        <Center>
          <Stage 
            environment={options.environmentPreset || 'studio'}
            intensity={options.intensity || 1}
            shadows={true}
            preset="soft"
          >
            {/* Render the appropriate model based on type */}
            {modelType === 'glb' && modelUrl && (
              <GLBModel 
                url={modelUrl} 
                scale={scale}
                position={position}
                rotation={rotation}
                options={options}
              />
            )}
            
            {modelType === 'stl' && modelUrl && (
              <STLModel 
                url={modelUrl} 
                scale={scale}
                position={position}
                rotation={rotation}
                options={options}
              />
            )}
            
            {/* Placeholder sphere when no model is loaded */}
            {modelType === 'none' && (
              <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="#4472c4" roughness={0.3} metalness={0.5} />
              </mesh>
            )}
          </Stage>
        </Center>
      </Canvas>
      
      {/* Upload button */}
      {onFileUpload && (
        <div className="absolute top-4 right-4">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-slate-800/70 backdrop-blur-sm border-slate-700/50 hover:bg-slate-700/70"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Model
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".glb,.gltf,.stl,.stp,.step"
            onChange={handleFileUpload}
          />
        </div>
      )}
    </div>
  );
}