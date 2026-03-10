import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { useApp } from '../context/AppContext';

type GLTFResult = GLTF & {
  nodes: { [name: string]: THREE.Mesh };
  materials: { [name: string]: THREE.Material };
  animations: THREE.AnimationClip[];
};

interface ModelProps {
  url: string;
  renderMode: string;
}

export const Model: React.FC<ModelProps> = ({ url, renderMode }) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url) as GLTFResult;
  const { actions, mixer } = useAnimations(animations, group);
  
  const { 
    isPlaying, 
    animationProgress, 
    setAnimations, 
    currentAnimation,
    animationSpeed,
    wireframeOpacity,
    setCurrentAnimation,
    selectedAnimations
  } = useApp();
  
  // Set animations when model loads
  useEffect(() => {
    if (animations.length > 0) {
      setAnimations(animations);
      setCurrentAnimation(animations[0].name);
      
      Object.values(actions).forEach(action => action?.stop());
      
      if (isPlaying) {
        selectedAnimations.forEach(animName => {
          if (actions[animName]) {
            const action = actions[animName];
            action.setEffectiveTimeScale(animationSpeed);
            action.play();
          }
        });
      }
    }
    
    return () => {
      Object.values(actions).forEach(action => action?.stop());
      mixer.stopAllAction();
    };
  }, [animations, actions, setAnimations, setCurrentAnimation, url, selectedAnimations]);
  
  // Handle wireframe mode
  useEffect(() => {
    if (!group.current) return;

    group.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (renderMode === 'wireframe') {
          if (!child.userData.originalMaterial) {
            child.userData.originalMaterial = child.material;
            
            const wireframeMaterial = new THREE.MeshBasicMaterial({
              color: 0x00ff00,
              wireframe: true,
              transparent: true,
              opacity: wireframeOpacity
            });
            
            child.material = wireframeMaterial;
          } else {
            (child.material as THREE.MeshBasicMaterial).opacity = wireframeOpacity;
          }
        } else if (child.userData.originalMaterial) {
          child.material = child.userData.originalMaterial;
          delete child.userData.originalMaterial;
        }
      }
    });
  }, [renderMode, wireframeOpacity]);
  
  // Handle animations
  useEffect(() => {
    Object.values(actions).forEach(action => action?.stop());
    
    if (isPlaying) {
      selectedAnimations.forEach(animName => {
        if (actions[animName]) {
          const action = actions[animName];
          action.setEffectiveTimeScale(animationSpeed);
          action.play();
        }
      });
    } else {
      selectedAnimations.forEach(animName => {
        if (actions[animName]) {
          actions[animName].paused = true;
        }
      });
    }
    
    return () => {
      Object.values(actions).forEach(action => action?.stop());
    };
  }, [actions, selectedAnimations, isPlaying, animationSpeed]);
  
  useEffect(() => {
    if (!isPlaying) {
      selectedAnimations.forEach(animName => {
        if (actions[animName]) {
          const action = actions[animName];
          const clip = action.getClip();
          const duration = clip.duration;
          const time = (animationProgress / 100) * duration;
          mixer.setTime(time);
        }
      });
    }
  }, [animationProgress, actions, selectedAnimations, isPlaying, mixer]);
  
  useFrame((_, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
  });
  
  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload('/path/to/default-model.glb');