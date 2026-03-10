import React from 'react';
import { motion } from 'framer-motion';

interface EmbeddedModelViewerProps {
  embedCode: string;
  title?: string;
  description?: string;
}

/**
 * Component for displaying 3D models using embedded HTML from external sources
 * This component allows direct insertion of embed codes from services like Sketchfab
 */
export default function EmbeddedModelViewer({
  embedCode,
  title = '3D Model Viewer',
  description
}: EmbeddedModelViewerProps) {
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

      {/* Embed Container */}
      <div className="flex-1 p-6">
        <div className="h-full rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900/50">
          <div 
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: embedCode }}
          />
        </div>
      </div>
    </motion.div>
  );
}