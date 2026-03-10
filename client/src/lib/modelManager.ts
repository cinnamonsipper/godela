/**
 * Model Manager - Handles mapping between latent space points and STL models
 * 
 * This service manages the relationship between design points in the latent space
 * and their corresponding 3D model files.
 */

// List of all available STL files
const STL_FILES = [
  'give_me_30_different__0505210111_generate.stl',
  'give_me_30_different__0505210104_generate.stl',
  'give_me_30_different__0505210058_generate.stl',
  'give_me_30_different__0505210052_generate.stl',
  'give_me_30_different__0505210032_generate.stl',
  'give_me_30_different__0505210023_generate.stl',
  'give_me_30_different__0505210016_generate.stl',
  'give_me_30_different__0505210010_generate.stl',
  'give_me_30_different__0505205956_generate.stl',
  'give_me_30_different__0505205934_generate.stl'
];

export interface ModelMapping {
  designId: string;
  modelPath: string;
  thumbnail?: string;
  description?: string;
}

// Pre-loaded models for demo purposes
const DEFAULT_MODELS: ModelMapping[] = [
  { 
    designId: '1A', 
    modelPath: '/models/aircraft_design_1a.stl',
    description: 'Standard delta wing'
  },
  { 
    designId: '1B', 
    modelPath: '/models/aircraft_design_1b.stl',
    description: 'Modified swept wing'
  },
  { 
    designId: '2A', 
    modelPath: '/models/aircraft_design_2a.stl', 
    description: 'Forward swept wing'
  },
  { 
    designId: '2B', 
    modelPath: '/models/aircraft_design_2b.stl',
    description: 'Blended wing body'
  },
  { 
    designId: '3A', 
    modelPath: '/models/aircraft_design_3a.stl',
    description: 'Canard configuration'
  },
];

// For testing purposes, use the test.stl file in the root
const TEST_MODEL = '/test.stl';

/**
 * Get a random STL file path from the available files
 */
export function getRandomSTLFile(): string {
  const randomIndex = Math.floor(Math.random() * STL_FILES.length);
  return `/Planes/${STL_FILES[randomIndex]}`;
}

/**
 * Get the model path for a specific design point
 */
export function getModelPathForDesign(designId: string): string {
  // For now, we'll return a random STL file for each design
  return getRandomSTLFile();
}

/**
 * Get all available models
 */
export function getAllModels(): ModelMapping[] {
  return STL_FILES.map((file, index) => ({
    designId: `design-${index + 1}`,
    modelPath: `/Planes/${file}`,
    description: `Aircraft Design ${index + 1}`
  }));
}

/**
 * Get a model by ID
 */
export function getModelById(designId: string): ModelMapping | undefined {
  const models = getAllModels();
  return models.find(m => m.designId === designId);
}