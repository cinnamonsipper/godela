import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

interface BasicSTLViewerProps {
  className?: string;
  modelPath?: string;
}

export default function BasicSTLViewer({ 
  className = '', 
  modelPath = '/Planes/give_me_30_different__0505210111_generate.stl' 
}: BasicSTLViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    console.log(`Starting basic STL viewer for ${modelPath}`);
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121722);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 0, 5);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Load STL model
    const loader = new STLLoader();
    
    try {
      console.log(`Loading STL model from: ${modelPath}`);
      
      // Use fetch to load the STL file as an ArrayBuffer
      fetch(modelPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.arrayBuffer();
        })
        .then(buffer => {
          console.log('STL file loaded, parsing...');
          const geometry = loader.parse(buffer);
          
          const material = new THREE.MeshPhongMaterial({
            color: 0x3b82f6,
            specular: 0x111111,
            shininess: 30
          });
          
          const mesh = new THREE.Mesh(geometry, material);
          
          // Center the model
          geometry.computeBoundingBox();
          const boundingBox = geometry.boundingBox;
          
          if (boundingBox) {
            const center = new THREE.Vector3();
            boundingBox.getCenter(center);
            mesh.position.sub(center);
            
            // Scale the model to fit the view
            const size = new THREE.Vector3();
            boundingBox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3 / maxDim;
            mesh.scale.set(scale, scale, scale);
          }
          
          mesh.rotation.x = -Math.PI / 2; // Adjust rotation if needed
          
          // Add mesh to scene
          scene.add(mesh);
          console.log('STL model added to scene');
        })
        .catch(error => {
          console.error('Error loading STL:', error);
          
          // Add a simple cube as fallback
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          const material = new THREE.MeshBasicMaterial({ color: 0x808080, wireframe: true });
          const cube = new THREE.Mesh(geometry, material);
          scene.add(cube);
        });
    } catch (error) {
      console.error('Exception in STL loading:', error);
    }
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [modelPath]);
  
  return (
    <div 
      ref={mountRef} 
      className={`${className} w-full h-full bg-slate-900/50 rounded overflow-hidden`}
    />
  );
}