import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

interface ConsolidatedSTLViewerProps {
  className?: string;
  modelPath: string;
}

export default function ConsolidatedSTLViewer({ className = '', modelPath }: ConsolidatedSTLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentMeshRef = useRef<THREE.Mesh | null>(null);
  
  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    // Camera setup with adjusted position
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5); // Start with a closer position

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add a second directional light from the opposite direction
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-1, -1, -1);
    scene.add(backLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.minDistance = 2;
    controls.maxDistance = 10;

    // Load STL function with auto-centering
    const loadSTL = async (path: string) => {
      try {
        // Clean up previous model if it exists
        scene.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            scene.remove(child);
          }
        });

        const loader = new STLLoader();
        const geometry = await loader.loadAsync(path);
        
        // Center the geometry
        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox?.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);

        // Scale the geometry to fit
        const size = new THREE.Vector3();
        geometry.boundingBox?.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim; // Scale to fit in a 2x2x2 box
        geometry.scale(scale, scale, scale);

        const material = new THREE.MeshPhongMaterial({
          color: 0x6366f1,
          specular: 0x111111,
          shininess: 30,
          side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Reset camera position
        camera.position.set(0, 0, 3);
        controls.target.set(0, 0, 0);
        controls.update();

      } catch (error) {
        console.error('Error loading STL:', error);
      }
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Load initial model
    if (modelPath) {
      loadSTL(modelPath);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [modelPath]);
  
  // Handle model changes
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current || !controlsRef.current) return;
    
    console.log(`Loading STL file: ${modelPath}`);
    
    // Clean up previous model
    if (currentMeshRef.current) {
      sceneRef.current.remove(currentMeshRef.current);
      if (currentMeshRef.current.geometry) currentMeshRef.current.geometry.dispose();
      if (currentMeshRef.current.material && !Array.isArray(currentMeshRef.current.material)) {
        currentMeshRef.current.material.dispose();
      }
      currentMeshRef.current = null;
    }
    
    // Load new STL
    const loader = new STLLoader();
    loader.load(
      modelPath,
      (geometry) => {
        try {
          console.log("STL loaded successfully!");
          
          // Process geometry
          geometry.computeBoundingBox();
          geometry.computeBoundingSphere();
          geometry.computeVertexNormals();
          geometry.center();
          
          // Create material
          const material = new THREE.MeshPhongMaterial({
            color: 0x3b82f6,
            specular: 0x222222,
            shininess: 40,
            flatShading: false
          });
          
          // Create mesh
          const mesh = new THREE.Mesh(geometry, material);
          mesh.rotation.x = -Math.PI / 2;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.name = "loadedSTL";
          
          // Add to scene
          sceneRef.current?.add(mesh);
          currentMeshRef.current = mesh;
          
          // Fit camera to object
          if (cameraRef.current && controlsRef.current) {
            const boundingBox = new THREE.Box3().setFromObject(mesh);
            const center = new THREE.Vector3();
            boundingBox.getCenter(center);
            
            const size = new THREE.Vector3();
            boundingBox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = cameraRef.current.fov * (Math.PI / 180);
            let cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.6;
            
            const direction = new THREE.Vector3();
            direction.subVectors(cameraRef.current.position, center).normalize();
            const newPosition = center.clone().addScaledVector(direction, cameraDistance);
            
            cameraRef.current.position.copy(newPosition);
            controlsRef.current.target.copy(center);
            controlsRef.current.update();
            cameraRef.current.lookAt(center);
          }
        } catch (error) {
          console.error("Error processing STL:", error);
          createFallbackModel();
        }
      },
      (xhr) => {
        console.log(`Loading progress: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
      },
      (error) => {
        console.error("Error loading STL:", error);
        console.error("Failed path:", modelPath);
        createFallbackModel();
      }
    );
  }, [modelPath]); // Re-run when modelPath changes
  
  // Helper function to create fallback model
  const createFallbackModel = () => {
    if (!sceneRef.current || !cameraRef.current || !controlsRef.current) return;
    
    const group = new THREE.Group();
    
    // Body/fuselage
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 12);
    bodyGeometry.rotateZ(Math.PI / 2);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x3b82f6 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);
    
    // Wings
    const wingGeometry = new THREE.BoxGeometry(1.5, 0.1, 5);
    const wingMaterial = new THREE.MeshPhongMaterial({ color: 0x60a5fa });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    wings.position.y = 0.2;
    group.add(wings);
    
    // Tail wings
    const tailWingGeometry = new THREE.BoxGeometry(0.8, 0.1, 1.5);
    const tailWings = new THREE.Mesh(tailWingGeometry, wingMaterial);
    tailWings.position.set(-1.2, 0.2, 0);
    group.add(tailWings);
    
    // Tail fin
    const tailFinGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.1);
    const tailFin = new THREE.Mesh(tailFinGeometry, wingMaterial);
    tailFin.position.set(-1.2, 0.5, 0);
    group.add(tailFin);
    
    // Nose
    const noseGeometry = new THREE.ConeGeometry(0.3, 0.5, 12);
    noseGeometry.rotateZ(-Math.PI / 2);
    const noseMaterial = new THREE.MeshPhongMaterial({ color: 0x1e40af });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(1.75, 0, 0);
    group.add(nose);
    
    // Set as current mesh
    currentMeshRef.current = group as unknown as THREE.Mesh;
    sceneRef.current.add(group);
    
    // Position camera
    cameraRef.current.position.set(0, 2, 8);
    cameraRef.current.lookAt(0, 0, 0);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };
  
  return (
    <div 
      ref={containerRef} 
      className={`${className} w-full h-full bg-slate-900/50 rounded overflow-hidden`}
    />
  );
}