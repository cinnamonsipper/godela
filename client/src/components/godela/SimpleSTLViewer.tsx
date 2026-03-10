import React from 'react';

interface SimpleSTLViewerProps {
  modelId: string;
}

/**
 * A simplified STL viewer component that displays placeholder model visualizations
 * for the latent space explorer demo.
 */
const SimpleSTLViewer: React.FC<SimpleSTLViewerProps> = ({ modelId }) => {
  // Each model ID corresponds to a different aircraft configuration
  // This is a simplified implementation that shows placeholder colored panels
  // In a production app, this would load actual 3D models
  
  // We'll use different colors for different model IDs to simulate different designs
  const getModelColor = () => {
    switch (modelId) {
      case 'model_a':
        return 'bg-blue-500/40';
      case 'model_b':
        return 'bg-purple-500/40';
      case 'model_c':
        return 'bg-green-500/40';
      case 'model_d':
        return 'bg-amber-500/40';
      case 'model_e':
        return 'bg-cyan-500/40';
      default:
        return 'bg-gray-500/40';
    }
  };
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Placeholder for STL model */}
      <div className={`relative w-3/4 h-3/4 ${getModelColor()} rounded-lg border border-white/20 backdrop-blur-sm shadow-lg flex items-center justify-center`}>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Simplified aircraft silhouette */}
          <svg width="80%" height="60%" viewBox="0 0 800 400" className="stroke-white/70 fill-none">
            {/* Fuselage */}
            <path d="M200,200 L600,200" strokeWidth="8" />
            
            {/* Wings */}
            {modelId === 'model_a' && (
              <>
                <path d="M350,200 L250,100 L300,100 L400,200" strokeWidth="4" />
                <path d="M350,200 L250,300 L300,300 L400,200" strokeWidth="4" />
              </>
            )}
            
            {modelId === 'model_b' && (
              <>
                <path d="M350,200 L200,120 L300,120 L400,200" strokeWidth="4" />
                <path d="M350,200 L200,280 L300,280 L400,200" strokeWidth="4" />
              </>
            )}
            
            {modelId === 'model_c' && (
              <>
                <path d="M350,200 L250,80 L350,80 L400,200" strokeWidth="4" />
                <path d="M350,200 L250,320 L350,320 L400,200" strokeWidth="4" />
              </>
            )}
            
            {modelId === 'model_d' && (
              <>
                <path d="M350,200 L200,100 L320,110 L400,200" strokeWidth="4" />
                <path d="M350,200 L200,300 L320,290 L400,200" strokeWidth="4" />
              </>
            )}
            
            {modelId === 'model_e' && (
              <>
                <path d="M350,200 L180,80 L330,100 L400,200" strokeWidth="4" />
                <path d="M350,200 L180,320 L330,300 L400,200" strokeWidth="4" />
              </>
            )}
            
            {/* Tail */}
            <path d="M580,200 L600,150 L620,150 L600,200" strokeWidth="4" />
            <path d="M580,200 L600,250 L620,250 L600,200" strokeWidth="4" />
            
            {/* Nose */}
            <path d="M200,200 L150,180 L140,200 L150,220 L200,200" strokeWidth="4" />
          </svg>
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 text-center text-white text-lg font-light">
          Aircraft Configuration {modelId.split('_')[1].toUpperCase()}
        </div>
      </div>
      
      {/* Airflow visualization */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" className="stroke-blue-400/30">
          <path d="M50,180 C150,160 250,200 450,180" strokeWidth="1" strokeDasharray="5,5" />
          <path d="M50,220 C150,240 250,200 450,220" strokeWidth="1" strokeDasharray="5,5" />
          <path d="M50,140 C150,120 250,160 450,140" strokeWidth="1" strokeDasharray="5,5" />
          <path d="M50,260 C150,280 250,240 450,260" strokeWidth="1" strokeDasharray="5,5" />
        </svg>
      </div>
    </div>
  );
};

export default SimpleSTLViewer;