import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

interface UltraSimpleSTLViewerProps {
  className?: string;
}

export default function UltraSimpleSTLViewer({ className = '' }: UltraSimpleSTLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Log container dimensions
    console.log(`Container size: ${containerRef.current.clientWidth}x${containerRef.current.clientHeight}`);
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121722);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 0, 5);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    
    // Add a fallback cube in case STL loading fails
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3b82f6,
      metalness: 0.3,
      roughness: 0.4,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // Don't add it yet - we'll add it only if STL loading fails
    
    // Add coordinate axes for debugging
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);
    
    // Load STL file
    const loader = new STLLoader();
    console.log('Attempting to load STL file...');
    
    // Define model path
    const modelPath = '/give_me_30_different__0505185232_generate.stl';
    
    loader.load(
      modelPath,
      (geometry) => {
        // Success callback
        console.log('STL loaded successfully!');
        
        // Center geometry
        geometry.center();
        geometry.computeVertexNormals();
        
        // Create material
        const material = new THREE.MeshStandardMaterial({ 
          color: 0x3b82f6,
          metalness: 0.3,
          roughness: 0.4,
        });
        
        // Create mesh and add to scene
        const mesh = new THREE.Mesh(geometry, material);
        
        // Scale to fit view
        const box = new THREE.Box3().setFromObject(mesh);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        mesh.scale.set(scale, scale, scale);
        
        scene.add(mesh);
        console.log('Mesh added to scene');
      },
      (xhr) => {
        // Progress callback
        console.log(`${(xhr.loaded / xhr.total * 100).toFixed(0)}% loaded`);
      },
      (error) => {
        // Error callback
        console.error('Error loading STL:', error);
        
        // Since STL failed to load, add fallback cube
        scene.add(cube);
        console.log('Added fallback cube due to STL loading failure');
        
        // Let's try creating a basic car shape as a better fallback
        createFallbackCar(scene);
      }
    );
    
    // Create a simple car shape as a fallback
    function createFallbackCar(scene: THREE.Scene) {
      // Main body
      const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 1);
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3b82f6, 
        metalness: 0.5,
        roughness: 0.2
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      scene.add(body);
      
      // Cabin
      const cabinGeometry = new THREE.BoxGeometry(0.9, 0.4, 0.8);
      const cabinMaterial = new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        metalness: 0.2,
        roughness: 0.1,
      });
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
      cabin.position.set(-0.2, 0.45, 0);
      scene.add(cabin);
      
      // Wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 16);
      wheelGeometry.rotateX(Math.PI / 2);
      const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.1,
        roughness: 0.8,
      });
      
      const wheels = [
        { x: 0.7, y: -0.25, z: 0.5 },
        { x: 0.7, y: -0.25, z: -0.5 },
        { x: -0.7, y: -0.25, z: 0.5 },
        { x: -0.7, y: -0.25, z: -0.5 }
      ];
      
      wheels.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos.x, pos.y, pos.z);
        scene.add(wheel);
      });
      
      console.log('Created fallback car model');
    }
    
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
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      renderer.dispose();
      controls.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className={`${className} w-full h-full bg-slate-900/50 rounded-md overflow-hidden`}
    />
  );
}