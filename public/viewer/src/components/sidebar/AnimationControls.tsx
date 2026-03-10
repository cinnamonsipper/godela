import React from 'react';
import { Radiation as Animation, Play, Pause, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnimationControls: React.FC = () => {
  const { 
    isPlaying, 
    togglePlayback, 
    animationProgress, 
    setAnimationProgress,
    animationSpeed,
    setAnimationSpeed,
    animations,
    selectedAnimations,
    toggleAnimationSelection,
    resetAnimation
  } = useApp();
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-300 flex items-center">
        <Animation size={16} className="mr-2" />
        Animation Controls
      </h3>
      
      {animations.length > 0 ? (
        <>
          <div className="card p-3">
            <label className="block text-xs text-gray-400 mb-2">
              Animations
            </label>
            <div className="space-y-2">
              {animations.map((anim, index) => (
                <label key={index} className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={selectedAnimations.includes(anim.name)}
                    onChange={() => toggleAnimationSelection(anim.name)}
                    className="mr-2"
                  />
                  <span className="text-sm">{anim.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="card p-3">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-gray-400">Playback</label>
              <div className="flex space-x-2">
                <button 
                  onClick={resetAnimation}
                  className="p-1 rounded hover:bg-dark-600"
                  title="Reset Animation"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={togglePlayback}
                  className="p-1 rounded hover:bg-dark-600"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </div>
            </div>
            
            <input
              type="range"
              min="0"
              max="100"
              value={animationProgress}
              onChange={(e) => setAnimationProgress(parseInt(e.target.value))}
              className="slider w-full mb-2"
            />
            
            <div className="flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span>{animationProgress}%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className="card p-3">
            <label className="block text-xs text-gray-400 mb-2">
              Playback Speed: {animationSpeed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="slider w-full"
            />
          </div>
        </>
      ) : (
        <div className="card p-4 text-center">
          <p className="text-sm text-gray-400">
            No animations found in the current model
          </p>
        </div>
      )}
    </div>
  );
};