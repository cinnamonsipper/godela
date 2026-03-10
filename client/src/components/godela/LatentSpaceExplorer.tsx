/**
 * Aerodynamic Stability Latent Space Explorer
 * 
 * This advanced component enables rapid exploration of how geometric and control surface 
 * parameters affect aerodynamic performance and stability across the full range of 
 * relevant Angles of Attack (AoA), replacing the need for repeated CFD sweeps for 
 * initial design iterations.
 * 
 * Target User: Aerodynamics engineers primarily interested in:
 * - Lift curves
 * - Drag polars
 * - Pitching moments
 * - Stall characteristics
 * - Stability derivatives
 * 
 * The interface enables exploration of:
 * - Different aircraft geometry configurations 
 * - Performance across the flight envelope
 * - Continuous design space with sparse CFD anchor points
 * - Stability and control effectiveness
 * 
 * The component features a bidirectional integration with the chat interface:
 * - The user can ask questions about designs in the chat
 * - Godela can highlight designs matching specific criteria
 * - The user can directly compare multiple designs
 * - The latent space provides a continuous exploration of the design parameters
 *
 * Example user goal: help me optimize my aircraft design for fuel efficiency
 */

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Info, RefreshCw, Maximize2, Cloud, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import ConsolidatedSTLViewer from './ConsolidatedSTLViewer';
import { getModelPathForDesign } from '@/lib/modelManager';

// Define types for our design points with comprehensive aerodynamic properties
interface DesignPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
  stlFile: string;
  
  // Geometry parameters
  wingspanM: number;     // Wingspan in meters
  aspectRatio: number;   // Aspect ratio
  sweepDeg: number;      // Wing sweep in degrees
  thicknessRatio: number; // Thickness ratio
  
  // Performance metrics
  clMax: number;         // Maximum lift coefficient
  clCd: number;          // Lift-to-drag ratio
  stallAoA: number;      // Stall angle of attack
  
  // Flight conditions
  aoa: number;           // Angle of attack
  mach: number;          // Mach number
  altitude: number;      // Altitude in meters
  
  // Stability derivatives
  cmAlpha: number;       // Pitch stability derivative
  cnBeta: number;        // Yaw stability derivative
  clBeta: number;        // Roll stability derivative
  
  // Control effectiveness
  elevatorEff: number;   // Elevator effectiveness
  aileronEff: number;    // Aileron effectiveness
  rudderEff: number;     // Rudder effectiveness
  
  // Metadata
  stability: number;     // Overall stability metric (0-1)
  isSparseDataPoint?: boolean; // Whether this is a real CFD data point
}

// Chat message type for local state management
interface ChatIntent {
  type: 'select' | 'compare' | 'highlight' | 'recommend' | 'find_extrema' | 'show_reference';
  targetIds?: string[];
  highlightIsSparse?: boolean;
  message?: string;
  criteria?: { [key: string]: any };
}

