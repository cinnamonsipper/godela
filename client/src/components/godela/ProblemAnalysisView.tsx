import React, { useState, useEffect } from 'react';
import analysisImage from '../../assets/placeholder_analysis_diagram.svg';
import ProgressHeader from './ProgressHeader';
import { motion } from 'framer-motion';

// Delayed Image component that renders after a delay
const DelayedImageRender = () => {
  const [showImage, setShowImage] = useState(false);
  
  useEffect(() => {
    // Set a timer to show the image after 1.5 seconds
    const timer = setTimeout(() => {
      setShowImage(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="relative w-full max-w-[400px]">
      {showImage ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <img src={analysisImage} alt="Problem Analysis Diagram" className="w-full" />
          <div className="absolute top-0 right-0 px-2 py-1 bg-indigo-900/50 text-indigo-300 text-xs rounded">
            AI-Generated Analysis
          </div>
        </motion.div>
      ) : (
        <div className="w-full aspect-[4/3] rounded-lg bg-[#0D1017] border border-[#1A2030] flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="relative w-12 h-12">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
            </div>
            <p className="text-indigo-300 text-sm">Generating analysis diagram...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ProblemAnalysisView() {
  return (
    <div className="flex flex-col h-full p-6 bg-[#10131E]">
      <ProgressHeader title="Problem Analysis" />
      
      <motion.div 
        className="text-sm text-blue-300 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Analyzing request: <span className="text-white font-medium">"Build me a model to simulate how changing the angle of attack and thickness of my airfoil impacts lift & drag"</span>
      </motion.div>
      
      <motion.div 
        className="bg-[#0D1017] rounded-lg p-4 mb-6 border border-[#1A2030] shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="text-lg font-medium text-blue-200 mb-2">Identified Parameters</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-indigo-300 mb-1">Input Parameters:</h4>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Angle of Attack (α)</li>
              <li>Thickness Ratio (t/c)</li>
              <li>Reynolds Number (Re)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-indigo-300 mb-1">Output Parameters:</h4>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Lift Coefficient (CL)</li>
              <li>Drag Coefficient (CD)</li>
            </ul>
          </div>
        </div>
      </motion.div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* This is now a delayed render component */}
        <DelayedImageRender />
        
        <motion.div 
          className="mt-6 text-sm text-gray-400 italic text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
        >
          The machine learning model will learn the relationship between airfoil geometry, 
          flow conditions, and aerodynamic performance.
        </motion.div>
      </div>
    </div>
  );
}