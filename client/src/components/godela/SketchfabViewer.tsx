import React from 'react';
import { motion } from 'framer-motion';

interface SketchfabViewerProps {
  modelId: string;
  title?: string;
  description?: string;
  autoStart?: boolean;
  autoSpin?: boolean;
  transparent?: boolean;
}

export default function SketchfabViewer({
  modelId,
  title = '3D Model Viewer',
  description,
  autoStart = true,
  autoSpin = true,
  transparent = true
}: SketchfabViewerProps) {
  // Build the Sketchfab embed URL with parameters
  const embedUrl = `https://sketchfab.com/models/${modelId}/embed?autospin=${autoSpin ? 1 : 0}&autostart=${autoStart ? 1 : 0}&preload=1&transparent=${transparent ? 1 : 0}`;

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

      {/* Viewer */}
      <div className="flex-1 p-6">
        <div className="h-full rounded-xl overflow-hidden border border-slate-700/50">
          <div className="w-full h-full" style={{ minHeight: '500px' }}>
            <iframe
              title={title}
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
              width="100%"
              height="100%"
              src={embedUrl}
              style={{ minHeight: '500px' }}
            ></iframe>
          </div>
        </div>
      </div>
    </motion.div>
  );
}