export default function LatentSpaceExplorer() {
  // State for managing the design points
  const [designPoints, setDesignPoints] = useState<DesignPoint[]>([]);
  const [sparseDataPoints, setSparseDataPoints] = useState<DesignPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<DesignPoint | null>(null);
  const [highlightedPoint, setHighlightedPoint] = useState<string | null>(null);
  const [hoverPoint, setHoverPoint] = useState<DesignPoint | null>(null);
  const [showInitialSetup, setShowInitialSetup] = useState(true);
  
  // Additional state for comparison and chat integration
  const [pinnedDesign, setPinnedDesign] = useState<DesignPoint | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [highlightedPoints, setHighlightedPoints] = useState<string[]>([]);
  const [allDesigns, setAllDesigns] = useState<DesignPoint[]>([]);
  
  // State for the current STL file
  const [currentStlFile, setCurrentStlFile] = useState<string>('/Planes/give_me_30_different__0505210111_generate.stl');
  
  // Refs for the container dimensions
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Generate random design points for demo
  useEffect(() => {
    // Generate some random design points
    const points: DesignPoint[] = [];
    
    // List of STL files
    const stlFiles = [
      'give_me_30_different__0505210111_generate.stl',
      'give_me_30_different__0505210104_generate.stl',
      'give_me_30_different__0505210058_generate.stl',
      'give_me_30_different__0505210052_generate.stl',
      'give_me_30_different__0505210032_generate.stl',
      'give_me_30_different__0505210023_generate.stl',
      'give_me_30_different__0505210016_generate.stl',
      'give_me_30_different__0505210010_generate.stl',
      'give_me_30_different__0505205956_generate.stl',
      'give_me_30_different__0505205934_generate.stl'
    ];

    for (let i = 0; i < 30; i++) {
      // Randomly select an STL file from the list
      const randomIndex = Math.floor(Math.random() * stlFiles.length);
      const stlFile = stlFiles[randomIndex];
      
      // Randomize properties with realistic ranges for aircraft design
      const wingspanM = 20 + Math.random() * 40; // 20-60m wingspan
      const aspectRatio = 6 + Math.random() * 8; // 6-14 aspect ratio
      const sweepDeg = 15 + Math.random() * 25; // 15-40 degrees sweep
      const thicknessRatio = 0.08 + Math.random() * 0.10; // 8-18% thickness
      const clMax = 1.2 + Math.random() * 0.8; // 1.2-2.0 max lift coefficient
      const stallAoA = 12 + Math.random() * 4; // 12-16 degrees stall AoA
      const aoa = Math.random() * 15; // 0-15 degrees AoA
      const mach = 0.6 + Math.random() * 0.3; // Mach 0.6-0.9
      const altitude = 5000 + Math.random() * 10000; // 5000-15000m altitude
      
      // Stability derivatives (realistic ranges for stable aircraft)
      const cmAlpha = -1.5 - Math.random() * 0.5; // -1.5 to -2.0 (negative for stability)
      const cnBeta = 0.05 + Math.random() * 0.15; // 0.05-0.2 (positive for stability)
      const clBeta = -0.1 - Math.random() * 0.1; // -0.1 to -0.2 (negative for stability)
      
      // Control effectiveness (higher is better)
      const elevatorEff = 0.5 + Math.random() * 0.5; // 0.5-1.0
      const aileronEff = 0.4 + Math.random() * 0.4; // 0.4-0.8
      const rudderEff = 0.3 + Math.random() * 0.3; // 0.3-0.6
      
      // Overall performance metrics
      const clCd = 5 + Math.random() * 10; // Lift-to-drag ratio 5-15
      
      // Overall stability rating (derived from stability derivatives)
      const stability = 0.2 + Math.random() * 0.8; // 0.2-1.0 stability rating
      
      points.push({
        id: `design-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        label: String.fromCharCode(65 + Math.floor(i / 5)) + (i % 5 + 1),
        stlFile,
        
        // Geometry parameters
        wingspanM,
        aspectRatio,
        sweepDeg,
        thicknessRatio,
        
        // Performance metrics
        clMax,
        clCd,
        stallAoA,
        
        // Flight conditions
        aoa,
        mach,
        altitude,
        
        // Stability derivatives
        cmAlpha,
        cnBeta,
        clBeta,
        
        // Control effectiveness
        elevatorEff,
        aileronEff,
        rudderEff,
        
        // Metadata
        stability
      });
    }
    setDesignPoints(points);
    
    // Generate sparse data points (these represent actual CFD data points)
    const sparsePoints: DesignPoint[] = [
      {
        id: 'sparse-1',
        x: 25,
        y: 35,
        label: 'CFD-1',
        stlFile: 'give_me_30_different__0505210111_generate.stl',
        
        // Geometry parameters
        wingspanM: 30.5,
        aspectRatio: 9.2,
        sweepDeg: 25.0,
        thicknessRatio: 0.12,
        
        // Performance metrics
        clMax: 1.65,
        clCd: 7.8,
        stallAoA: 14.5,
        
        // Flight conditions
        aoa: 4.5,
        mach: 0.75,
        altitude: 8000,
        
        // Stability derivatives
        cmAlpha: -1.7,
        cnBeta: 0.12,
        clBeta: -0.14,
        
        // Control effectiveness
        elevatorEff: 0.65,
        aileronEff: 0.55,
        rudderEff: 0.42,
        
        // Metadata
        stability: 0.65,
        isSparseDataPoint: true
      },
      {
        id: 'sparse-2',
        x: 75,
        y: 65,
        label: 'CFD-2',
        stlFile: 'give_me_30_different__0505210104_generate.stl',
        
        // Geometry parameters
        wingspanM: 45.2,
        aspectRatio: 10.5,
        sweepDeg: 32.0,
        thicknessRatio: 0.10,
        
        // Performance metrics
        clMax: 1.72,
        clCd: 8.2,
        stallAoA: 13.8,
        
        // Flight conditions
        aoa: 6.0,
        mach: 0.82,
        altitude: 10500,
        
        // Stability derivatives
        cmAlpha: -1.85,
        cnBeta: 0.15,
        clBeta: -0.12,
        
        // Control effectiveness
        elevatorEff: 0.7,
        aileronEff: 0.62,
        rudderEff: 0.45,
        
        // Metadata
        stability: 0.72,
        isSparseDataPoint: true
      },
      {
        id: 'sparse-3',
        x: 30,
        y: 75,
        label: 'CFD-3',
        stlFile: 'give_me_30_different__0505210058_generate.stl',
        
        // Geometry parameters
        wingspanM: 28.8,
        aspectRatio: 8.0,
        sweepDeg: 20.0,
        thicknessRatio: 0.15,
        
        // Performance metrics
        clMax: 1.55,
        clCd: 6.5,
        stallAoA: 15.2,
        
        // Flight conditions
        aoa: 2.5,
        mach: 0.68,
        altitude: 5500,
        
        // Stability derivatives
        cmAlpha: -1.55,
        cnBeta: 0.10,
        clBeta: -0.15,
        
        // Control effectiveness
        elevatorEff: 0.58,
        aileronEff: 0.52,
        rudderEff: 0.38,
        
        // Metadata
        stability: 0.58,
        isSparseDataPoint: true
      },
      {
        id: 'sparse-4',
        x: 70,
        y: 25,
        label: 'CFD-4',
        stlFile: 'give_me_30_different__0505210052_generate.stl',
        
        // Geometry parameters
        wingspanM: 52.0,
        aspectRatio: 12.0,
        sweepDeg: 35.0,
        thicknessRatio: 0.09,
        
        // Performance metrics
        clMax: 1.8,
        clCd: 9.1,
        stallAoA: 13.0,
        
        // Flight conditions
        aoa: 8.0,
        mach: 0.77,
        altitude: 12000,
        
        // Stability derivatives
        cmAlpha: -1.6,
        cnBeta: 0.08,
        clBeta: -0.18,
        
        // Control effectiveness
        elevatorEff: 0.68,
        aileronEff: 0.48,
        rudderEff: 0.40,
        
        // Metadata
        stability: 0.48,
        isSparseDataPoint: true
      },
      {
        id: 'sparse-5',
        x: 50,
        y: 50,
        label: 'CFD-5',
        stlFile: 'give_me_30_different__0505210032_generate.stl',
        
        // Geometry parameters
        wingspanM: 38.5,
        aspectRatio: 9.6,
        sweepDeg: 28.0,
        thicknessRatio: 0.12,
        
        // Performance metrics
        clMax: 1.68,
        clCd: 7.2,
        stallAoA: 14.0,
        
        // Flight conditions
        aoa: 5.0,
        mach: 0.7,
        altitude: 9000,
        
        // Stability derivatives
        cmAlpha: -1.75,
        cnBeta: 0.13,
        clBeta: -0.14,
        
        // Control effectiveness
        elevatorEff: 0.63,
        aileronEff: 0.53,
        rudderEff: 0.4,
        
        // Metadata
        stability: 0.63,
        isSparseDataPoint: true
      }
    ];
    setSparseDataPoints(sparsePoints);
    
    // Combine all designs for easier access
    setAllDesigns([...points, ...sparsePoints]);
  }, []);
  
  // Process a chat command (emulates chat-to-map interaction)
  const processChatIntent = (intent: ChatIntent) => {
    switch (intent.type) {
      case 'select':
        if (intent.targetIds && intent.targetIds.length > 0) {
          const id = intent.targetIds[0];
          const point = allDesigns.find(p => p.id === id);
          if (point) {
            setSelectedPoint(point);
            setHighlightedPoint(point.id);
            setTimeout(() => setHighlightedPoint(null), 2000);
          }
        }
        break;
        
      case 'compare':
        if (intent.targetIds && intent.targetIds.length >= 2) {
          const targetIds = [...intent.targetIds];
          const id1 = targetIds[0];
          const id2 = targetIds[1];
          
          const point1 = allDesigns.find(p => p.id === id1);
          const point2 = allDesigns.find(p => p.id === id2);
          
          if (point1 && point2) {
            setSelectedPoint(point1);
            setPinnedDesign(point2);
            setCompareMode(true);
            setHighlightedPoints([point1.id, point2.id]);
            setTimeout(() => setHighlightedPoints([]), 2000);
          }
        }
        break;
        
      case 'highlight':
        if (intent.targetIds && intent.targetIds.length > 0) {
          const highlightIds = [...intent.targetIds];
          setHighlightedPoints(highlightIds);
          setTimeout(() => setHighlightedPoints([]), 3000);
        }
        break;
        
      case 'recommend':
        // Filter designs based on criteria
        if (intent.criteria) {
          const filteredDesigns = allDesigns.filter(design => {
            for (const [key, value] of Object.entries(intent.criteria || {})) {
              // Simple string equality, can be expanded for more complex matching
              if (design[key as keyof DesignPoint] !== value) {
                return false;
              }
            }
            return true;
          });
          
          if (filteredDesigns.length > 0) {
            setHighlightedPoints(filteredDesigns.map(d => d.id));
            setTimeout(() => setHighlightedPoints([]), 3000);
          }
        }
        break;
        
      case 'find_extrema':
        // Find designs with lowest wingspan (mass efficient)
        const sortedByMassEfficiency = [...allDesigns].sort((a, b) => a.wingspanM - b.wingspanM);
        if (sortedByMassEfficiency.length > 0) {
          const topMassEfficient = sortedByMassEfficiency.slice(0, 5);
          setHighlightedPoints(topMassEfficient.map(d => d.id));
          setTimeout(() => setHighlightedPoints([]), 3000);
        }
        break;
        
      case 'show_reference':
        // Highlight all sparse CFD points
        const sparseIds = sparseDataPoints.map(p => p.id);
        setHighlightedPoints(sparseIds);
        setTimeout(() => setHighlightedPoints([]), 3000);
        break;
    }
  };
  
  // Handle point click
  const handlePointClick = (point: DesignPoint) => {
    // If in compare mode and we already have a selected point,
    // clicking a new point either replaces the comparison or primary point
    if (compareMode && selectedPoint) {
      if (point.id === selectedPoint.id) {
        // Clicking already selected point toggles compare mode off
        setCompareMode(false);
        setPinnedDesign(null);
      } else if (point.id === pinnedDesign?.id) {
        // Clicking pinned design makes it the primary and primary becomes pinned
        setPinnedDesign(selectedPoint);
        setSelectedPoint(point);
        setCurrentStlFile(`/Planes/${point.stlFile}`); // Update STL file with correct path
      } else {
        // Clicking a new point replaces the pinned design
        setPinnedDesign(point);
      }
    } else {
      // Normal selection mode
      setSelectedPoint(point);
      setHighlightedPoint(point.id);
      setCurrentStlFile(`/Planes/${point.stlFile}`); // Update STL file with correct path
      
      // After a while, remove the highlight
      setTimeout(() => {
        setHighlightedPoint(null);
      }, 2000);
    }
  };
  
  // Handle mouse over point
  const handlePointHover = (point: DesignPoint) => {
    setHoverPoint(point);
  };
  
  // Handle mouse leave point
  const handlePointLeave = () => {
    setHoverPoint(null);
  };
  
  // Start exploration (dismiss initial setup screen)
  const startExploration = () => {
    setShowInitialSetup(false);
  };
  
  // Helper to get colors based on lift/drag ratio
  const getPerformanceColor = (clCd: number) => {
    if (clCd > 10) return 'rgb(52, 211, 153)'; // Green for high performance
    if (clCd > 7) return 'rgb(249, 168, 212)'; // Pink for medium
    return 'rgb(252, 165, 165)'; // Red for lower performance
  };
  
  // Toggle comparison mode
  const toggleCompareMode = () => {
    if (compareMode) {
      // Turn off compare mode
      setCompareMode(false);
      setPinnedDesign(null);
    } else if (selectedPoint) {
      // Turn on compare mode with currently selected point as reference
      setCompareMode(true);
      setPinnedDesign(selectedPoint);
    }
  };
  
  // Helper function to determine point class names
  const getPointClassNames = (point: DesignPoint) => {
    const classes = [
      point.isSparseDataPoint ? 'sparse-data-point' : 'design-point',
      selectedPoint?.id === point.id ? 'selected' : '',
      pinnedDesign?.id === point.id ? 'pinned' : '',
      highlightedPoint === point.id ? 'highlighted' : '',
      highlightedPoints.includes(point.id) ? 'highlighted' : '',
      compareMode && pinnedDesign?.id === point.id ? 'compare' : ''
    ];
    
    return classes.filter(Boolean).join(' ');
  };
  
  // Render the design points
  const renderDesignPoints = () => {
    return designPoints.map((point) => (
      <motion.div
        key={point.id}
        className={getPointClassNames(point)}
        style={{
          left: `${point.x}%`,
          top: `${point.y}%`,
          backgroundColor: getPerformanceColor(point.clCd),
          // If this is the pinned point in compare mode, add a ring
          boxShadow: compareMode && pinnedDesign?.id === point.id 
            ? '0 0 0 2px rgba(99, 102, 241, 0.6), 0 0 0 4px rgba(255, 255, 255, 0.2)' 
            : undefined,
          zIndex: highlightedPoints.includes(point.id) || selectedPoint?.id === point.id || pinnedDesign?.id === point.id 
            ? 10 
            : 1
        }}
        onClick={() => handlePointClick(point)}
        onMouseEnter={() => handlePointHover(point)}
        onMouseLeave={handlePointLeave}
        whileHover={{ scale: 1.5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: compareMode && pinnedDesign?.id === point.id ? 1.2 : 1,
          boxShadow: compareMode && pinnedDesign?.id === point.id 
            ? ['0 0 0 2px rgba(99, 102, 241, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.1)', 
               '0 0 0 3px rgba(99, 102, 241, 0.6), 0 0 0 6px rgba(255, 255, 255, 0.2)',
               '0 0 0 2px rgba(99, 102, 241, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.1)'] 
            : undefined
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 20, 
          delay: Math.random() * 0.5,
          boxShadow: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }
        }}
      >
        {point.label?.charAt(0)}
      </motion.div>
    ));
  };
  
  // Render the sparse data points (CFD reference points)
  const renderSparseDataPoints = () => {
    return sparseDataPoints.map((point) => (
      <motion.div
        key={point.id}
        className={getPointClassNames(point)}
        style={{
          left: `${point.x}%`,
          top: `${point.y}%`,
          // If this is the pinned point in compare mode, add a ring
          boxShadow: compareMode && pinnedDesign?.id === point.id 
            ? '0 0 0 2px rgba(249, 115, 22, 0.6), 0 0 0 4px rgba(255, 255, 255, 0.2)' 
            : undefined,
          zIndex: highlightedPoints.includes(point.id) || selectedPoint?.id === point.id || pinnedDesign?.id === point.id 
            ? 10 
            : 1
        }}
        onClick={() => handlePointClick(point)}
        onMouseEnter={() => handlePointHover(point)}
        onMouseLeave={handlePointLeave}
        whileHover={{ scale: 1.3, rotate: 45 }}
        whileTap={{ scale: 0.9, rotate: 45 }}
        initial={{ opacity: 0, scale: 0, rotate: 45 }}
        animate={{ 
          opacity: 1, 
          scale: compareMode && pinnedDesign?.id === point.id ? 1.2 : 1, 
          rotate: 45,
          boxShadow: compareMode && pinnedDesign?.id === point.id 
            ? ['0 0 0 2px rgba(249, 115, 22, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.1)', 
               '0 0 0 3px rgba(249, 115, 22, 0.6), 0 0 0 6px rgba(255, 255, 255, 0.2)',
               '0 0 0 2px rgba(249, 115, 22, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.1)'] 
            : undefined
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 20, 
          delay: 0.5 + Math.random() * 0.5,
          boxShadow: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }
        }}
      />
    ));
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col flex-grow">
        {/* Initial setup modal */}
        {showInitialSetup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/90 backdrop-blur-md p-6 rounded-xl border border-slate-600/50 shadow-xl text-center max-w-md"
            >
              <div className="w-16 h-16 bg-indigo-900/60 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Cloud size={32} className="text-indigo-300" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">Building Design Space Model</h2>
              <p className="text-slate-300 mb-6 text-sm">
                Using uploaded aircraft CAD geometry and sparse CFD results to help you optimize your aircraft design for fuel efficiency.
              </p>
              <div className="mb-6 flex justify-center">
                <div className="w-full max-w-xs bg-slate-900/50 rounded-full h-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                    className="h-full bg-indigo-500 rounded-full"
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startExploration}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg text-white font-medium shadow-lg shadow-indigo-900/30"
              >
                <div className="flex items-center">
                  <span>Start Exploration</span>
                  <ChevronRight size={18} className="ml-2" />
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      
        {/* Main layout */}
        <div className="flex h-full gap-4">
          {/* Left column - Latent Space Map (square) */}
          <div className="w-[300px] flex-shrink-0 bg-slate-800/30 rounded-lg border border-slate-700/50 p-4 flex flex-col">
            <h3 className="text-base font-semibold text-slate-200 mb-3 pb-2 border-b border-slate-700/80">Design Space Map</h3>
            
            <div 
              ref={mapContainerRef}
              className="relative aspect-square rounded-md border border-slate-700/50 overflow-hidden"
              style={{
                background: `
                  radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.6), rgba(15, 23, 42, 0) 70%),
                  radial-gradient(circle at 20% 80%, rgba(79, 70, 229, 0.5), rgba(15, 23, 42, 0) 70%),
                  radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3), rgba(15, 23, 42, 0) 50%),
                  linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(15, 23, 42, 0) 50%),
                  linear-gradient(225deg, rgba(79, 70, 229, 0.2) 0%, rgba(15, 23, 42, 0) 50%),
                  linear-gradient(180deg, #1e293b 0%, #0f172a 100%)
                `
              }}
            >
              {/* Render design points */}
              {renderDesignPoints()}
              
              {/* Render sparse data points */}
              {renderSparseDataPoints()}
              
              {/* Hover preview panel */}
              {hoverPoint && (
                <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm border border-slate-700/80 rounded-md p-2 text-xs text-slate-300 max-w-[220px]">
                  <div className="font-semibold mb-1 pb-1 border-b border-slate-700/80 flex justify-between">
                    <span>{hoverPoint.label || `Point ${hoverPoint.id}`}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${hoverPoint.isSparseDataPoint ? 'bg-amber-900/50 text-amber-300 border border-amber-700/50' : 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50'}`}>
                      {hoverPoint.isSparseDataPoint ? 'CFD Data' : 'ML Model'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div className="flex justify-between col-span-2">
                      <span className="text-slate-400">CL/CD:</span>
                      <span className="font-mono">{hoverPoint.clCd.toFixed(1)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">AoA:</span>
                      <span className="font-mono">{hoverPoint.aoa.toFixed(1)}°</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mach:</span>
                      <span className="font-mono">{hoverPoint.mach.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Stab:</span>
                      <span className="font-mono">{(hoverPoint.stability * 100).toFixed(0)}%</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cmα:</span>
                      <span className="font-mono">{hoverPoint.cmAlpha.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between col-span-2 pt-1 mt-1 border-t border-slate-700/50">
                      <span className="text-slate-400">Wingspan:</span>
                      <span className="font-mono">{hoverPoint.wingspanM.toFixed(1)}m</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">AR:</span>
                      <span className="font-mono">{hoverPoint.aspectRatio.toFixed(1)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sweep:</span>
                      <span className="font-mono">{hoverPoint.sweepDeg.toFixed(1)}°</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Middle column - STL Viewer (square) */}
          <div className="flex-grow bg-slate-800/30 rounded-lg border border-slate-700/50 p-4 flex flex-col">
            <h3 className="text-base font-semibold text-slate-200 mb-3 pb-2 border-b border-slate-700/80">3D Model Viewer</h3>
            <div className="flex-grow relative">
              {selectedPoint ? (
                <div className="w-full aspect-square bg-slate-900/50 rounded border border-slate-800 overflow-hidden">
                  <ConsolidatedSTLViewer 
                    className="w-full h-full"
                    modelPath={currentStlFile}
                  />
                </div>
              ) : (
                <div className="w-full aspect-square flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-3">
                      <Info size={20} className="text-slate-500" />
                    </div>
                    <p className="text-sm">Select a design point to view the 3D model</p>
                  </div>
                </div>
              )}
            </div>
            {/* Key Parameters below the model viewer */}
            {selectedPoint && (
              <div className="mt-4">
                <div className="bg-slate-800/50 rounded-md border border-slate-700/50 p-3">
                  <h4 className="font-medium text-slate-200 mb-3 pb-1 border-b border-slate-700/50 flex justify-between">
                    <span>Key Parameters</span>
                    {compareMode && pinnedDesign && (
                      <span className="text-xs text-purple-300">Comparing with {pinnedDesign.label}</span>
                    )}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column: Geometry Parameters */}
                    <div>
                      <h5 className="text-xs text-slate-300 mb-2">Geometry</h5>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Wingspan:</span>
                          <span className="text-slate-200 font-mono">{selectedPoint.wingspanM.toFixed(1)} m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Aspect Ratio:</span>
                          <span className="text-slate-200 font-mono">{selectedPoint.aspectRatio.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Sweep Angle:</span>
                          <span className="text-slate-200 font-mono">{selectedPoint.sweepDeg.toFixed(1)}°</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Thickness:</span>
                          <span className="text-slate-200 font-mono">{(selectedPoint.thicknessRatio * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    {/* Right Column: Performance Metrics */}
                    <div>
                      <h5 className="text-xs text-slate-300 mb-2">Performance</h5>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">CL/CD:</span>
                          <span className="text-slate-200 font-mono">{selectedPoint.clCd.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Max CL:</span>
                          <span className="text-slate-200 font-mono">{selectedPoint.clMax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Stall AoA:</span>
                          <span className="text-slate-200 font-mono">{selectedPoint.stallAoA.toFixed(1)}°</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Mach:</span>
                          <span className="text-slate-200 font-mono">{selectedPoint.mach.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right column - Selected Design Analysis */}
          <div className="w-[350px] flex-shrink-0 bg-slate-800/30 rounded-lg border border-slate-700/50 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-700/80">
              <h3 className="text-base font-semibold text-slate-200">Selected Design Analysis</h3>
              
              {selectedPoint && (
                <motion.button
                  onClick={toggleCompareMode}
                  className={`px-2 py-1 rounded text-xs flex items-center ${compareMode 
                    ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50 hover:bg-purple-800/50' 
                    : 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 hover:bg-indigo-800/50'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {compareMode ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      End Compare
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Compare
                    </>
                  )}
                </motion.button>
              )}
            </div>
            
            {selectedPoint ? (
              <div className="space-y-4 overflow-y-auto pr-1 max-h-[calc(100%-44px)]">
                {/* Design identification and flight conditions */}
                <div className="bg-slate-800/50 rounded-md border border-slate-700/50 overflow-hidden">
                  <div className="flex justify-between items-center p-3 border-b border-slate-700/50">
                    <div>
                      <h4 className="font-medium text-slate-200 flex items-center">
                        Design {selectedPoint.label}
                        {compareMode && pinnedDesign && (
                          <span className="ml-2 text-xs bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded-sm border border-purple-700/50">
                            vs {pinnedDesign.label}
                          </span>
                        )}
                      </h4>
                      <div className="text-xs text-slate-400 mt-0.5">Flight envelope analysis</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${selectedPoint.isSparseDataPoint ? 'bg-amber-900/50 text-amber-300 border border-amber-700/50' : 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50'}`}>
                      {selectedPoint.isSparseDataPoint ? 'CFD Data Point' : 'ML-Predicted Design'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 p-3 gap-2">
                    <div className="bg-slate-900/70 border border-slate-800 rounded p-2 text-center relative group">
                      <span className="text-[10px] text-slate-400 block">Angle of Attack</span>
                      <span className="text-xl font-semibold text-white">{selectedPoint.aoa.toFixed(1)}°</span>
                      
                      {compareMode && pinnedDesign && (
                        <div className="absolute top-1 right-1">
                          <span className={`text-[10px] font-mono rounded px-1 py-0.5 
                            ${Math.abs(selectedPoint.aoa - pinnedDesign.aoa) < 0.1 ? 'bg-slate-800/80 text-slate-400' : 
                            selectedPoint.aoa > pinnedDesign.aoa ? 'bg-green-900/60 text-green-300' : 'bg-red-900/60 text-red-300'}`}>
                            {selectedPoint.aoa > pinnedDesign.aoa ? '+' : ''}
                            {(selectedPoint.aoa - pinnedDesign.aoa).toFixed(1)}°
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="bg-slate-900/70 border border-slate-800 rounded p-2 text-center relative">
                      <span className="text-[10px] text-slate-400 block">Mach Number</span>
                      <span className="text-xl font-semibold text-white">{selectedPoint.mach.toFixed(2)}</span>
                      
                      {compareMode && pinnedDesign && (
                        <div className="absolute top-1 right-1">
                          <span className={`text-[10px] font-mono rounded px-1 py-0.5 
                            ${Math.abs(selectedPoint.mach - pinnedDesign.mach) < 0.01 ? 'bg-slate-800/80 text-slate-400' : 
                            selectedPoint.mach > pinnedDesign.mach ? 'bg-green-900/60 text-green-300' : 'bg-red-900/60 text-red-300'}`}>
                            {selectedPoint.mach > pinnedDesign.mach ? '+' : ''}
                            {(selectedPoint.mach - pinnedDesign.mach).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="bg-slate-900/70 border border-slate-800 rounded p-2 text-center relative">
                      <span className="text-[10px] text-slate-400 block">Altitude</span>
                      <span className="text-xl font-semibold text-white">{(selectedPoint.altitude/1000).toFixed(1)}k</span>
                      
                      {compareMode && pinnedDesign && (
                        <div className="absolute top-1 right-1">
                          <span className={`text-[10px] font-mono rounded px-1 py-0.5 
                            ${Math.abs(selectedPoint.altitude - pinnedDesign.altitude) < 100 ? 'bg-slate-800/80 text-slate-400' : 
                            selectedPoint.altitude > pinnedDesign.altitude ? 'bg-green-900/60 text-green-300' : 'bg-red-900/60 text-red-300'}`}>
                            {selectedPoint.altitude > pinnedDesign.altitude ? '+' : ''}
                            {((selectedPoint.altitude - pinnedDesign.altitude)/1000).toFixed(1)}k
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Simplified stability characteristics */}
                <div className="bg-slate-800/50 rounded-md border border-slate-700/50 p-3">
                  <h4 className="font-medium text-slate-200 mb-3 pb-1 border-b border-slate-700/50">
                    <span>Stability Rating</span>
                  </h4>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex-1 mr-4">
                      <div className="w-full bg-slate-800 rounded-full h-2.5 relative">
                        <div 
                          className={`h-full rounded-full ${
                            selectedPoint.stability > 0.7 ? 'bg-green-500' : 
                            selectedPoint.stability > 0.5 ? 'bg-blue-500' : 
                            selectedPoint.stability > 0.3 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${selectedPoint.stability * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-semibold text-white">{(selectedPoint.stability * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/70 border border-slate-800 rounded p-2 text-center">
                      <div className="text-[10px] text-slate-400 mb-1">Pitch Stability</div>
                      <div className={`text-lg font-semibold ${selectedPoint.cmAlpha < -1.2 ? 'text-green-400' : selectedPoint.cmAlpha > -0.8 ? 'text-red-400' : 'text-yellow-400'}`}>
                        {selectedPoint.cmAlpha.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-slate-900/70 border border-slate-800 rounded p-2 text-center">
                      <div className="text-[10px] text-slate-400 mb-1">Yaw Stability</div>
                      <div className={`text-lg font-semibold ${selectedPoint.cnBeta > 0.1 ? 'text-green-400' : selectedPoint.cnBeta < 0.05 ? 'text-red-400' : 'text-yellow-400'}`}>
                        {selectedPoint.cnBeta.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md py-2 text-sm font-medium transition-colors border border-slate-700">
                    Save Design
                  </button>
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 text-sm font-medium transition-colors">
                    Run Full CFD Analysis
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-4 text-slate-400">
                <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mb-3">
                  <Info size={20} className="text-slate-500" />
                </div>
                <p className="text-sm mb-2">Click a design point to view details</p>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-300 mr-1.5"></div>
                    <span className="text-xs">Design point</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 border border-amber-400 bg-amber-500/20 rounded-sm transform rotate-45 mr-1.5"></div>
                    <span className="text-xs">CFD data</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}