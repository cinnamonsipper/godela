import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  useTexture, 
  Environment, 
  ContactShadows 
} from '@react-three/drei';
import * as THREE from 'three';

// Package style types
export type PackageStyle = 'slim-fit-mailer' | 'molded-pulp' | 'cushioned-envelope' | 'premium-box' | 'eco-waffle';
export type MaterialType = 'kraft' | 'white-recycled' | 'molded-pulp';
export type ProtectionLevel = 'standard' | 'enhanced';

// Props for the Phone model
interface PhoneModelProps {
  visible: boolean;
}

// Props for the Package model
interface PackageModelProps {
  style: PackageStyle;
  material: MaterialType;
  protectionLevel: ProtectionLevel;
  recycledContent: number;
  color: string;
  showPhone: boolean;
}

// Props for the main preview component
interface PhonePackagePreviewProps {
  style: PackageStyle;
  material: MaterialType;
  protectionLevel: ProtectionLevel;
  recycledContent: number;
  brandColor: string;
  showPhone: boolean;
  showPackage: boolean;
  className?: string;
}

// The phone model
const PhoneModel: React.FC<PhoneModelProps> = ({ visible }) => {
  const group = useRef<THREE.Group>(null);
  
  // Simple geometry for a phone
  return visible ? (
    <group ref={group} position={[0, 0, 0]}>
      {/* Phone body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.7, 1.4, 0.07]} />
        <meshPhysicalMaterial 
          color="#1a1a1a" 
          metalness={0.8} 
          roughness={0.2} 
          clearcoat={0.5} 
          clearcoatRoughness={0.3}
        />
      </mesh>
      
      {/* Phone screen */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[0.65, 1.35, 0.01]} />
        <meshPhysicalMaterial 
          color="#121212" 
          metalness={0.1} 
          roughness={0.1} 
          clearcoat={1} 
          clearcoatRoughness={0.1}
          transmission={0.9}
          transparent
        />
      </mesh>
      
      {/* Camera bump */}
      <mesh position={[0.25, 0.4, 0.06]}>
        <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      
      {/* Home button */}
      <mesh position={[0, -0.45, 0.04]}>
        <cylinderGeometry args={[0.1, 0.1, 0.01, 16]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  ) : null;
};

// The slim-fit mailer box
const SlimFitMailer: React.FC<PackageModelProps> = ({ 
  material, 
  protectionLevel, 
  recycledContent, 
  color,
  showPhone 
}) => {
  const group = useRef<THREE.Group>(null);
  
  // Material textures based on selected material
  const materialTexture = material === 'kraft' 
    ? useTexture('/cardboard-kraft.jpg') 
    : useTexture('/cardboard-white.jpg');
  
  materialTexture.wrapS = materialTexture.wrapT = THREE.RepeatWrapping;
  materialTexture.repeat.set(2, 2);
  
  // Box dimensions, slightly larger for enhanced protection
  const thickness = protectionLevel === 'enhanced' ? 0.05 : 0.03;
  const width = 0.8 + (protectionLevel === 'enhanced' ? 0.1 : 0);
  const height = 1.5 + (protectionLevel === 'enhanced' ? 0.1 : 0);
  const depth = 0.15 + (protectionLevel === 'enhanced' ? 0.08 : 0);
  
  // Apply color tint based on brand color
  const brandColorHex = color || '#FFFFFF';
  const colorObject = new THREE.Color(brandColorHex);
  const intensity = 0.1; // Subtle tint
  
  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Outer box */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          map={materialTexture}
          color={colorObject}
          aoMapIntensity={0.5}
          roughness={0.9} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Inner box (hollow) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width - thickness*2, height - thickness*2, depth - thickness*2]} />
        <meshStandardMaterial 
          map={materialTexture}
          color={colorObject}
          side={THREE.BackSide}
          aoMapIntensity={0.5}
          roughness={0.9} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Phone model inside the box (if visible) */}
      {showPhone && (
        <PhoneModel visible={true} />
      )}
      
      {/* Enhanced protection internal supports */}
      {protectionLevel === 'enhanced' && (
        <>
          {/* Corner supports */}
          <mesh position={[width/2 - thickness*1.5, height/2 - thickness*1.5, 0]}>
            <boxGeometry args={[thickness*1.5, thickness*1.5, depth - thickness*2.5]} />
            <meshStandardMaterial 
              map={materialTexture}
              color={colorObject}
              aoMapIntensity={0.5}
              roughness={0.9} 
              metalness={0.1}
            />
          </mesh>
          <mesh position={[-width/2 + thickness*1.5, height/2 - thickness*1.5, 0]}>
            <boxGeometry args={[thickness*1.5, thickness*1.5, depth - thickness*2.5]} />
            <meshStandardMaterial 
              map={materialTexture}
              color={colorObject}
              aoMapIntensity={0.5}
              roughness={0.9} 
              metalness={0.1}
            />
          </mesh>
          <mesh position={[width/2 - thickness*1.5, -height/2 + thickness*1.5, 0]}>
            <boxGeometry args={[thickness*1.5, thickness*1.5, depth - thickness*2.5]} />
            <meshStandardMaterial 
              map={materialTexture}
              color={colorObject}
              aoMapIntensity={0.5}
              roughness={0.9} 
              metalness={0.1}
            />
          </mesh>
          <mesh position={[-width/2 + thickness*1.5, -height/2 + thickness*1.5, 0]}>
            <boxGeometry args={[thickness*1.5, thickness*1.5, depth - thickness*2.5]} />
            <meshStandardMaterial 
              map={materialTexture}
              color={colorObject}
              aoMapIntensity={0.5}
              roughness={0.9} 
              metalness={0.1}
            />
          </mesh>
        </>
      )}
    </group>
  );
};

