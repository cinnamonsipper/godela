import { ModelType } from '../components/godela/GodelaModelViewer';

interface UploadedModel {
  type: ModelType;
  url: string;
  filename: string;
}

/**
 * Handles the upload of 3D model files
 */
export const modelUploadService = {
  /**
   * Processes an uploaded file and returns an object with the model details
   * @param file The uploaded file
   * @returns Promise with model details including URL and type
   */
  uploadModel: async (file: File): Promise<UploadedModel> => {
    return new Promise((resolve, reject) => {
      // Check if the file is valid
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }
      
      // Check file type
      const filename = file.name.toLowerCase();
      let modelType: ModelType = 'none';
      
      if (filename.endsWith('.glb') || filename.endsWith('.gltf')) {
        modelType = 'glb';
      } else if (filename.endsWith('.stl') || filename.endsWith('.stp') || filename.endsWith('.step')) {
        modelType = 'stl';
      } else {
        reject(new Error('Unsupported file format. Please upload a GLB, GLTF, STL, STP, or STEP file.'));
        return;
      }
      
      // Create a URL for the file
      const url = URL.createObjectURL(file);
      
      // Resolve with the model information
      resolve({
        type: modelType,
        url,
        filename
      });
    });
  },
  
  /**
   * Revokes a URL created by URL.createObjectURL to prevent memory leaks
   * @param url The URL to revoke
   */
  revokeModelUrl: (url: string): void => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
};