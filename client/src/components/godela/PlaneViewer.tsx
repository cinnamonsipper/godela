import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface PlaneViewerProps {
  className?: string;
}

/**
 * A Three.js-based 3D airplane model viewer
 * Uses a procedurally generated airplane instead of loading an STL file
 */
export default function PlaneViewer({ className = '' }: PlaneViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameIdRef = useRef<number | null>(null);
  
  // Initialize Three.js scene with airplane model
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121722);
    sceneRef.current = scene;
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create a simple airplane model directly
    const createAirplaneModel = () => {
      // Create a group to hold all parts
      const airplane = new THREE.Group();
      
      // Main body (fuselage)
      const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.2, 3, 8);
      bodyGeometry.rotateZ(Math.PI / 2); // Rotate to be horizontal
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x3b82f6,
        specular: 0x111111,
        shininess: 80
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      airplane.add(body);
      
      // Wings
      const wingGeometry = new THREE.BoxGeometry(0.1, 4, 1);
      const wingMaterial = new THREE.MeshPhongMaterial({
        color: 0x2563eb,
        specular: 0x222222,
        shininess: 60
      });
      const wings = new THREE.Mesh(wingGeometry, wingMaterial);
      wings.position.x = -0.2;
      airplane.add(wings);
      
      // Tail wings (horizontal)
      const tailWingGeometry = new THREE.BoxGeometry(0.08, 1.5, 0.4);
      const tailWing = new THREE.Mesh(tailWingGeometry, wingMaterial);
      tailWing.position.set(1.4, 0, 0);
      airplane.add(tailWing);
      
      // Tail fin (vertical)
      const finGeometry = new THREE.BoxGeometry(0.6, 0.08, 0.8);
      const fin = new THREE.Mesh(finGeometry, wingMaterial);
      fin.position.set(1.4, 0, 0.2);
      airplane.add(fin);
      
      // Nose cone
      const noseGeometry = new THREE.ConeGeometry(0.3, 0.8, 8);
      noseGeometry.rotateZ(-Math.PI / 2);
      const noseMaterial = new THREE.MeshPhongMaterial({
        color: 0x1d4ed8,
        specular: 0x333333,
        shininess: 90
      });
      const nose = new THREE.Mesh(noseGeometry, noseMaterial);
      nose.position.x = -1.5;
      airplane.add(nose);
      
      // Cockpit canopy
      const cockpitGeometry = new THREE.SphereGeometry(0.35, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      cockpitGeometry.rotateX(Math.PI);
      cockpitGeometry.scale(1, 0.8, 1);
      const cockpitMaterial = new THREE.MeshPhongMaterial({
        color: 0xadd8e6,
        specular: 0x444444,
        shininess: 100,
        transparent: true,
        opacity: 0.7
      });
      const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
      cockpit.position.set(-0.7, 0, 0.25);
      airplane.add(cockpit);
      
      // Scale the entire model
      airplane.scale.set(0.7, 0.7, 0.7);
      
      return airplane;
    };
    
    // Add the airplane model to the scene
    const airplane = createAirplaneModel();
    scene.add(airplane);
    modelRef.current = airplane;
    
    // Set up orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controlsRef.current = controls;
    
    // Position camera for good view
    camera.position.set(3, 2, 3);
    camera.lookAt(0, 0, 0);
    
    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);
  
  return (
    <div className={`${className} relative`}>
      <div 
        ref={containerRef} 
        className="w-full h-full bg-gradient-to-b from-indigo-900/10 to-blue-900/5 rounded overflow-hidden"
      ></div>
    </div>
  );
}