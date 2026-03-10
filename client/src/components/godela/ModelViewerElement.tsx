import React, { useEffect, useRef } from 'react';

// This component renders a 3D model using the model-viewer web component
export default function ModelViewerElement({ 
  src, 
  alt = '3D Model',
  showControls = true,
  autoRotate = true,
  cameraControls = true,
  poster = undefined
}: {
  src: string;
  alt?: string;
  showControls?: boolean;
  autoRotate?: boolean;
  cameraControls?: boolean;
  poster?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // This dynamically injects the model-viewer script into the page
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    document.head.appendChild(script);
    
    return () => {
      // Clean up when unmounting
      document.head.removeChild(script);
    };
  }, []);
  
  return (
    <div ref={containerRef} className="w-full h-full">
      <model-viewer
        src={src}
        alt={alt}
        auto-rotate={autoRotate}
        camera-controls={cameraControls}
        poster={poster}
        environment-image="neutral"
        shadow-intensity="1"
        exposure="0.8"
        style={{ width: '100%', height: '100%' }}
      >
        {showControls && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="p-2 bg-gray-800/60 backdrop-blur-md rounded-full shadow-lg">
              <button slot="ar-button" className="text-white">View in AR</button>
            </div>
          </div>
        )}
        <div slot="progress-bar" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </model-viewer>
    </div>
  );
}