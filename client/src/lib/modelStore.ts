import { create } from 'zustand';
import { ModelType } from '../components/godela/GodelaModelViewer';

// Define the store state
interface ModelState {
  // Current model
  currentModel: {
    type: ModelType;
    url: string;
    filename: string;
  };
  
  // Model upload status
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  
  // Model history (previous versions/iterations)
  modelHistory: Array<{
    type: ModelType;
    url: string;
    filename: string;
    timestamp: Date;
  }>;
  
  // Actions
  setCurrentModel: (type: ModelType, url: string, filename: string) => void;
  clearCurrentModel: () => void;
  setUploadStatus: (isUploading: boolean, progress?: number, error?: string | null) => void;
  addToHistory: (type: ModelType, url: string, filename: string) => void;
  clearHistory: () => void;
}

// Create the store
export const useModelStore = create<ModelState>((set) => ({
  // Default state
  currentModel: {
    type: 'none',
    url: '',
    filename: '',
  },
  isUploading: false,
  uploadProgress: 0,
  uploadError: null,
  modelHistory: [],
  
  // Actions
  setCurrentModel: (type, url, filename) => set({
    currentModel: { type, url, filename },
  }),
  
  clearCurrentModel: () => set({
    currentModel: { type: 'none', url: '', filename: '' },
  }),
  
  setUploadStatus: (isUploading, progress = 0, error = null) => set({
    isUploading,
    uploadProgress: progress,
    uploadError: error,
  }),
  
  addToHistory: (type, url, filename) => set((state) => ({
    modelHistory: [
      ...state.modelHistory,
      {
        type,
        url,
        filename,
        timestamp: new Date(),
      }
    ]
  })),
  
  clearHistory: () => set({ modelHistory: [] }),
}));