import React from 'react';
import { 
  PlayCircle, 
  PauseCircle, 
  Repeat, 
  RotateCcw, 
  Camera, 
  Download, 
  Upload,
  ZoomIn,
  Grid
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toolbar: React.FC = () => {
  const { 
    isPlaying, 
    togglePlayback, 
    resetAnimation, 
    uploadFile, 
    hasModel 
  } = useApp();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <label className="btn btn-primary cursor-pointer">
        <Upload size={16} className="mr-1" />
        Import GLB
        <input 
          type="file" 
          accept=".glb" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </label>
      
      {hasModel && (
        <>
          <button 
            onClick={togglePlayback} 
            className="p-2 rounded hover:bg-dark-600 text-white"
            title={isPlaying ? "Pause Animation" : "Play Animation"}
          >
            {isPlaying ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
          </button>
          
          <button 
            onClick={resetAnimation} 
            className="p-2 rounded hover:bg-dark-600 text-white"
            title="Reset Animation"
          >
            <RotateCcw size={20} />
          </button>
          
          <button 
            className="p-2 rounded hover:bg-dark-600 text-white"
            title="Loop Animation"
          >
            <Repeat size={20} />
          </button>
          
          <div className="h-6 w-px bg-dark-600 mx-1"></div>
          
          <button 
            className="p-2 rounded hover:bg-dark-600 text-white"
            title="Camera Reset"
          >
            <Camera size={20} />
          </button>
          
          <button 
            className="p-2 rounded hover:bg-dark-600 text-white"
            title="Toggle Grid"
          >
            <Grid size={20} />
          </button>
          
          <button 
            className="p-2 rounded hover:bg-dark-600 text-white"
            title="Reset Zoom"
          >
            <ZoomIn size={20} />
          </button>
          
          <div className="h-6 w-px bg-dark-600 mx-1"></div>
          
          <button 
            className="p-2 rounded hover:bg-dark-600 text-white"
            title="Download Model"
          >
            <Download size={20} />
          </button>
        </>
      )}
    </div>
  );
};