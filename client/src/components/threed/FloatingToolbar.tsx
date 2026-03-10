import React from 'react';
import { 
  Download, 
  Share2, 
  RotateCw, 
  Layers, 
  Maximize2, 
  Grid, 
  Play, 
  Pause, 
  UnfoldVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '../../context/AppContext';

export const FloatingToolbar: React.FC = () => {
  const { 
    isPlaying, 
    togglePlayback, 
    resetAnimation, 
    animations,
    showGrid,
    setShowGrid,
    renderMode,
    setRenderMode
  } = useApp();
  
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur-sm rounded-full px-2 py-1 border border-slate-700/50 shadow-lg z-10">
      <div className="flex items-center gap-0.5">
        {animations.length > 0 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-slate-300 hover:text-white hover:bg-slate-700"
              onClick={togglePlayback}
              title={isPlaying ? "Pause animation" : "Play animation"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-slate-300 hover:text-white hover:bg-slate-700"
              onClick={resetAnimation}
              title="Reset animation"
            >
              <RotateCw size={16} />
            </Button>
            
            <div className="w-px h-5 bg-slate-700 mx-1"></div>
          </>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 rounded-full hover:text-white hover:bg-slate-700 ${
            renderMode === 'normal' ? 'text-indigo-400' : 'text-slate-300'
          }`}
          onClick={() => setRenderMode('normal')}
          title="Normal rendering"
        >
          <Maximize2 size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 rounded-full hover:text-white hover:bg-slate-700 ${
            renderMode === 'wireframe' ? 'text-indigo-400' : 'text-slate-300'
          }`}
          onClick={() => setRenderMode('wireframe')}
          title="Wireframe rendering"
        >
          <Layers size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 rounded-full hover:text-white hover:bg-slate-700 ${
            showGrid ? 'text-indigo-400' : 'text-slate-300'
          }`}
          onClick={() => setShowGrid(!showGrid)}
          title="Toggle grid"
        >
          <Grid size={16} />
        </Button>
        
        <div className="w-px h-5 bg-slate-700 mx-1"></div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-slate-300 hover:text-white hover:bg-slate-700"
          title="Download model"
        >
          <Download size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-slate-300 hover:text-white hover:bg-slate-700"
          title="Share model"
        >
          <Share2 size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-slate-300 hover:text-white hover:bg-slate-700"
          title="Show sidebar"
        >
          <UnfoldVertical size={16} />
        </Button>
      </div>
    </div>
  );
};