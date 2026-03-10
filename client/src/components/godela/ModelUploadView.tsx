import React, { useState, useRef, useEffect } from 'react';
import { Upload, RotateCw, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import GodelaModelViewer, { ModelType } from './GodelaModelViewer';
import { modelUploadService } from '../../lib/modelUploadService';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface ModelUploadViewProps {
  onModelUploaded?: (modelType: ModelType, modelUrl: string, filename: string) => void;
  onContinue?: () => void;
  className?: string;
}

/**
 * A view component for uploading and previewing 3D models (GLB, STL, etc.)
 */
export default function ModelUploadView({ 
  onModelUploaded, 
  onContinue,
  className = '' 
}: ModelUploadViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [modelType, setModelType] = useState<ModelType>('none');
  const [modelUrl, setModelUrl] = useState<string>('');
  const [modelFilename, setModelFilename] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (modelUrl) {
        modelUploadService.revokeModelUrl(modelUrl);
      }
    };
  }, [modelUrl]);
  
  // Handle file selection
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setUploadSuccess(false);
    
    try {
      const result = await modelUploadService.uploadModel(file);
      
      // Update state with the uploaded model
      setModelType(result.type);
      setModelUrl(result.url);
      setModelFilename(result.filename);
      setUploadSuccess(true);
      
      // Call the callback if provided
      if (onModelUploaded) {
        onModelUploaded(result.type, result.url, result.filename);
      }
      
      // Switch to the preview tab
      setActiveTab('preview');
    } catch (err) {
      console.error('Error uploading model:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while uploading the model');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle clicking the upload button
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle when a file is selected through the input
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleFileUpload(event.target.files[0]);
    }
  };
  
  // Handler for continue button
  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    }
  };
  
  return (
    <div className={`flex flex-col ${className}`}>
      <Tabs
        defaultValue="upload"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="upload">Upload Model</TabsTrigger>
          <TabsTrigger value="preview" disabled={modelType === 'none'}>
            Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          {/* Error message if upload fails */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Upload Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Success message if upload succeeds */}
          {uploadSuccess && (
            <Alert className="mb-4 border-green-500 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Upload Successful</AlertTitle>
              <AlertDescription>
                Your model {modelFilename} has been uploaded successfully.
              </AlertDescription>
            </Alert>
          )}
          
          {/* File upload area */}
          <div className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-xl p-6">
            <div className="flex items-center mb-4">
              <Upload className="h-5 w-5 text-indigo-400 mr-2" />
              <h3 className="text-lg font-medium text-slate-200">Upload 3D Model</h3>
            </div>
            <p className="text-slate-300 mb-6">
              Upload a 3D model to visualize and simulate. We support GLB, GLTF, STL, STP, and STEP files.
            </p>
            
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed border-slate-600 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={handleUploadClick}
              >
                <Upload className="mx-auto h-12 w-12 text-slate-500" />
                <p className="mt-4 text-sm font-medium text-slate-400">
                  Click to upload or drag and drop
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  GLB, GLTF, STL, STP, or STEP up to 100MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".glb,.gltf,.stl,.stp,.step"
                  onChange={handleFileInputChange}
                />
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="default" 
                  size="lg"
                  className="mt-4 px-6"
                  onClick={handleUploadClick}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Select File
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Sample models */}
          <div className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-xl p-6">
            <h3 className="text-lg font-medium text-slate-200 mb-4">Or Use Sample Model</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SampleModelCard 
                title="Smartphone"
                description="Standard smartphone model"
                onClick={() => {
                  setModelType('glb');
                  setModelUrl('/samples/phone.glb');
                  setModelFilename('phone.glb');
                  setActiveTab('preview');
                  setUploadSuccess(true);
                  if (onModelUploaded) {
                    onModelUploaded('glb', '/samples/phone.glb', 'phone.glb');
                  }
                }}
              />
              <SampleModelCard 
                title="Car"
                description="Aerodynamic vehicle model"
                onClick={() => {
                  setModelType('glb');
                  setModelUrl('/samples/car.glb');
                  setModelFilename('car.glb');
                  setActiveTab('preview');
                  setUploadSuccess(true);
                  if (onModelUploaded) {
                    onModelUploaded('glb', '/samples/car.glb', 'car.glb');
                  }
                }}
              />
              <SampleModelCard 
                title="Packaging"
                description="Box packaging model"
                onClick={() => {
                  setModelType('glb');
                  setModelUrl('/samples/box.glb');
                  setModelFilename('box.glb');
                  setActiveTab('preview');
                  setUploadSuccess(true);
                  if (onModelUploaded) {
                    onModelUploaded('glb', '/samples/box.glb', 'box.glb');
                  }
                }}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-6">
          {/* Model preview with controls */}
          <div className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-200">Model Preview</h3>
              <span className="text-sm text-slate-400">{modelFilename}</span>
            </div>
            
            <div className="aspect-[16/10] w-full bg-slate-900/70 rounded-lg overflow-hidden mb-4">
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
                onFileUpload={(file) => handleFileUpload(file)}
              />
            </div>
            
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setActiveTab('upload')}
              >
                Back to Upload
              </Button>
              
              <Button
                onClick={handleContinue}
                disabled={modelType === 'none'}
              >
                Continue 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Sample model card component
interface SampleModelCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

function SampleModelCard({ title, description, onClick }: SampleModelCardProps) {
  return (
    <div 
      className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-4 hover:border-indigo-500/80 hover:bg-slate-800/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <h4 className="font-medium text-slate-200 mb-1">{title}</h4>
      <p className="text-sm text-slate-400 mb-3">{description}</p>
      <Button size="sm" variant="outline" className="w-full">
        Use This Model
      </Button>
    </div>
  );
}