// The molded pulp tray with sleeve 
const MoldedPulpTray: React.FC<PackageModelProps> = ({ 
  protectionLevel, 
  recycledContent, 
  color,
  showPhone 
}) => {
  const group = useRef<THREE.Group>(null);
  
  // Material texture
  const materialTexture = useTexture('/molded-pulp.jpg');
  materialTexture.wrapS = materialTexture.wrapT = THREE.RepeatWrapping;
  materialTexture.repeat.set(4, 4);
  
  // Dimensions, slightly larger for enhanced protection
  const width = 0.9 + (protectionLevel === 'enhanced' ? 0.1 : 0);
  const height = 1.6 + (protectionLevel === 'enhanced' ? 0.1 : 0);
  const depth = 0.2 + (protectionLevel === 'enhanced' ? 0.08 : 0);
  
  // Apply color tint based on brand color
  const brandColorHex = color || '#FFFFFF';
  const colorObject = new THREE.Color(brandColorHex);
  const intensity = 0.1; // Subtle tint
  
  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Base tray */}
      <mesh castShadow receiveShadow position={[0, 0, -depth/3]}>
        <boxGeometry args={[width, height, depth/2]} />
        <meshStandardMaterial 
          map={materialTexture}
          color={"#e0d5c0"}
          aoMapIntensity={0.5}
          roughness={1} 
          metalness={0}
        />
      </mesh>
      
      {/* Inner cavity for phone */}
      <mesh position={[0, 0, -depth/4]}>
        <boxGeometry args={[0.75, 1.45, depth/2]} />
        <meshStandardMaterial 
          map={materialTexture}
          color={"#e0d5c0"}
          side={THREE.BackSide}
          aoMapIntensity={0.5}
          roughness={1} 
          metalness={0}
        />
      </mesh>
      
      {/* Sleeve */}
      <mesh position={[0, 0, depth/4]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth/16]} />
        <meshStandardMaterial 
          map={materialTexture}
          color={colorObject}
          aoMapIntensity={0.5}
          roughness={0.8} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Phone model inside the box (if visible) */}
      {showPhone && (
        <PhoneModel visible={true} />
      )}
    </group>
  );
};

