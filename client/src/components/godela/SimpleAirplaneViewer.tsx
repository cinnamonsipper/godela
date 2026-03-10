import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface SimpleAirplaneViewerProps {
  className?: string;
}

export default function SimpleAirplaneViewer({ className = '' }: SimpleAirplaneViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
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
    camera.position.set(0, 5, 10);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    
    // Create a simple airplane model
    const airplane = createAirplane();
    scene.add(airplane);
    
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
    };
  }, []);
  
  // Create a simple airplane model
  function createAirplane() {
    const airplaneGroup = new THREE.Group();
    
    // Fuselage (body)
    const fuselageGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    fuselageGeometry.rotateZ(Math.PI / 2); // Rotate to horizontal
    
    const fuselageMaterial = new THREE.MeshPhongMaterial({
      color: 0x3b82f6, // Blue color
      shininess: 50,
      specular: 0x111111
    });
    
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
    airplaneGroup.add(fuselage);
    
    // Wings
    const wingGeometry = new THREE.BoxGeometry(0.2, 5, 1);
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: 0x60a5fa, // Lighter blue
      shininess: 30,
      specular: 0x222222
    });
    
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    wings.position.set(0, 0, 0);
    airplaneGroup.add(wings);
    
    // Horizontal stabilizer (tail wings)
    const stabilizerGeometry = new THREE.BoxGeometry(0.1, 2, 0.5);
    const stabilizer = new THREE.Mesh(stabilizerGeometry, wingMaterial);
    stabilizer.position.set(2, 0, 0);
    airplaneGroup.add(stabilizer);
    
    // Vertical stabilizer (tail fin)
    const finGeometry = new THREE.BoxGeometry(0.8, 0.1, 1);
    const fin = new THREE.Mesh(finGeometry, wingMaterial);
    fin.position.set(2, 0, 0.5);
    airplaneGroup.add(fin);
    
    // Nose cone
    const noseGeometry = new THREE.ConeGeometry(0.5, 1, 16);
    noseGeometry.rotateZ(-Math.PI / 2);
    const noseMaterial = new THREE.MeshPhongMaterial({
      color: 0x2563eb, // Darker blue
      shininess: 80,
      specular: 0x333333
    });
    
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(-2.5, 0, 0);
    airplaneGroup.add(nose);
    
    // Cockpit (canopy)
    const cockpitGeometry = new THREE.SphereGeometry(0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    cockpitGeometry.rotateX(Math.PI);
    const cockpitMaterial = new THREE.MeshPhongMaterial({
      color: 0x93c5fd, // Very light blue
      transparent: true,
      opacity: 0.7,
      shininess: 100,
      specular: 0xffffff
    });
    
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.set(-1, 0, 0.3);
    cockpit.scale.set(1, 1.5, 1);
    airplaneGroup.add(cockpit);
    
    return airplaneGroup;
  }
  
  return (
    <div 
      ref={containerRef} 
      className={`${className} w-full h-full bg-slate-900/50 rounded overflow-hidden`}
    />
  );
}