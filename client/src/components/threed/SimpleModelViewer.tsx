import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// Loading indicator component
function Loader() {
  const { progress } = useProgress();
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-6 shadow-xl text-center">
        <div className="w-16 h-16 border-4 border-t-indigo-500 border-indigo-500/20 rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-slate-200 font-medium">{Math.round(progress)}% loaded</div>
      </div>
    </div>
  );
}

// The actual model component
function Model({ url }: { url: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const fileExtension = url.split('.').pop()?.toLowerCase();
  
  // Handle different file types
  if (fileExtension === 'stl') {
    const geometry = useLoader(STLLoader, url);
    
    useEffect(() => {
      if (groupRef.current) {
        // Center the model
        const box = new THREE.Box3().setFromObject(groupRef.current);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        
        // Adjust camera position based on model size
        const fov = camera.fov * (Math.PI / 180);
        const distance = maxDim / (2 * Math.tan(fov / 2));
        camera.position.set(0, 0, distance * 2.5);
        camera.lookAt(center);
        
        // Center the model
        groupRef.current.position.sub(center);
      }
    }, [camera, geometry]);
    
    return (
      <group ref={groupRef}>
        <mesh>
          <primitive object={geometry} attach="geometry" />
          <meshStandardMaterial color="#9c9c9c" roughness={0.5} metalness={0.5} />
        </mesh>
      </group>
    );
  } else { // Handle GLTF/GLB
    const { scene, animations } = useGLTF(url);
    
    useEffect(() => {
      if (groupRef.current) {
        // Center the model
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        
        // Adjust camera position based on model size
        const fov = camera.fov * (Math.PI / 180);
        const distance = maxDim / (2 * Math.tan(fov / 2));
        camera.position.set(0, 0, distance * 2.5);
        camera.lookAt(center);
        
        // Center the model
        scene.position.sub(center);
      }
    }, [camera, scene]);
    
    return (
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    );
  }
}

// The main model viewer component
export default function SimpleModelViewer({ url }: { url: string }) {
  return (
    <div className="h-full w-full relative">
      <Canvas shadows gl={{ antialias: true }}>
        <color attach="background" args={['#0F1724']} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
        />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <Suspense fallback={null}>
          <Model url={url} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls 
          enableDamping
          dampingFactor={0.1}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          minDistance={1}
          maxDistance={100}
        />
      </Canvas>
      <Suspense fallback={null}>
        <Loader />
      </Suspense>
    </div>
  );
}