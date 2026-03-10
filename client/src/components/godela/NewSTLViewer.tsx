import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

interface NewSTLViewerProps {
  modelPath: string;
  className?: string;
}

export default function NewSTLViewer({ modelPath, className = '' }: NewSTLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Console logging for debugging
    console.log(`Loading STL file: ${modelPath}`);
    
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121722);
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 0, 10);
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
    frontLight.position.set(0, 0, 10);
    scene.add(frontLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(0, 0, -10);
    scene.add(backLight);
    
    const topLight = new THREE.DirectionalLight(0xffffff, 0.8);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    
    // Add coordinate axes helper (for debugging)
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    
    // Load STL model
    const loader = new STLLoader();
    
    console.log(`Starting STL load for ${modelPath}`);
    
    loader.load(
      // Resource URL
      modelPath,
      
      // Called when the resource is loaded
      (geometry) => {
        console.log('STL loaded successfully, creating mesh');
        
        // Center the geometry
        geometry.center();
        
        // Compute vertex normals if they don't exist
        geometry.computeVertexNormals();
        
        // Create material
        const material = new THREE.MeshPhongMaterial({
          color: 0x3b82f6,  // Blue color
          specular: 0x111111,
          shininess: 30,
          flatShading: false
        });
        
        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);
        
        // Scale and position mesh
        const box = new THREE.Box3().setFromObject(mesh);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim; // Scale to fit within a 5x5x5 box
        mesh.scale.set(scale, scale, scale);
        
        // Add mesh to scene
        scene.add(mesh);
        
        // Adjust camera position based on model size
        camera.position.z = 10;
        controls.update();
        
        console.log('Mesh added to scene');
      },
      
      // Called while loading is progressing
      (xhr) => {
        const progress = Math.round((xhr.loaded / xhr.total) * 100);
        console.log(`STL loading progress: ${progress}%`);
      },
      
      // Called when loading has errors
      (error) => {
        console.error('Error loading STL:', error);
      }
    );
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Remove renderer from DOM
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      renderer.dispose();
      
      // Other cleanups
      controls.dispose();
    };
  }, [modelPath]); // Re-run effect when modelPath changes
  
  return (
    <div 
      ref={containerRef} 
      className={`${className} w-full h-full bg-slate-900/50 rounded-md overflow-hidden`}
    />
  );
}