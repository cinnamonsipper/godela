/**
 * Welcome View Component
 * 
 * This component serves as the initial landing page of the Godela application.
 * It provides users with:
 * 1. A text input to describe their simulation needs
 * 2. Quick-access buttons for demo paths covering different engineering domains
 * 3. Introduction to Godela's capabilities and workflow
 * 
 * The component is critical for demo path selection, allowing users to choose 
 * between the airfoil simulation, heat exchanger optimization, or other engineering
 * problems. Each path maintains the same UI patterns but provides domain-specific content.
 */

import React, { useState } from 'react';
import useDemoStore, { DemoPath } from '@/store/useDemoStore';
import { ArrowRight, ChevronRight, Upload, Play, Search, Zap, Code, UserPlus, PackageOpen, Box, Boxes, PenTool, Sliders, Settings } from 'lucide-react';
import { Link } from 'wouter';
import godelaLogoSolo from '../../assets/godela-logo-new.png';
import { motion } from 'framer-motion';

export default function WelcomeView() {
  // Access Zustand store actions for demo management
  const { nextDemoStep, setDemoPath, setMultiProductMode } = useDemoStore();
  
  // Default input text for the simulation query field - now using packaging prompt as default
  const [inputValue, setInputValue] = useState('Design a package for my product');
  
  const examples = [
    "Build me a model to simulate how changing the angle of attack and thickness of my airfoil impacts lift & drag",
    "Help me optimize the design of my aircraft for fuel efficiency",
    "Help me simulate airflow over this car design",
    "Help me design protective packaging for my product",
    "Design a package for my product",
    "Ship two of my products in a box",
    "View and analyze my 3D models",
    "Sandbox Demo - Experiment with chat interface",
    "Aircraft Latent Explorer - Optimize aircraft design",
    "V2 Latent Space Explorer - Enhanced aircraft optimization",
    "Cosmology Demo - Explore astrophysical models",
    "Amazon Demo",
    "Dell Demo",
    "APS Demo - Advanced analysis platform",
    "Simulate beam stress under load",
    "What if I change this parameter?"
  ];
  
  // Map examples to their corresponding demo paths
  const exampleToDemoPath: Record<number, DemoPath> = {
    0: 'airfoil',
    1: 'aircraft-aerodynamics',
    2: 'car-aerodynamics',
    3: 'packaging-design',
    4: 'phone-packaging',
    5: 'phone-packaging', // Multi-product packaging uses same path but with different mode
    6: 'model-viewer', // 3D Model Viewer path
    7: 'sandbox', // Sandbox Demo path for experimenting with the chat interface
    8: 'latent-explorer', // Latent Explorer Demo path with immersive UI
    9: 'latent-explorer-v2', // V2 Latent Explorer Demo path with enhanced features
    10: 'cosmology', // Cosmology Demo path for astrophysical models
    11: 'amazon', // Amazon Demo path for logistics optimization
    12: 'dell', // Dell Demo path for logistics optimization
    13: 'aps' // APS Demo path for advanced analysis
    // Other examples would need their own demo paths if implemented
  };
  
  /**
   * Initiates a specific demo path
   * 
   * This is the key function that starts one of the different demo paths
   * based on the user's selection from the "Try these use cases" buttons.
   * 
   * @param demoPath - The demo path to activate ('airfoil' or 'aircraft-aerodynamics')
   * @param exampleText - The text to show in the input field
   */
  const startDemoWithPath = (demoPath: DemoPath, exampleText: string) => {
    // Update the input field with the selected example text
    setInputValue(exampleText);
    // Set the active demo path in the store
    setDemoPath(demoPath);
    // Advance to the first step of the selected demo path
    nextDemoStep();
  };
  
  const handleExampleClick = (example: string, index: number) => {
    console.log(`Example clicked: ${example}, index: ${index}`);
    
    // Set the input value to show the selected example
    setInputValue(example);
    
    // If this example has a corresponding demo path, start that demo
    if (index === 0 || index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6 || index === 7 || index === 8 || index === 9 || index === 10 || index === 11 || index === 12 || index === 13) {
      console.log(`Starting demo path: ${exampleToDemoPath[index]}`);
      
      // For index 5, enable multi-product mode
      if (index === 5) {
        setMultiProductMode(true);
      } else {
        // Reset to single product mode for other options
        setMultiProductMode(false);
      }
      
      startDemoWithPath(exampleToDemoPath[index], example);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim()) {
      // Check if the input contains packaging-related keywords
      const lowerInput = inputValue.toLowerCase();
      
      // Check for multi-product related keywords
      const isMultiProduct = lowerInput.includes('multiple') || 
                          lowerInput.includes('multi') || 
                          lowerInput.includes('two') || 
                          (lowerInput.includes('products') && lowerInput.includes('box'));
      
      if (isMultiProduct) {
        // Enable multi-product mode and start phone packaging demo
        console.log('Multi-product packaging detected, starting multi-product packaging demo');
        setMultiProductMode(true);
        setDemoPath('phone-packaging');
        nextDemoStep();
      } else if (lowerInput.includes('package') || lowerInput.includes('packaging')) {
        // Start the single product packaging demo
        console.log('Packaging keyword detected, starting packaging demo');
        setMultiProductMode(false);
        setDemoPath('phone-packaging');
        nextDemoStep();
      } else if (lowerInput.includes('amazon') || lowerInput.includes('warehouse') || lowerInput.includes('logistics') || lowerInput.includes('fulfillment') || lowerInput.includes('delivery') || lowerInput.includes('supply chain')) {
        // Start the Amazon logistics demo
        console.log('Amazon/logistics keywords detected, starting Amazon demo');
        setMultiProductMode(false);
        setDemoPath('amazon');
        nextDemoStep();
      } else {
        // Default to airfoil demo when submitting text without packaging keywords
        setMultiProductMode(false);
        setDemoPath('airfoil');
        nextDemoStep();
      }
    }
  };
  
  const handleLaunchDemo = () => {
    // Use the airfoil demo by default for the launch button
    const airfoilExample = "Build me a model to simulate how changing the angle of attack and thickness of my airfoil impacts lift & drag";
    startDemoWithPath('airfoil', airfoilExample);
  };
  
  return (
    <div className="flex flex-col h-full bg-black overflow-y-auto grid-glow cyber-grid-with-vignette">
      {/* Hero section with split layout */}
      <div className="flex flex-col lg:flex-row min-h-[580px] relative overflow-hidden">
        {/* Background decorative elements with premium depth */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Ambient light sources */}
          <div className="absolute top-10 right-10 w-96 h-96 bg-gray-400/5 blur-3xl rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-gray-400/5 blur-3xl rounded-full"></div>
          
          {/* 3D plane effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-transparent to-gray-900/40"></div>
          
          {/* Floating particles */}
          <div className="absolute top-[20%] left-[25%] w-1 h-1 bg-white/40 rounded-full shadow-lg shadow-white/20 animate-pulse"></div>
          <div className="absolute top-[40%] left-[65%] w-1.5 h-1.5 bg-white/30 rounded-full shadow-lg shadow-white/20 animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-[70%] left-[35%] w-1 h-1 bg-white/40 rounded-full shadow-lg shadow-white/20 animate-pulse" style={{animationDelay: '0.8s'}}></div>
          <div className="absolute top-[30%] left-[85%] w-2 h-2 bg-white/20 rounded-full shadow-lg shadow-white/20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Left column - Hero content */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="mb-6 transform hover:scale-105 transition-all duration-500">
              <img src={godelaLogoSolo} alt="Godela" className="h-20 w-auto" />
            </div>
            
            {/* Main Headline with 3D depth effect */}
            <div className="perspective-800 mb-6">
              <h1 className="text-4xl md:text-6xl font-extralight text-white leading-tight drop-shadow-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', textShadow: '0 4px 8px rgba(0,0,0,0.4)' }}>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-300 inline-block transform hover:scale-[1.02] transition-transform duration-700">
                  AI Physics Engine
                </span>
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gray-500/30 to-transparent mt-4 rounded-full"></div>
            </div>
            
            {/* Secondary headline */}
            <h2 className="text-lg md:text-xl font-light text-gray-400 max-w-2xl leading-relaxed mb-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Solve engineering problems faster with instant simulations built by AI that understands real-world physics
            </h2>
            
            {/* Buttons with premium 3D effect */}
            <div className="flex flex-wrap gap-4 mb-8 perspective-800">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLaunchDemo}
                className="px-8 py-4 glass premium-glow rounded-lg text-white font-medium transition-all duration-300 border border-white/10"
              >
                <div className="flex items-center">
                  <Zap size={18} className="mr-2" />
                  <span>Launch Demo</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 glass premium-glow rounded-lg text-gray-300 font-medium hover:bg-black/60 transition-all duration-300 border border-white/10"
              >
                <div className="flex items-center">
                  <Code size={18} className="mr-2" />
                  <span>Documentation</span>
                </div>
              </motion.button>
            </div>
            
            {/* Benefits */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <div className="mr-2 rounded-full bg-blue-500/20 w-5 h-5 flex items-center justify-center">
                  <span className="text-blue-400 text-xs">✓</span>
                </div>
                <span>10-1000x faster than traditional simulation</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <div className="mr-2 rounded-full bg-blue-500/20 w-5 h-5 flex items-center justify-center">
                  <span className="text-blue-400 text-xs">✓</span>
                </div>
                <span>Respects underlying physics principles</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <div className="mr-2 rounded-full bg-blue-500/20 w-5 h-5 flex items-center justify-center">
                  <span className="text-blue-400 text-xs">✓</span>
                </div>
                <span>No coding or ML expertise required</span>
              </div>
            </div>
            

          </motion.div>
        </div>
        
        {/* Right column - Interactive module */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-lg"
          >
            {/* Interactive module */}
            <div className="glass rounded-xl shadow-2xl overflow-hidden premium-glow cyber-grid">
              {/* Module header */}
              <div className="bg-black/60 backdrop-blur-md p-4 border-b border-gray-700/40 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-black/60 border border-gray-700/40 flex items-center justify-center text-gray-300 mr-3 flex-shrink-0 shadow-sm premium-glow">
                    <Zap size={16} />
                  </div>
                  <h3 className="font-medium text-white">Godela</h3>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-700/60"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-700/60"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-700/60"></div>
                </div>
              </div>
              
              {/* Module content */}
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex flex-col items-start">
                    <p className="text-sm text-gray-400 mb-2">Tell me what you want to simulate:</p>
                    <form onSubmit={handleSubmit} className="w-full relative mb-6">
                      <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Describe your simulation requirements..."
                        className="w-full bg-black/40 backdrop-blur-sm border border-gray-800/30 rounded-lg p-4 pr-14 text-white resize-none focus:outline-none focus:ring-1 focus:ring-gray-700/50 min-h-[100px] leading-relaxed text-sm"
                        rows={3}
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute right-3 bottom-3 glass premium-glow text-gray-300 p-3 rounded-md transition-all duration-200 flex items-center justify-center w-12 h-12"
                      >
                        <ArrowRight size={20} />
                      </motion.button>
                    </form>
                  </div>
                </div>
                
                {/* Use cases section */}
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-3">Try these use cases:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {/* Airfoil Demo Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          startDemoWithPath('airfoil', examples[0]);
                        }}
                        className="block w-full glass premium-glow hover:bg-black/60 rounded-md p-3 text-left text-sm text-gray-300 transition-all duration-200 flex items-center group shadow-md hover:shadow-lg"
                      >
                        <div className="mr-3 w-10 h-10 bg-black/60 border border-gray-700/40 rounded-md flex items-center justify-center text-gray-300 transform group-hover:scale-110 transition-all premium-glow">
                          <Play size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-white transition-colors font-medium">
                            {examples[0]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      </a>
                    </motion.div>
                    
                    {/* Aircraft Aerodynamics Demo Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          startDemoWithPath('aircraft-aerodynamics', examples[1]);
                        }}
                        className="block w-full bg-gradient-to-r from-indigo-900/40 to-purple-900/40 hover:from-indigo-800/50 hover:to-purple-800/50 border border-indigo-500/30 rounded-md p-3 text-left text-sm text-blue-200 transition-all duration-200 flex items-center group shadow-md hover:shadow-lg hover:shadow-indigo-900/20"
                      >
                        <div className="mr-3 w-10 h-10 bg-indigo-900/60 rounded-md flex items-center justify-center text-blue-300 transform group-hover:scale-110 transition-all">
                          <Zap size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-blue-100 transition-colors font-medium">
                            {examples[1]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-blue-400" />
                        </div>
                      </a>
                    </motion.div>
                    
                    {/* Car Aerodynamics Demo Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          startDemoWithPath('car-aerodynamics', examples[2]);
                        }}
                        className="block w-full bg-gradient-to-r from-green-900/40 to-teal-900/40 hover:from-green-800/50 hover:to-teal-800/50 border border-green-500/30 rounded-md p-3 text-left text-sm text-blue-200 transition-all duration-200 flex items-center group shadow-md hover:shadow-lg hover:shadow-green-900/20"
                      >
                        <div className="mr-3 w-10 h-10 bg-green-900/60 rounded-md flex items-center justify-center text-blue-300 transform group-hover:scale-110 transition-all">
                          <Upload size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-blue-100 transition-colors font-medium">
                            {examples[2]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-blue-400" />
                        </div>
                      </a>
                    </motion.div>
                    
                    {/* Packaging Design Demo Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          startDemoWithPath('packaging-design', examples[3]);
                        }}
                        className="block w-full bg-gradient-to-r from-amber-900/40 to-orange-900/40 hover:from-amber-800/50 hover:to-orange-800/50 border border-amber-500/30 rounded-md p-3 text-left text-sm text-blue-200 transition-all duration-200 flex items-center group shadow-md hover:shadow-lg hover:shadow-amber-900/20"
                      >
                        <div className="mr-3 w-10 h-10 bg-amber-900/60 rounded-md flex items-center justify-center text-blue-300 transform group-hover:scale-110 transition-all">
                          <PackageOpen size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-blue-100 transition-colors font-medium">
                            {examples[3]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-blue-400" />
                        </div>
                      </a>
                    </motion.div>
                    
                    {/* Phone Packaging Demo Button - Highlighted as default/recommended option */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          startDemoWithPath('phone-packaging', examples[4]);
                        }}
                        className="block w-full bg-gradient-to-r from-purple-800/50 to-pink-800/50 hover:from-purple-700/60 hover:to-pink-700/60 border-2 border-purple-500/50 rounded-md p-3 text-left text-sm text-blue-100 transition-all duration-200 flex items-center group shadow-md hover:shadow-lg hover:shadow-purple-900/20 relative"
                      >
                        <div className="mr-3 w-10 h-10 bg-purple-900/60 rounded-md flex items-center justify-center text-blue-300 transform group-hover:scale-110 transition-all">
                          <PackageOpen size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-blue-100 transition-colors font-medium">
                            {examples[4]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-blue-400" />
                        </div>
                      </a>
                    </motion.div>
                    
                    {/* Multi-Product Packaging Demo Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleExampleClick(examples[5], 5);
                        }}
                        className="block w-full bg-gradient-to-r from-indigo-800/50 to-fuchsia-800/50 hover:from-indigo-700/60 hover:to-fuchsia-700/60 border border-indigo-500/50 rounded-md p-3 text-left text-sm text-blue-100 transition-all duration-200 flex items-center group shadow-md hover:shadow-lg hover:shadow-indigo-900/20 relative"
                      >
                        <div className="mr-3 w-10 h-10 bg-indigo-900/60 rounded-md flex items-center justify-center text-blue-300 transform group-hover:scale-110 transition-all">
                          <Boxes size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-blue-100 transition-colors font-medium">
                            {examples[5]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-blue-400" />
                        </div>
                      </a>
                    </motion.div>
                    
                    {/* 3D Model Viewer Demo Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // Special case for 3D model viewer
                          setDemoPath('model-viewer');
                          nextDemoStep();
                        }}
                        className="block w-full bg-gradient-to-r from-cyan-800/50 to-blue-800/50 hover:from-cyan-700/60 hover:to-blue-700/60 border border-cyan-500/50 rounded-md p-3 text-left text-sm text-blue-100 transition-all duration-200 flex items-center group shadow-md hover:shadow-lg hover:shadow-cyan-900/20 relative"
                      >
                        <div className="mr-3 w-10 h-10 bg-cyan-900/60 rounded-md flex items-center justify-center text-blue-300 transform group-hover:scale-110 transition-all">
                          <PenTool size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-blue-100 transition-colors font-medium">
                            {examples[6]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-blue-400" />
                        </div>
                      </a>
                    </motion.div>
                    
                    {/* Sandbox Demo Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // Special case for sandbox demo
                          setDemoPath('sandbox');
                          nextDemoStep();
                        }}
                        className="block w-full bg-gradient-to-r from-purple-800/50 to-indigo-800/50 hover:from-purple-700/60 hover:to-indigo-700/60 border border-purple-500/50 rounded-md p-3 text-left text-sm text-blue-100 transition-all duration-200 flex items-center group shadow-md hover:shadow-lg hover:shadow-purple-900/20 relative"
                      >
                        <div className="mr-3 w-10 h-10 bg-purple-900/60 rounded-md flex items-center justify-center text-blue-300 transform group-hover:scale-110 transition-all">
                          <Code size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-blue-100 transition-colors font-medium">
                            {examples[7]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-blue-400" />
                        </div>
                      </a>
                    </motion.div>
                    
                    {/* Latent Explorer Demo Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // Special case for latent explorer demo
                          setDemoPath('latent-explorer');
                          nextDemoStep();
                        }}
                        className="block w-full bg-gradient-to-r from-blue-800/50 to-cyan-800/50 hover:from-blue-700/60 hover:to-cyan-700/60 border border-blue-500/50 rounded-md p-3 text-left text-sm text-blue-100 transition-all duration-200 flex items-center group shadow-md hover:shadow-lg hover:shadow-blue-900/20 relative"
                      >
                        <div className="mr-3 w-10 h-10 bg-blue-900/60 rounded-md flex items-center justify-center text-blue-300 transform group-hover:scale-110 transition-all">
                          <Sliders size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-blue-100 transition-colors font-medium">
                            {examples[8]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-blue-400" />
                        </div>
                      </a>
                    </motion.div>
                    
                    {/* V2 Latent Explorer Demo Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // Special case for V2 latent explorer demo
                          setDemoPath('latent-explorer-v2');
                          nextDemoStep();
                        }}
                        className="block w-full bg-gradient-to-r from-emerald-800/50 to-teal-800/50 hover:from-emerald-700/60 hover:to-teal-700/60 border border-emerald-500/50 rounded-md p-3 text-left text-sm text-emerald-100 transition-all duration-200 flex items-center group shadow-md hover:shadow-lg hover:shadow-emerald-900/20 relative"
                      >
                        <div className="mr-3 w-10 h-10 bg-emerald-900/60 rounded-md flex items-center justify-center text-emerald-300 transform group-hover:scale-110 transition-all">
                          <Sliders size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-emerald-100 transition-colors font-medium">
                            {examples[9]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-emerald-400" />
                        </div>
                      </a>
                    </motion.div>
                    
                    {/* Cosmology Demo Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // Special case for cosmology demo
                          setDemoPath('cosmology');
                          nextDemoStep();
                        }}
                        className="block w-full bg-gradient-to-r from-purple-800/50 to-blue-800/50 hover:from-purple-700/60 hover:to-blue-700/60 border border-purple-500/50 rounded-md p-3 text-left text-sm text-purple-100 transition-all duration-200 flex items-center group shadow-md hover:shadow-lg hover:shadow-purple-900/20 relative"
                      >
                        <div className="mr-3 w-10 h-10 bg-purple-900/60 rounded-md flex items-center justify-center text-purple-300 transform group-hover:scale-110 transition-all">
                          <Zap size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-purple-100 transition-colors font-medium">
                            {examples[10]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-purple-400" />
                        </div>
                      </a>
                    </motion.div>
                    
                    {/* Amazon Demo Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // Special case for Amazon demo
                          setDemoPath('amazon');
                          nextDemoStep();
                        }}
                        className="block w-full bg-gradient-to-r from-orange-800/50 to-amber-800/50 hover:from-orange-700/60 hover:to-amber-700/60 border border-orange-500/50 rounded-md p-3 text-left text-sm text-orange-100 transition-all duration-200 flex items-center group shadow-md hover:shadow-lg hover:shadow-orange-900/20 relative"
                      >
                        <div className="mr-3 w-10 h-10 bg-orange-900/60 rounded-md flex items-center justify-center text-orange-300 transform group-hover:scale-110 transition-all">
                          <Box size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-orange-100 transition-colors font-medium">
                            {examples[11]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-orange-400" />
                        </div>
                      </a>
                    </motion.div>
                    
                    {/* Dell Demo Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // Special case for Dell demo
                          setDemoPath('dell');
                          nextDemoStep();
                        }}
                        className="block w-full bg-gradient-to-r from-blue-800/50 to-sky-800/50 hover:from-blue-700/60 hover:to-sky-700/60 border border-blue-500/50 rounded-md p-3 text-left text-sm text-blue-100 transition-all duration-200 flex items-center group shadow-md hover:shadow-lg hover:shadow-blue-900/20 relative"
                      >
                        <div className="mr-3 w-10 h-10 bg-blue-900/60 rounded-md flex items-center justify-center text-blue-300 transform group-hover:scale-110 transition-all">
                          <Box size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-blue-100 transition-colors font-medium">
                            {examples[12]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-blue-400" />
                        </div>
                      </a>
                    </motion.div>
                    
                    {/* APS Demo Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // Special case for APS demo
                          setDemoPath('aps');
                          nextDemoStep();
                        }}
                        className="block w-full bg-gradient-to-r from-cyan-800/50 to-teal-800/50 hover:from-cyan-700/60 hover:to-teal-700/60 border border-cyan-500/50 rounded-md p-3 text-left text-sm text-cyan-100 transition-all duration-200 flex items-center group shadow-md hover:shadow-lg hover:shadow-cyan-900/20 relative"
                      >
                        <div className="mr-3 w-10 h-10 bg-cyan-900/60 rounded-md flex items-center justify-center text-cyan-300 transform group-hover:scale-110 transition-all">
                          <Settings size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-cyan-100 transition-colors font-medium">
                            {examples[13]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-cyan-400" />
                        </div>
                      </a>
                    </motion.div>
                    
                    {/* Other examples as regular buttons */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setInputValue(examples[4]);
                        }}
                        className="block w-full bg-[#0D1017] hover:bg-[#161A26] border border-[#242A3D] rounded-md p-3 text-left text-sm text-blue-200 transition-all duration-200 flex items-center group"
                      >
                        <div className="mr-3 w-10 h-10 bg-blue-900/30 rounded-md flex items-center justify-center text-blue-400 transform group-hover:scale-110 transition-all">
                          <Search size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-blue-100 transition-colors">
                            {examples[4]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-gray-500" />
                        </div>
                      </a>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setInputValue(examples[4]);
                        }}
                        className="block w-full bg-[#0D1017] hover:bg-[#161A26] border border-[#242A3D] rounded-md p-3 text-left text-sm text-blue-200 transition-all duration-200 flex items-center group"
                      >
                        <div className="mr-3 w-10 h-10 bg-blue-900/30 rounded-md flex items-center justify-center text-blue-400 transform group-hover:scale-110 transition-all">
                          <ChevronRight size={18} />
                        </div>
                        <div className="flex-1">
                          <span className="line-clamp-1 group-hover:text-blue-100 transition-colors">
                            {examples[4]}
                          </span>
                        </div>
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-gray-500" />
                        </div>
                      </a>
                    </motion.div>
                  </div>
                </div>
                

                {/* Information note */}
                <div className="p-3 bg-[#0D1017] border border-[#242A3D] rounded-md">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <span className="text-blue-400 font-medium">Pro tip:</span> Be specific about parameters or variables you want to investigate, and Godela will build a precise simulation model.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Features section with visual cards */}
      <div className="bg-[#0A0D14] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-light text-white mb-12 text-center">
            Build powerful simulations with <span className="text-blue-400 font-normal">Godela</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#161927] border border-[#2A2F3F] rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <path d="M12 18v-6"></path>
                  <path d="M8 18v-1"></path>
                  <path d="M16 18v-3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Import Data</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Upload experimental data, simulation results, or sensor readings, and Godela intelligently processes your information.
              </p>
            </div>
            
            <div className="bg-[#161927] border border-[#2A2F3F] rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Train Models</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Godela automatically creates physics-informed machine learning models that respect conservation laws and physical constraints.
              </p>
            </div>
            
            <div className="bg-[#161927] border border-[#2A2F3F] rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 8 4-4 4 4"></path>
                  <path d="M7 4v16"></path>
                  <path d="m21 16-4 4-4-4"></path>
                  <path d="M17 20V4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Simulate</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Run thousands of simulations in seconds. Explore parameter spaces and find optimal designs without waiting for lengthy calculations.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* How it works section with visually distinct steps */}
      <div className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-light text-white mb-2 text-center">How Godela Works</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            A powerful workflow that combines the best of AI and physics
          </p>
          
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-16 left-20 w-[calc(100%-40px)] h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-4 text-xl font-bold shadow-lg shadow-blue-900/20 mx-auto">
                  1
                </div>
                <div className="bg-[#161927] border border-[#2A2F3F] rounded-lg p-6 h-full">
                  <h3 className="text-lg font-medium text-white mb-2 text-center">Define Problem</h3>
                  <p className="text-gray-400 text-sm text-center">
                    Describe what you want to simulate, or upload your data and tell Godela what to analyze.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-4 text-xl font-bold shadow-lg shadow-blue-900/20 mx-auto">
                  2
                </div>
                <div className="bg-[#161927] border border-[#2A2F3F] rounded-lg p-6 h-full">
                  <h3 className="text-lg font-medium text-white mb-2 text-center">Select Inputs/Outputs</h3>
                  <p className="text-gray-400 text-sm text-center">
                    Choose the parameters you want to vary and the outputs you need to predict.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-4 text-xl font-bold shadow-lg shadow-blue-900/20 mx-auto">
                  3
                </div>
                <div className="bg-[#161927] border border-[#2A2F3F] rounded-lg p-6 h-full">
                  <h3 className="text-lg font-medium text-white mb-2 text-center">Build Physics Model</h3>
                  <p className="text-gray-400 text-sm text-center">
                    Godela creates a neural network that incorporates relevant physics laws and constraints.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-4 text-xl font-bold shadow-lg shadow-blue-900/20 mx-auto">
                  4
                </div>
                <div className="bg-[#161927] border border-[#2A2F3F] rounded-lg p-6 h-full">
                  <h3 className="text-lg font-medium text-white mb-2 text-center">Analyze Results</h3>
                  <p className="text-gray-400 text-sm text-center">
                    Explore the interactive visualization and optimize parameters in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Application domains with visual cards */}
      <div className="py-16 px-6 bg-[#0A0D14]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light text-white mb-2 text-center">Application Domains</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Godela works across engineering and scientific disciplines
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-b from-[#161927] to-[#121520] border border-[#2A2F3F] rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10">
              <h3 className="text-xl font-medium text-blue-300 mb-3">Aerospace</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Optimize airfoil designs, predict drag coefficients, and model complex fluid dynamics.
              </p>
              <button onClick={handleLaunchDemo} className="text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center">
                Try demo <ChevronRight size={14} className="ml-1" />
              </button>
            </div>
            
            <div className="bg-gradient-to-b from-[#161927] to-[#121520] border border-[#2A2F3F] rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10">
              <h3 className="text-xl font-medium text-blue-300 mb-3">Mechanical</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Predict fatigue life, optimize material selection, and calculate thermal properties.
              </p>
              <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center">
                Explore use cases <ChevronRight size={14} className="ml-1" />
              </button>
            </div>
            
            <div className="bg-gradient-to-b from-[#161927] to-[#121520] border border-[#2A2F3F] rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10">
              <h3 className="text-xl font-medium text-blue-300 mb-3">Chemical</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Model reaction kinetics, optimize catalyst designs, and predict reaction yields.
              </p>
              <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center">
                View examples <ChevronRight size={14} className="ml-1" />
              </button>
            </div>
            
            <div className="bg-gradient-to-b from-[#161927] to-[#121520] border border-[#2A2F3F] rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10">
              <h3 className="text-xl font-medium text-blue-300 mb-3">Energy</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Optimize renewable energy systems, predict battery performance, and model grid systems.
              </p>
              <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center">
                Learn more <ChevronRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to action */}
      <div className="px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light text-white mb-6">
            Ready to start your simulation?
          </h2>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLaunchDemo}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-medium shadow-lg shadow-indigo-900/30 hover:shadow-indigo-700/40 transition-all duration-300"
          >
            <div className="flex items-center">
              <UserPlus size={18} className="mr-2" />
              <span>Join Waitlist</span>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}