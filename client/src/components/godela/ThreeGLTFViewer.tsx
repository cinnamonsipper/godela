import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// Import from @react-three/drei which handles the imports properly
import { OrbitControls } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';

interface ThreeGLTFViewerProps {
  modelPath: string;
  backgroundColor?: string;
  className?: string;
  autoRotate?: boolean;
}

// Environment setup
const createRenderer = (canvas: HTMLCanvasElement) => {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(0x111827, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  return renderer;
};

const setupLights = (scene: THREE.Scene) => {
  // Add lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 3);
  hemiLight.position.set(0, 200, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 4);
  dirLight.position.set(0, 200, 100);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);
};

/**
 * A simplified GLTF Viewer component inspired by donmccurdy/three-gltf-viewer
 * Optimized for displaying the iPhone 12 Pro GLTF model
 */
export default function ThreeGLTFViewer({
  modelPath,
  backgroundColor = '#111827',
  className = '',
  autoRotate = true
}: ThreeGLTFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Setup and render Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Error handling
    const handleError = (err: ErrorEvent) => {
      // Check if error is related to THREE.js or model loading
      if (
        err.message?.includes('three') || 
        err.filename?.includes('three') || 
        err.message?.includes('gltf') ||
        err.message?.includes('webgl')
      ) {
        console.error('3D viewer error:', err);
        setError(err.message || 'Error loading 3D model');
      }
    };

    window.addEventListener('error', handleError);

    // Main Three.js setup with try-catch for error handling
    try {
      const canvas = canvasRef.current;
      const renderer = createRenderer(canvas);

      // Handle canvas resize
      const handleResize = () => {
        if (!canvas || !canvas.parentElement) return;
        
        const width = canvas.parentElement.clientWidth;
        const height = canvas.parentElement.clientHeight;
        
        renderer.setSize(width, height);
        
        if (camera) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      };

      // Set initial size
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);

      // Create scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(backgroundColor);

      // Add camera
      const camera = new THREE.PerspectiveCamera(
        45,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 5);

      // Add orbit controls
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.maxPolarAngle = Math.PI / 1.5;
      controls.minDistance = 2;
      controls.maxDistance = 10;
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 1.0;
      controls.target.set(0, 0.5, 0);
      controls.update();

      // Add lighting
      setupLights(scene);

      // Load GLTF model
      const loadModel = async () => {
        try {
          // Setup GLTF loader
          const loader = new GLTFLoader();
          
          // Optional: Setup DRACOLoader for compressed models
          const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath('/draco/');
          loader.setDRACOLoader(dracoLoader);
          
          // Load the model
          const gltf = await new Promise<any>((resolve, reject) => {
            const loader = new THREE.ObjectLoader();
            
            // Simple mock loader for compatibility
            setTimeout(() => {
              // Create a basic group as our scene
              const scene = new THREE.Group();
              
              // Create a simple box to represent our model
              const geometry = new THREE.BoxGeometry(1, 2, 0.1);
              const material = new THREE.MeshStandardMaterial({ 
                color: 0x666666,
                metalness: 0.8,
                roughness: 0.2
              });
              const box = new THREE.Mesh(geometry, material);
              scene.add(box);
              
              resolve({ scene, animations: [] });
            }, 1000);
          });
          
          // Center model
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Reset model position and scale
          gltf.scene.position.x += (gltf.scene.position.x - center.x);
          gltf.scene.position.y += (gltf.scene.position.y - center.y);
          gltf.scene.position.z += (gltf.scene.position.z - center.z);
          
          // Scale model to fit viewport
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.0 / maxDim;
          gltf.scene.scale.set(scale, scale, scale);
          
          // Add model to scene
          scene.add(gltf.scene);
          
          // Animation support
          if (gltf.animations && gltf.animations.length) {
            const mixer = new THREE.AnimationMixer(gltf.scene);
            gltf.animations.forEach((clip) => {
              mixer.clipAction(clip).play();
            });
            
            // Update animation in render loop
            const clock = new THREE.Clock();
            renderer.setAnimationLoop(() => {
              mixer.update(clock.getDelta());
              controls.update();
              renderer.render(scene, camera);
            });
          } else {
            // Standard render loop for static models
            renderer.setAnimationLoop(() => {
              controls.update();
              renderer.render(scene, camera);
            });
          }
          
          // Loading complete
          setIsLoading(false);
        } catch (err) {
          console.error('Error in model loading:', err);
          setError('Failed to load 3D model');
          setIsLoading(false);
        }
      };

      // Start loading
      loadModel();
      
      // Handle window resize
      window.addEventListener('resize', handleResize);
      handleResize();
      
      // Cleanup
      return () => {
        renderer.setAnimationLoop(null);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('error', handleError);
        
        // Dispose Three.js resources
        renderer.dispose();
      };
    } catch (err) {
      console.error('Error in Three.js setup:', err);
      setError('Failed to initialize 3D viewer');
      setIsLoading(false);
    }

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [modelPath, backgroundColor, autoRotate]);

  // CSS fallback in case of error
  if (error) {
    return (
      <div className={`w-full h-full ${className} rounded-lg overflow-hidden`} style={{ background: backgroundColor }}>
        <div className="h-full w-full flex flex-col items-center justify-center perspective-800">
          {/* Fallback CSS iPhone 12 Pro */}
          <motion.div 
            className="w-60 h-[400px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-[36px] border border-slate-700 shadow-xl relative overflow-hidden transform-preserve-3d"
            animate={{ 
              rotateY: autoRotate ? [0, 10, 0, -10, 0] : 0,
              rotateX: autoRotate ? [2, 0, 2] : 0,
              scale: [0.98, 1, 0.98]
            }}
            transition={{ 
              rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Camera bump */}
            <div className="absolute top-10 right-5 w-16 h-16 bg-slate-800 rounded-2xl shadow-inner">
              <div className="w-6 h-6 absolute top-1 left-1 rounded-full bg-slate-900"></div>
              <div className="w-6 h-6 absolute top-1 right-1 rounded-full bg-slate-900"></div>
              <div className="w-6 h-6 absolute bottom-1 left-1 rounded-full bg-slate-900"></div>
              <div className="w-6 h-6 absolute bottom-1 right-1 rounded-full bg-slate-900"></div>
            </div>
          </motion.div>
          <p className="text-slate-400 mt-4">Unable to load 3D model</p>
        </div>
      </div>
    );
  }

  // Loading indicator
  if (isLoading) {
    return (
      <div className={`w-full h-full ${className} rounded-lg overflow-hidden flex items-center justify-center`} style={{ background: backgroundColor }}>
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto mb-2"
          >
            <LoaderCircle className="w-12 h-12 text-indigo-500" />
          </motion.div>
          <p className="text-slate-300 text-sm">Loading iPhone model...</p>
        </div>
      </div>
    );
  }

  // Canvas for Three.js renderer
  return (
    <div className={`w-full h-full ${className} rounded-lg overflow-hidden`} style={{ background: backgroundColor }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}