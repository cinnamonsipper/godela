import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';

interface AppContextType {
  modelUrl: string;
  model: File | null;
  hasModel: boolean;
  isPlaying: boolean;
  showGrid: boolean;
  showAxes: boolean;
  renderMode: string;
  wireframeOpacity: number;
  wireframeColor: string;
  edgeHighlight: boolean;
  faceOpacity: number;
  animationProgress: number;
  animations: THREE.AnimationClip[];
  currentAnimation: string;
  animationSpeed: number;
  selectedAnimations: string[];
  uploadFile: (file: File) => void;
  togglePlayback: () => void;
  resetAnimation: () => void;
  setShowGrid: (show: boolean) => void;
  setShowAxes: (show: boolean) => void;
  setRenderMode: (mode: string) => void;
  setWireframeOpacity: (opacity: number) => void;
  setWireframeColor: (color: string) => void;
  setEdgeHighlight: (highlight: boolean) => void;
  setFaceOpacity: (opacity: number) => void;
  setAnimationProgress: (progress: number) => void;
  setAnimations: (animations: THREE.AnimationClip[]) => void;
  setCurrentAnimation: (animation: string) => void;
  setAnimationSpeed: (speed: number) => void;
  toggleAnimationSelection: (animation: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modelUrl, setModelUrl] = useState<string>('');
  const [model, setModel] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showAxes, setShowAxes] = useState<boolean>(false);
  const [renderMode, setRenderMode] = useState<string>('wireframe');
  const [wireframeOpacity, setWireframeOpacity] = useState<number>(0.1);
  const [wireframeColor, setWireframeColor] = useState<string>('#00ff00');
  const [edgeHighlight, setEdgeHighlight] = useState<boolean>(true);
  const [faceOpacity, setFaceOpacity] = useState<number>(0.1);
  const [animationProgress, setAnimationProgress] = useState<number>(0);
  const [animations, setAnimations] = useState<THREE.AnimationClip[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState<string>('');
  const [animationSpeed, setAnimationSpeed] = useState<number>(0.2);
  const [selectedAnimations, setSelectedAnimations] = useState<string[]>([]);
  
  const uploadFile = useCallback((file: File) => {
    if (modelUrl) {
      URL.revokeObjectURL(modelUrl);
    }
    
    const url = URL.createObjectURL(file);
    setModelUrl(url);
    setModel(file);
    setIsPlaying(false);
    setAnimationProgress(0);
    setAnimations([]);
    setCurrentAnimation('');
    setSelectedAnimations([]);
  }, [modelUrl]);
  
  // Expose uploadFile function globally for iframe parent communication
  useEffect(() => {
    // Create a function that accepts a file and URL from postMessage
    (window as any).uploadModelFile = (file: File, url: string) => {
      setModelUrl(url);
      setModel(file);
      setIsPlaying(false);
      setAnimationProgress(0);
      setAnimations([]);
      setCurrentAnimation('');
      setSelectedAnimations([]);
    };
    
    return () => {
      // Clean up
      delete (window as any).uploadModelFile;
    };
  }, []);
  
  useEffect(() => {
    return () => {
      if (modelUrl) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [modelUrl]);

  useEffect(() => {
    if (animations.length > 0) {
      setSelectedAnimations(animations.map(anim => anim.name));
    }
  }, [animations]);
  
  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  const resetAnimation = useCallback(() => {
    setAnimationProgress(0);
    setIsPlaying(false);
  }, []);
  
  const toggleAnimationSelection = useCallback((animation: string) => {
    setSelectedAnimations(prev => {
      if (prev.includes(animation)) {
        return prev.filter(a => a !== animation);
      } else {
        return [...prev, animation];
      }
    });
  }, []);
  
  return (
    <AppContext.Provider
      value={{
        modelUrl,
        model,
        hasModel: !!modelUrl,
        isPlaying,
        showGrid,
        showAxes,
        renderMode,
        wireframeOpacity,
        wireframeColor,
        edgeHighlight,
        faceOpacity,
        animationProgress,
        animations,
        currentAnimation,
        animationSpeed,
        selectedAnimations,
        uploadFile,
        togglePlayback,
        resetAnimation,
        setShowGrid,
        setShowAxes,
        setRenderMode,
        setWireframeOpacity,
        setWireframeColor,
        setEdgeHighlight,
        setFaceOpacity,
        setAnimationProgress,
        setAnimations,
        setCurrentAnimation,
        setAnimationSpeed,
        toggleAnimationSelection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};