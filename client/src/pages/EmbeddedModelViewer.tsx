import React, { useEffect, useState } from 'react';
import GodelaModelViewer, { ModelType } from '../components/godela/GodelaModelViewer';

/**
 * A standalone model viewer page that can be embedded in an iframe
 * Accepts URL parameters:
 * - url: The URL of the model to display
 * - type: The type of model (glb, stl, none)
 */
export default function EmbeddedModelViewer() {
  const [modelUrl, setModelUrl] = useState('');
  const [modelType, setModelType] = useState<ModelType>('none');
  
  useEffect(() => {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    const type = params.get('type') as ModelType;
    
    if (url) {
      setModelUrl(url);
    }
    
    if (type && (type === 'glb' || type === 'stl')) {
      setModelType(type);
    }
  }, []);
  
  return (
    <div className="w-full h-screen bg-slate-900">
      <GodelaModelViewer
        modelType={modelType}
        modelUrl={modelUrl}
        enableControls={true}
        options={{
          autoRotate: true,
          enableAnimation: true,
          environmentPreset: 'studio',
          intensity: 1,
          backgroundColor: '#0f172a'
        }}
        className="w-full h-full"
      />
    </div>
  );
}