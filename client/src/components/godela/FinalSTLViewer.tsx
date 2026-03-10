import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

interface FinalSTLViewerProps {
  className?: string;
}

export default function FinalSTLViewer({ className = '' }: FinalSTLViewerProps) {
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
    camera.position.set(0, 0, 5);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
    backLight.position.set(0, 0, -1);
    scene.add(backLight);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    
    // Function to load STL
    function loadSTL() {
      console.log('Loading STL file: /Planes/give_me_30_different__0505210111_generate.stl');
      
      const loader = new STLLoader();
      
      loader.load(
        '/Planes/give_me_30_different__0505210111_generate.stl',
        (geometry) => {
          console.log('STL loaded successfully!');
          
          // Center the geometry
          geometry.center();
          
          // Calculate bounding box
          const box = new THREE.Box3().setFromObject(new THREE.Mesh(geometry));
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          
          // Compute vertex normals
          geometry.computeVertexNormals();
          
          // Create material
          const material = new THREE.MeshPhongMaterial({
            color: 0x3b82f6,
            specular: 0x111111,
            shininess: 30,
            flatShading: false
          });
          
          // Create mesh
          const mesh = new THREE.Mesh(geometry, material);
          
          // Scale to fit view
          const scale = 4 / maxDim;
          mesh.scale.set(scale, scale, scale);
          
          // Add to scene
          scene.add(mesh);
          console.log('Mesh added to scene');
        },
        (xhr) => {
          console.log(`Loading progress: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
        },
        (error) => {
          console.error('Error loading STL:', error);
          // On error, show a simple placeholder
          createPlaceholder();
        }
      );
    }
    
    // Function to create a placeholder if STL loading fails
    function createPlaceholder() {
      console.log('Creating placeholder model');
      
      // Create a simple airplane shape
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
      
      scene.add(group);
      console.log('Placeholder model added');
    }
    
    // Try to load STL file
    loadSTL();
    
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
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      controls.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className={`${className} w-full h-full bg-slate-900/50 rounded overflow-hidden`}
    />
  );
}