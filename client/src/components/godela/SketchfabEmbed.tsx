import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SketchfabEmbedProps {
  modelId: string;
  embedCode?: string;
  autoStart?: boolean;
  transparent?: boolean;
}

const SketchfabEmbed: React.FC<SketchfabEmbedProps> = ({ modelId, embedCode, autoStart = true, transparent = true }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Add a small delay to simulate loading and avoid flicker
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [modelId]);

  // If we have explicit embed code, use that
  if (embedCode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-full w-full bg-slate-900/50 rounded-lg overflow-hidden"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-10">
            <div className="text-center">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-3"></div>
              <p className="text-slate-300">Loading visualization...</p>
            </div>
          </div>
        )}
        <div 
          className="h-full w-full" 
          dangerouslySetInnerHTML={{ __html: embedCode }}
        />
      </motion.div>
    );
  }

  // Default embed if no embed code provided
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full bg-slate-900/50 rounded-lg overflow-hidden"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-10">
          <div className="text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-3"></div>
            <p className="text-slate-300">Loading visualization...</p>
          </div>
        </div>
      )}
      <div className="relative w-full h-full">
        <iframe
          title="Sketchfab Model"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          src={`https://sketchfab.com/models/${modelId}/embed?autospin=1&autostart=${autoStart ? 1 : 0}&camera=0&preload=1&transparent=${transparent ? 1 : 0}&ui_watermark=0&ui_watermark_link=0`}
          style={{ width: '100%', height: '100%', minHeight: '400px' }}
        />
        {/* Top overlay to hide Sketchfab credits */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-black z-10"></div>
        {/* Bottom overlay to hide Sketchfab credits */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-black z-10"></div>
      </div>
    </motion.div>
  );
};

export default SketchfabEmbed;