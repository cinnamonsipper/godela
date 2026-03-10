import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { SimulationStage } from '@/lib/apsWorkbench/types';
import { EnsembleChart } from './EnsembleChart';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      sphereGeometry: any;
      cylinderGeometry: any;
      instancedMesh: any;
      meshBasicMaterial: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
    }
  }
}

interface InsightCanvasProps {
  stage: SimulationStage;
  morphValue: number; // 0 to 1
}

// A stylized abstract car component
const AbstractCar = ({ morphValue, stage }: { morphValue: number; stage: SimulationStage }) => {
  const spoilerRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const lastSwitchRef = useRef(0);
  
  // Internal state for rapid cycling visualization
  const [cycleValue, setCycleValue] = useState(0);
  const [bodyScale, setBodyScale] = useState<[number, number, number]>([1, 1, 1]);

  const isOptimized = stage === SimulationStage.INSIGHT;
  const isAnalyzing = stage === SimulationStage.ANALYZING;
  const isInduction = stage === SimulationStage.INDUCTION; // The "Cycling" phase
  const isDeduction = stage === SimulationStage.DEDUCTION; // The "Solver" phase

  // Animate spoiler based on morph value or rapid cycling
  useFrame((state) => {
    // Rapid Cycling Logic (Flipbook effect)
    if (isInduction) {
        const time = state.clock.getElapsedTime();
        // Switch design candidate every 150ms
        if (time - lastSwitchRef.current > 0.15) {
            setCycleValue(Math.random());
            // Randomize body proportions slightly to simulate different design files
            setBodyScale([
                1 + (Math.random() - 0.5) * 0.2, // Width
                1,
                1 + (Math.random() - 0.5) * 0.3  // Length
            ]);
            lastSwitchRef.current = time;
        }
    } else {
        // Reset scale when not cycling
        if (bodyScale[0] !== 1) setBodyScale([1, 1, 1]);
    }

    if (spoilerRef.current) {
      // Determine effective morph value
      const effectiveMorph = isInduction ? cycleValue : morphValue;

      // Rotate and lift spoiler based on optimization
      const targetRotation = THREE.MathUtils.degToRad(effectiveMorph * 15); // 0 to 15 degrees
      const targetY = 0.8 + (effectiveMorph * 0.1);
      
      // Snap movement if cycling to look distinct, lerp if morphing for smoothness
      const lerpFactor = isInduction ? 0.9 : 0.1;

      spoilerRef.current.rotation.x = THREE.MathUtils.lerp(spoilerRef.current.rotation.x, -targetRotation, lerpFactor);
      spoilerRef.current.position.y = THREE.MathUtils.lerp(spoilerRef.current.position.y, targetY, lerpFactor);
    }
  });

  // Material Logic
  const getMaterial = (part: 'body' | 'spoiler' | 'nose') => {
    if (isOptimized) {
        // Thermal / Pressure Map
        if (part === 'spoiler') return <meshStandardMaterial color="#FF3300" roughness={0.4} metalness={0.2} emissive="#aa0000" emissiveIntensity={0.4} />;
        if (part === 'nose') return <meshStandardMaterial color="#FF9900" roughness={0.4} metalness={0.2} />;
        return <meshStandardMaterial color="#0066FF" roughness={0.4} metalness={0.5} />;
    }
    
    if (isAnalyzing || isDeduction) {
        return <meshStandardMaterial 
            color="#00E5FF" 
            wireframe={true}
            emissive="#00E5FF"
            emissiveIntensity={isDeduction ? 0.8 : 0.2}
        />;
    }

    if (isInduction) {
         return <meshStandardMaterial color="#94a3b8" roughness={0.1} metalness={0.8} opacity={0.9} transparent />;
    }

    // Default Baseline
    return <meshStandardMaterial color="#64748B" roughness={0.2} metalness={0.8} />;
  };

  return (
    <group position={[0, -0.5, 0]}>
      {/* Main Body */}
      <mesh ref={bodyRef} position={[0, 0.5, 0]} scale={bodyScale} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.6, 4]} />
        {getMaterial('body')}
      </mesh>
      
      {/* Nose Cone */}
      <mesh position={[0, 0.4, 2.01 * bodyScale[2]]} rotation={[0,0,0]}>
          <boxGeometry args={[1.7, 0.4, 0.1]} />
          {getMaterial('nose')}
      </mesh>
      
      {/* Cockpit */}
      <mesh position={[0, 1.0, -0.5]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color={isAnalyzing || isDeduction ? "#001122" : "#111"} roughness={0.1} metalness={0.9} wireframe={isAnalyzing || isDeduction} />
      </mesh>

      {/* Wheels */}
      {[[-0.9, 0.3, 1.2], [0.9, 0.3, 1.2], [-0.9, 0.3, -1.2], [0.9, 0.3, -1.2]].map((pos, i) => (
        <mesh key={i} position={[pos[0] * bodyScale[0], pos[1], pos[2] * bodyScale[2]]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.4, 32]} />
          <meshStandardMaterial color="#000" wireframe={isAnalyzing || isDeduction} />
        </mesh>
      ))}

      {/* Active Aero / Spoiler */}
      <group ref={spoilerRef} position={[0, 0.8, 1.8 * bodyScale[2]]}>
        <mesh>
          <boxGeometry args={[1.6, 0.1, 0.5]} />
          {getMaterial('spoiler')}
        </mesh>
        <mesh position={[0.6, -0.2, 0]}>
           <boxGeometry args={[0.1, 0.4, 0.3]} />
           <meshStandardMaterial color="#333" wireframe={isAnalyzing || isDeduction} />
        </mesh>
        <mesh position={[-0.6, -0.2, 0]}>
           <boxGeometry args={[0.1, 0.4, 0.3]} />
           <meshStandardMaterial color="#333" wireframe={isAnalyzing || isDeduction} />
        </mesh>
      </group>
    </group>
  );
};

