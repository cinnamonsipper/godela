import React from 'react';
import { motion } from 'framer-motion';

interface SimulationViewerPanelProps {
  simulationType: string;
  embedCode?: string;
  title?: string;
  description?: string;
}

export default function SimulationViewerPanel({
  simulationType,
  embedCode,
  title = 'Simulation Results',
  description,
}: SimulationViewerPanelProps) {
  // Define simulation models for different types
  const simulationModels: Record<string, string> = {
    'airfoil-pressure': `<div class="sketchfab-embed-wrapper"> 
      <iframe 
        title="Pressure around an aircraft wing" 
        frameborder="0" 
        allowfullscreen 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true" 
        allow="autoplay; fullscreen; xr-spatial-tracking" 
        xr-spatial-tracking 
        execution-while-out-of-viewport 
        execution-while-not-rendered 
        web-share 
        src="https://sketchfab.com/models/d88cbc16b21f4c93abe003f194b25d55/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
        style="width: 100%; height: 100%; min-height: 400px;"
      ></iframe>
    </div>`,
    'car-aerodynamics': `<div class="sketchfab-embed-wrapper"> 
      <iframe 
        title="Aerodynamic simulation of a car" 
        frameborder="0" 
        allowfullscreen 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true" 
        allow="autoplay; fullscreen; xr-spatial-tracking" 
        xr-spatial-tracking 
        execution-while-out-of-viewport 
        execution-while-not-rendered 
        web-share 
        src="https://sketchfab.com/models/4e262e4e64cb4dc8b22c07c36aaa5aa1/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
        style="width: 100%; height: 100%; min-height: 400px;"
      ></iframe>
    </div>`,
    'phone-packaging': `<div class="sketchfab-embed-wrapper"> 
      <iframe 
        title="Phone Packaging Demo" 
        frameborder="0" 
        allowfullscreen 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true" 
        allow="autoplay; fullscreen; xr-spatial-tracking" 
        xr-spatial-tracking 
        execution-while-out-of-viewport 
        execution-while-not-rendered 
        web-share 
        src="https://sketchfab.com/models/3d6c0a58adf44346bedcd49d3a6204af/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
        style="width: 100%; height: 100%; min-height: 400px;"
      ></iframe>
    </div>`,
    'packaging-drop-test': `<div class="sketchfab-embed-wrapper"> 
      <iframe 
        title="Phone Package Drop Test" 
        frameborder="0" 
        allowfullscreen 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true" 
        allow="autoplay; fullscreen; xr-spatial-tracking" 
        xr-spatial-tracking 
        execution-while-out-of-viewport 
        execution-while-not-rendered 
        web-share 
        src="https://sketchfab.com/models/2c8d52d0aa3c473786a7043251c79f1a/embed?autospin=0&autostart=1&camera=0&preload=1&transparent=1"
        style="width: 100%; height: 100%; min-height: 400px;"
      ></iframe>
    </div>`,
    'multi-product-packaging': `<div class="sketchfab-embed-wrapper"> 
      <iframe 
        title="Multi-Product Packaging" 
        frameborder="0" 
        allowfullscreen 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true" 
        allow="autoplay; fullscreen; xr-spatial-tracking" 
        xr-spatial-tracking 
        execution-while-out-of-viewport 
        execution-while-not-rendered 
        web-share 
        src="https://sketchfab.com/models/f5541a3da5e442a68f5e59e4f4afd03b/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1"
        style="width: 100%; height: 100%; min-height: 400px;"
      ></iframe>
    </div>`,
  };

  // Get embed HTML - user custom embed or predefined type
  const getEmbedHtml = () => {
    if (embedCode) {
      return embedCode;
    }
    return simulationModels[simulationType] || '';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <h2 className="text-xl font-semibold text-slate-200">{title}</h2>
        {description && (
          <p className="text-slate-400 mt-1">{description}</p>
        )}
      </div>

      {/* Simulation Viewer */}
      <div className="flex-1 p-6">
        <div className="h-full bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
          <div 
            className="w-full h-full" 
            dangerouslySetInnerHTML={{ __html: getEmbedHtml() }}
          />
        </div>
      </div>
    </motion.div>
  );
}