// Cushioned paper-based envelope
const CushionedEnvelope: React.FC<PackageModelProps> = ({ 
  protectionLevel, 
  recycledContent, 
  color,
  showPhone 
}) => {
  const group = useRef<THREE.Group>(null);
  
  // Material texture
  const materialTexture = useTexture('/kraft-paper.jpg');
  materialTexture.wrapS = materialTexture.wrapT = THREE.RepeatWrapping;
  materialTexture.repeat.set(2, 2);
  
  // Bubble texture for inside
  const bubbleTexture = useTexture('/bubble-wrap.jpg');
  bubbleTexture.wrapS = bubbleTexture.wrapT = THREE.RepeatWrapping;
  bubbleTexture.repeat.set(6, 6);
  
  // Dimensions, slightly larger for enhanced protection
  const width = 1 + (protectionLevel === 'enhanced' ? 0.1 : 0);
  const height = 1.7 + (protectionLevel === 'enhanced' ? 0.1 : 0);
  const depth = 0.1 + (protectionLevel === 'enhanced' ? 0.05 : 0);
  
  // Apply color tint based on brand color
  const brandColorHex = color || '#FFFFFF';
  const colorObject = new THREE.Color(brandColorHex);
  const intensity = 0.1; // Subtle tint
  
  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Envelope back */}
      <mesh castShadow receiveShadow position={[0, 0, -depth/2]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          map={materialTexture}
          color={colorObject}
          side={THREE.DoubleSide}
          aoMapIntensity={0.5}
          roughness={0.9} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Envelope front (transparent to see inside) */}
      <mesh castShadow receiveShadow position={[0, 0, depth/2]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          map={materialTexture}
          color={colorObject}
          side={THREE.DoubleSide}
          aoMapIntensity={0.5}
          roughness={0.9} 
          metalness={0.1}
          opacity={0.8}
          transparent={true}
        />
      </mesh>
      
      {/* Bubble wrap inside */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width * 0.9, height * 0.9]} />
        <meshStandardMaterial 
          map={bubbleTexture}
          color={'#f8f8f8'}
          transparent={true}
          opacity={0.7}
          roughness={0.6} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Phone model inside the envelope (if visible) */}
      {showPhone && (
        <PhoneModel visible={true} />
      )}
      
      {/* Enhanced protection - extra padding at the corners */}
      {protectionLevel === 'enhanced' && (
        <>
          <mesh position={[width/3, height/3, 0]}>
            <planeGeometry args={[width/4, height/4]} />
            <meshStandardMaterial 
              map={bubbleTexture}
              color={'#f8f8f8'}
              transparent={true}
              opacity={0.9}
              roughness={0.6} 
              metalness={0.1}
            />
          </mesh>
          <mesh position={[-width/3, height/3, 0]}>
            <planeGeometry args={[width/4, height/4]} />
            <meshStandardMaterial 
              map={bubbleTexture}
              color={'#f8f8f8'}
              transparent={true}
              opacity={0.9}
              roughness={0.6} 
              metalness={0.1}
            />
          </mesh>
          <mesh position={[width/3, -height/3, 0]}>
            <planeGeometry args={[width/4, height/4]} />
            <meshStandardMaterial 
              map={bubbleTexture}
              color={'#f8f8f8'}
              transparent={true}
              opacity={0.9}
              roughness={0.6} 
              metalness={0.1}
            />
          </mesh>
          <mesh position={[-width/3, -height/3, 0]}>
            <planeGeometry args={[width/4, height/4]} />
            <meshStandardMaterial 
              map={bubbleTexture}
              color={'#f8f8f8'}
              transparent={true}
              opacity={0.9}
              roughness={0.6} 
              metalness={0.1}
            />
          </mesh>
        </>
      )}
    </group>
  );
};

// Controller for the camera and scene
const SceneController: React.FC = () => {
  const { camera } = useThree();
  
  // Set up initial camera position
  useEffect(() => {
    camera.position.set(3, 0, 0);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  // Gentle auto-rotation
  useFrame(() => {
    // camera.position.x = Math.sin(Date.now() * 0.0005) * 3;
    // camera.position.z = Math.cos(Date.now() * 0.0005) * 3;
    // camera.lookAt(0, 0, 0);
  });
  
  return null;
};

// Main preview component
const PhonePackagePreview: React.FC<PhonePackagePreviewProps> = ({
  style,
  material,
  protectionLevel,
  recycledContent,
  brandColor,
  showPhone,
  showPackage,
  className = ''
}) => {
  return (
    <div className={`${className} w-full h-full`}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[2, 0, 0]} fov={45} />
        <SceneController />
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[5, 5, 5]} 
          angle={0.3} 
          penumbra={0.8} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        
        {/* Phone model if package is not visible */}
        {!showPackage && <PhoneModel visible={showPhone} />}
        
        {/* Package models based on selected style */}
        {showPackage && style === 'slim-fit-mailer' && (
          <SlimFitMailer 
            style={style}
            material={material}
            protectionLevel={protectionLevel}
            recycledContent={recycledContent}
            color={brandColor}
            showPhone={showPhone}
          />
        )}
        
        {showPackage && style === 'molded-pulp' && (
          <MoldedPulpTray 
            style={style}
            material={material}
            protectionLevel={protectionLevel}
            recycledContent={recycledContent}
            color={brandColor}
            showPhone={showPhone}
          />
        )}
        
        {showPackage && style === 'cushioned-envelope' && (
          <CushionedEnvelope 
            style={style}
            material={material}
            protectionLevel={protectionLevel}
            recycledContent={recycledContent}
            color={brandColor}
            showPhone={showPhone}
          />
        )}
        
        <ContactShadows 
          position={[0, -1.8, 0]} 
          opacity={0.5} 
          scale={10} 
          blur={2.5} 
          far={4} 
        />
        <Environment preset="city" />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI - Math.PI / 6} 
        />
      </Canvas>
    </div>
  );
};

export default PhonePackagePreview;