// Particle Flow Visualization
const FlowStreamlines = ({ active, speed = 1 }: { active: boolean; speed?: number }) => {
  const count = 300;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Random starting positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 4;
      const y = Math.random() * 2;
      const z = -10 - Math.random() * 10;
      const speedOffset = Math.random() * 0.5 + 0.5;
      temp.push({ x, y, z, speedOffset, originalZ: z });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current || !active) return;

    particles.forEach((particle, i) => {
      // Move particle forward
      particle.z += 0.2 * particle.speedOffset * speed;
      
      // Reset if passed camera
      if (particle.z > 5) {
        particle.z = particle.originalZ;
      }

      // Simple flow logic: curve around the "car"
      let y = particle.y;
      // Lift over car body
      if (particle.z > -2 && particle.z < 2 && Math.abs(particle.x) < 1) {
         y += 0.08; 
      }
      // Vortex effect near spoiler
      if (particle.z > 1.8 && particle.z < 3 && Math.abs(particle.x) < 1) {
         y += Math.sin(particle.z * 5) * 0.1;
      }

      dummy.position.set(particle.x, y, particle.z);
      // Stretch based on speed
      dummy.scale.set(0.02, 0.02, 0.8 * speed); 
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} visible={active}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00FF94" transparent opacity={0.6} />
    </instancedMesh>
  );
};

export const InsightCanvas: React.FC<InsightCanvasProps> = ({ stage, morphValue }) => {
  const isOptimized = stage === SimulationStage.INSIGHT;
  const isAnalyzing = stage === SimulationStage.ANALYZING;
  const isInduction = stage === SimulationStage.INDUCTION;
  const isDeduction = stage === SimulationStage.DEDUCTION;
  
  // Only show flow simulation in the FINAL insight stage
  const showParticles = isOptimized;
  const flowSpeed = 3.0;

  // Show HUD Chart in Induction, Deduction, and Insight
  const showHud = stage === SimulationStage.INDUCTION || 
                  stage === SimulationStage.CHECKING || 
                  stage === SimulationStage.VALIDATION_CHECK ||
                  stage === SimulationStage.DEDUCTION || 
                  stage === SimulationStage.INSIGHT;

  return (
    <div className="w-full h-full bg-[#0a0b0e] relative" data-testid="insight-canvas">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h2 className="text-white/90 text-sm font-sans font-medium tracking-widest uppercase">Insight Canvas</h2>
        <div className="flex gap-2 mt-2">
            <span className={`text-xs px-2 py-1 bg-[#1a1b1f]/80 backdrop-blur border border-gray-700 rounded text-gray-400 uppercase transition-colors 
                ${isAnalyzing ? 'text-cyan-500 border-cyan-500 animate-pulse' : ''}
                ${isInduction ? 'text-white border-white animate-pulse' : ''}
                ${isDeduction ? 'text-yellow-500 border-yellow-500 animate-pulse' : ''}
            `} data-testid="mode-indicator">
                Mode: {
                    isOptimized ? 'Physics Viz (Thermal/Flow)' : 
                    (isInduction ? 'Rapid Prototyping (Scanning)' : 
                    (isDeduction ? 'Solver Mesh (Computing)' : 
                    (isAnalyzing ? 'Topology Analysis' : 'Baseline')))
                }
            </span>
            {isOptimized && (
                <>
                <span className="text-xs px-2 py-1 bg-green-500/10 border border-green-500/50 rounded text-green-500 uppercase animate-in fade-in zoom-in duration-500">
                    Flow Attached
                </span>
                <span className="text-xs px-2 py-1 bg-orange-500/10 border border-orange-500/50 rounded text-orange-500 uppercase animate-in fade-in zoom-in duration-700">
                    Heat Map Active
                </span>
                </>
            )}
        </div>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={3} maxDistance={10} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Grid position={[0, -0.51, 0]} args={[20, 20]} cellSize={1} sectionSize={5} cellThickness={0.5} sectionThickness={1} fadeDistance={20} sectionColor="#475569" cellColor="#1e293b" />

        {/* Models */}
        <AbstractCar morphValue={morphValue} stage={stage} />
        
        {isOptimized && (
             // Ghost of baseline for comparison
             <group position={[0, -0.5, 0]}>
                 <mesh position={[0, 0.5, 0]}>
                     <boxGeometry args={[1.8, 0.6, 4]} />
                     <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} />
                 </mesh>
             </group>
        )}

        <FlowStreamlines active={showParticles} speed={flowSpeed} />
        
      </Canvas>

      {/* GLASSMORPHIC HUD FOR LIVE TELEMETRY */}
      {showHud && (
          <div className="absolute bottom-6 right-6 w-96 h-64 bg-[#1a1b1f]/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700" data-testid="ensemble-hud">
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black/20">
                  <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider">Design Space Explorer</span>
              </div>
              <div className="w-full h-full pb-10">
                  <EnsembleChart stage={stage} />
              </div>
          </div>
      )}

    </div>
  );
};
