import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

interface MinimalSTLViewerProps {
  className?: string;
}

/**
 * A very minimal STL viewer with extensive error handling
 */
export default function MinimalSTLViewer({ className = '' }: MinimalSTLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const debugRef = useRef<HTMLDivElement>(null);
  
  // Log debug message
  const logDebug = (message: string) => {
    if (debugRef.current) {
      debugRef.current.innerHTML += `<div>${message}</div>`;
    }
    console.log(message);
  };
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    logDebug("Initializing STL viewer");
    
    try {
      // Setup scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x121722);
      
      // Setup camera
      const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
      camera.position.set(3, 2, 3);
      
      // Setup renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      containerRef.current.appendChild(renderer.domElement);
      
      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      // Add controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = true;
      
      // Add a temporary cube to verify the scene is working
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshPhongMaterial({ color: 0x0088ff })
      );
      scene.add(cube);
      
      logDebug("Scene initialized with temporary cube");
      
      // Render loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
      
      // Attempt to load the STL file
      logDebug("Attempting to load STL from /Planes/give_me_30_different__0505210111_generate.stl");
      
      // Try to load STL
      const loader = new STLLoader();
      
      const onProgress = (xhr: ProgressEvent) => {
        const percentComplete = xhr.loaded / xhr.total * 100;
        logDebug(`Loading: ${Math.round(percentComplete)}%`);
      };
      
      const onError = (err: any) => {
        logDebug(`Error loading STL: ${err}`);
        
        // Create a red cube to indicate error
        const errorCube = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshPhongMaterial({ color: 0xff0000 })
        );
        scene.add(errorCube);
        
        // Try local file
        logDebug("Trying a different approach...");
        
        // Add a simple airplane model directly
        const airplane = createSimpleAirplane();
        scene.add(airplane);
        scene.remove(cube); // Remove temporary cube
      };
      
      // Create a simple airplane model as a fallback
      const createSimpleAirplane = () => {
        logDebug("Creating procedural airplane model");
        
        // Create a group to hold all components
        const airplane = new THREE.Group();
        
        // Main body - elongated
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.2, 3, 8);
        bodyGeometry.rotateZ(Math.PI / 2); // Rotate to horizontal position
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
          color: 0x4287f5, 
          shininess: 80,
          specular: 0x111111
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        airplane.add(body);
        
        // Wings
        const wingGeometry = new THREE.BoxGeometry(0.1, 4, 1);
        const wingMaterial = new THREE.MeshPhongMaterial({ 
          color: 0x5a9cf5,
          shininess: 60,
          specular: 0x222222
        });
        const wings = new THREE.Mesh(wingGeometry, wingMaterial);
        wings.position.x = -0.2;
        airplane.add(wings);
        
        // Tail wings - horizontal
        const tailWingGeometry = new THREE.BoxGeometry(0.08, 1.5, 0.4);
        const tailWings = new THREE.Mesh(tailWingGeometry, wingMaterial);
        tailWings.position.set(1.4, 0, 0);
        airplane.add(tailWings);
        
        // Tail wing - vertical
        const vTailGeometry = new THREE.BoxGeometry(0.6, 0.08, 0.8);
        const vTail = new THREE.Mesh(vTailGeometry, wingMaterial);
        vTail.position.set(1.4, 0, 0.2);
        airplane.add(vTail);
        
        // Nose cone - for the front
        const noseGeometry = new THREE.ConeGeometry(0.3, 0.8, 8);
        noseGeometry.rotateZ(-Math.PI / 2); // Point forward
        const noseMaterial = new THREE.MeshPhongMaterial({ 
          color: 0x3a78d4, 
          shininess: 90,
          specular: 0x333333
        });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.x = -1.5;
        airplane.add(nose);
        
        // Cockpit
        const cockpitGeometry = new THREE.SphereGeometry(0.35, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        cockpitGeometry.rotateX(Math.PI);
        cockpitGeometry.scale(1, 0.8, 1);
        const cockpitMaterial = new THREE.MeshPhongMaterial({ 
          color: 0xadd8e6, 
          shininess: 100,
          specular: 0x444444,
          transparent: true,
          opacity: 0.7
        });
        const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
        cockpit.position.set(-0.7, 0, 0.25);
        airplane.add(cockpit);
        
        // Scale the entire airplane
        airplane.scale.set(0.7, 0.7, 0.7);
        
        return airplane;
      }
      
      // Try loading
      try {
        loader.load('/Planes/give_me_30_different__0505210111_generate.stl', (geometry) => {
          logDebug("STL file loaded successfully!");
          
          // Create material
          const material = new THREE.MeshPhongMaterial({
            color: 0x3b82f6,
            specular: 0x111111,
            shininess: 100,
          });
          
          // Create mesh
          const mesh = new THREE.Mesh(geometry, material);
          
          // Center the model
          geometry.computeBoundingBox();
          if (geometry.boundingBox) {
            const center = new THREE.Vector3();
            geometry.boundingBox.getCenter(center);
            mesh.position.sub(center);
            
            // Scale model to fit view
            const size = new THREE.Vector3();
            geometry.boundingBox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 4 / maxDim;
            mesh.scale.set(scale, scale, scale);
          }
          
          // Add to scene
          scene.add(mesh);
          scene.remove(cube); // Remove temporary cube
          
          logDebug("Model added to scene");
        }, onProgress, onError);
      } catch (ex) {
        logDebug(`Exception during load: ${ex}`);
        onError(ex);
      }
      
      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current) return;
        
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
      
      window.addEventListener('resize', handleResize);
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    } catch (e) {
      logDebug(`Fatal error: ${e}`);
    }
  }, []);
  
  return (
    <div className={`${className} relative`}>
      <div 
        ref={containerRef} 
        className="w-full h-full bg-gradient-to-b from-indigo-900/10 to-blue-900/5 rounded overflow-hidden"
      ></div>
      
      {/* Debug panel - visible for troubleshooting */}
      <div 
        ref={debugRef}
        className="absolute bottom-0 left-0 right-0 bg-black/80 text-green-400 text-xs font-mono p-1 max-h-20 overflow-auto"
        style={{ fontSize: '8px' }}
      ></div>
    </div>
  );
}