import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, LoaderCircle } from 'lucide-react';

interface SimpleGLTFViewerProps {
  url?: string;
  backgroundColor?: string;
  className?: string;
  autoRotate?: boolean;
}

/**
 * An enhanced CSS-based iPhone 12 Pro model viewer
 * Using pure CSS/SVG approach for maximum compatibility in the Replit environment
 */
export default function SimpleGLTFViewer({ 
  url, 
  backgroundColor = '#1a1a2e',
  className = '',
  autoRotate = true
}: SimpleGLTFViewerProps) {
  // Since we're aware of the Three.js issues in Replit, we'll use a highly detailed CSS version

  return (
    <div className={`w-full h-full ${className} rounded-lg overflow-hidden`} style={{ background: backgroundColor }}>
      <div className="h-full w-full flex items-center justify-center perspective-800">
        {/* Enhanced iPhone 12 Pro model with animations */}
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
          {/* Side buttons */}
          <div className="absolute left-[-2px] top-24 h-10 w-1 bg-slate-700 rounded-r-sm"></div>
          <div className="absolute left-[-2px] top-40 h-10 w-1 bg-slate-700 rounded-r-sm"></div>
          <div className="absolute left-[-2px] top-56 h-10 w-1 bg-slate-700 rounded-r-sm"></div>
          <div className="absolute right-[-2px] top-32 h-12 w-1 bg-slate-700 rounded-l-sm"></div>
          
          {/* Top notch */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl flex items-center justify-center overflow-hidden">
            <div className="w-4 h-4 rounded-full bg-slate-700 absolute left-3"></div>
            <div className="w-2 h-4 rounded-full bg-slate-800 absolute left-8"></div>
            <div className="w-8 h-2 rounded-full bg-slate-700 absolute left-12"></div>
          </div>
          
          {/* Screen with dynamic reflections */}
          <div className="absolute inset-2 rounded-[30px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-600/5">
              {/* Moving reflection effect */}
              <motion.div 
                className="absolute inset-0 opacity-20 bg-gradient-to-tr from-transparent to-white/20"
                animate={{ 
                  left: ['-100%', '100%'],
                  top: ['-100%', '100%'] 
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity, 
                  ease: "linear",
                  repeatType: "mirror"
                }}
              />
            </div>
            
            {/* Status bar */}
            <div className="h-8 flex justify-between items-center px-6 bg-black/10 backdrop-blur-sm">
              <div className="text-xs text-white font-medium">11:42</div>
              <div className="flex space-x-1">
                <svg viewBox="0 0 100 100" className="h-4 w-4 text-white">
                  <rect fill="currentColor" x="20" y="50" width="10" height="30" />
                  <rect fill="currentColor" x="45" y="30" width="10" height="50" />
                  <rect fill="currentColor" x="70" y="10" width="10" height="70" />
                </svg>
                <svg viewBox="0 0 100 100" className="h-4 w-4 text-white">
                  <path fill="currentColor" d="M20,20 L80,20 L80,80 L20,80 Z" fillOpacity="0.2" />
                  <path fill="currentColor" d="M30,30 L70,30 L70,70 L30,70 Z" />
                </svg>
                <svg viewBox="0 0 100 100" className="h-4 w-4 text-white">
                  <path fill="currentColor" d="M10,50 C10,30 30,10 50,10 C70,10 90,30 90,50 C90,70 70,90 50,90 C30,90 10,70 10,50 Z" fillOpacity="0.2" />
                  <path fill="currentColor" d="M30,50 L50,50 L50,20 C40,20 30,30 30,50 Z" />
                  <path fill="currentColor" d="M50,50 L70,50 C70,30 60,20 50,20 L50,50 Z" />
                  <path fill="currentColor" d="M30,50 C30,70 40,80 50,80 L50,50 L30,50 Z" />
                  <path fill="currentColor" d="M50,50 L50,80 C60,80 70,70 70,50 L50,50 Z" />
                </svg>
              </div>
            </div>
            
            {/* App grid */}
            <div className="grid grid-cols-4 gap-4 p-6 mt-6">
              {[...Array(16)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="w-full aspect-square rounded-xl"
                  style={{
                    background: `linear-gradient(to bottom right, 
                      ${['#4f46e5', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4'][i % 6]}33, 
                      ${['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#4f46e5'][i % 6]}22)`
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
            
            {/* Dock */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] h-16 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-slate-700/20 flex items-center justify-around px-2">
              {[...Array(4)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(to bottom right, 
                      ${['#4f46e5', '#06b6d4', '#f97316', '#8b5cf6'][i]}33, 
                      ${['#3b82f6', '#0ea5e9', '#f59e0b', '#a855f7'][i]}22)`
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
          </div>
          
          {/* Camera bump */}
          <div className="absolute top-10 right-5 w-16 h-16 bg-slate-800 rounded-2xl shadow-inner">
            {/* Top camera */}
            <div className="w-6 h-6 absolute top-1 left-1 rounded-full bg-slate-900 border border-slate-700/50">
              <div className="absolute inset-1 rounded-full bg-slate-800 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500/30"></div>
              </div>
            </div>
            
            {/* Middle camera */}
            <div className="w-6 h-6 absolute top-1 right-1 rounded-full bg-slate-900 border border-slate-700/50">
              <div className="absolute inset-1 rounded-full bg-slate-800 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-500/30"></div>
              </div>
            </div>
            
            {/* Bottom camera */}
            <div className="w-6 h-6 absolute bottom-1 left-1 rounded-full bg-slate-900 border border-slate-700/50">
              <div className="absolute inset-1 rounded-full bg-slate-800 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-purple-500/30"></div>
              </div>
            </div>
            
            {/* LIDAR */}
            <div className="w-6 h-6 absolute bottom-1 right-1 rounded-full bg-slate-900 border border-slate-700/50">
              <div className="absolute inset-2 rounded-full bg-slate-800"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}