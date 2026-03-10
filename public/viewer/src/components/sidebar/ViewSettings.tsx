import React from 'react';
import { Eye, Grid3X3, Lightbulb, Droplet } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ViewSettings: React.FC = () => {
  const { 
    showGrid, 
    setShowGrid,
    showAxes,
    setShowAxes,
    renderMode,
    setRenderMode,
    wireframeOpacity,
    setWireframeOpacity,
    wireframeColor,
    setWireframeColor,
    edgeHighlight,
    setEdgeHighlight,
    faceOpacity,
    setFaceOpacity
  } = useApp();
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-300 flex items-center">
        <Eye size={16} className="mr-2" />
        View Settings
      </h3>
      
      <div className="card p-3">
        <h4 className="text-xs font-medium text-gray-400 mb-2">Display Options</h4>
        
        <div className="space-y-2">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={showGrid} 
              onChange={(e) => setShowGrid(e.target.checked)}
              className="mr-2"
            />
            <Grid3X3 size={14} className="mr-1" />
            <span className="text-sm">Show Grid</span>
          </label>
          
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={showAxes} 
              onChange={(e) => setShowAxes(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Show Axes</span>
          </label>
        </div>
      </div>
      
      <div className="card p-3">
        <h4 className="text-xs font-medium text-gray-400 mb-2">Rendering Mode</h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="radio" 
                checked={renderMode === 'normal'} 
                onChange={() => setRenderMode('normal')}
                className="mr-2"
              />
              <Lightbulb size={14} className="mr-1" />
              <span className="text-sm">Normal</span>
            </label>
            
            <label className="flex items-center">
              <input 
                type="radio" 
                checked={renderMode === 'wireframe'} 
                onChange={() => setRenderMode('wireframe')}
                className="mr-2"
              />
              <span className="text-sm">Wireframe</span>
            </label>
          </div>
          
          {renderMode === 'wireframe' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Wire Opacity: {wireframeOpacity.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={wireframeOpacity}
                  onChange={(e) => setWireframeOpacity(parseFloat(e.target.value))}
                  className="slider w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Face Opacity: {faceOpacity.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={faceOpacity}
                  onChange={(e) => setFaceOpacity(parseFloat(e.target.value))}
                  className="slider w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Wire Color
                </label>
                <input
                  type="color"
                  value={wireframeColor}
                  onChange={(e) => setWireframeColor(e.target.value)}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>

              <label className="flex items-center">
                <input 
                  type="checkbox"
                  checked={edgeHighlight}
                  onChange={(e) => setEdgeHighlight(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Edge Highlighting</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};