import React, { useState, useCallback } from 'react';
import { Upload, PackageCheck, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ConsolidatedSTLViewer from './ConsolidatedSTLViewer';

interface PackagingUploadViewProps {
  onStepComplete: (response: string) => void;
}

const PackagingUploadView: React.FC<PackagingUploadViewProps> = ({ 
  onStepComplete 
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Create a URL for the file to display in the STL viewer
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Simulate file upload
      setUploadState('uploading');
      setTimeout(() => {
        setUploadState('success');
      }, 2000);
    }
  };

  const handleUseDemo = () => {
    setUploadState('success');
    // Simulate loading the demo file
    setTimeout(() => {
      onStepComplete("Let's use your sample bottle for now.");
    }, 1000);
  };

  return (
    <motion.div 
      className="h-full w-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-1 flex flex-col md:flex-row gap-6 p-6">
        {/* 3D viewer area */}
        <div className="flex-1 bg-slate-900/70 backdrop-blur-lg rounded-xl border border-slate-700/50 flex flex-col">
          <div className="p-4 border-b border-slate-700/50">
            <h2 className="text-xl font-medium text-slate-200">Product Model</h2>
            <p className="text-slate-400 text-sm">Upload your 3D model or use our sample</p>
          </div>
          <div className="flex-1 flex items-center justify-center p-6 relative">
            {uploadState === 'idle' ? (
              <div className="text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload size={32} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-200 mb-2">Upload Your Product</h3>
                <p className="text-slate-400 mb-6">
                  Upload your 3D model in STL or STEP format. We'll analyze it and help you design optimal packaging.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row justify-center">
                  <label className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md cursor-pointer flex items-center justify-center gap-2 transition-colors">
                    <Upload size={16} />
                    <span>Upload Model</span>
                    <input
                      type="file"
                      accept=".stl,.step,.stp"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:text-white flex items-center gap-2"
                    onClick={handleUseDemo}
                  >
                    <PackageCheck size={16} />
                    Use Sample Model
                  </Button>
                </div>
              </div>
            ) : uploadState === 'uploading' ? (
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-indigo-500 border-slate-700/30 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-300">Uploading and processing model...</p>
              </div>
            ) : uploadState === 'success' ? (
              <div className="w-full h-full relative">
                {previewUrl ? (
                  <ConsolidatedSTLViewer
                    className="w-full h-full"
                    modelPath={previewUrl}
                  />
                ) : (
                  <ConsolidatedSTLViewer
                    className="w-full h-full"
                    modelPath="/bottle.stl"
                  />
                )}
                <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm flex items-center">
                  <Check size={14} className="mr-1" />
                  Model Loaded
                </div>
                <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm text-slate-200 px-4 py-2 rounded-md text-sm">
                  <div className="font-medium mb-1">Model Information:</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-300">
                    <div>Dimensions:</div>
                    <div>25cm × 8cm × 8cm</div>
                    <div>Volume:</div>
                    <div>1,250 cm³</div>
                    <div>Material:</div>
                    <div>PET (assumed)</div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4">
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700" 
                    onClick={() => onStepComplete("Let's use your sample bottle for now.")}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-red-400">
                <X size={48} className="mx-auto mb-2" />
                <p>Upload failed. Please try again.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setUploadState('idle')}
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right side info panel */}
        <div className="md:w-80 lg:w-96 bg-slate-900/70 backdrop-blur-lg rounded-xl border border-slate-700/50 p-5 flex flex-col">
          <h3 className="text-lg font-medium text-slate-200 mb-3 pb-3 border-b border-slate-700/50">
            Product Packaging
          </h3>
          <div className="space-y-4 text-sm text-slate-300 flex-1">
            <p>
              Upload your product model or use our sample to design optimal packaging that protects your product during shipping and handling.
            </p>
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h4 className="font-medium text-blue-400 mb-2">Supported Features:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 text-blue-400"><PackageCheck size={16} /></div>
                  <span>Custom packaging generation</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 text-blue-400"><PackageCheck size={16} /></div>
                  <span>Drop test simulations</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 text-blue-400"><PackageCheck size={16} /></div>
                  <span>Transportation simulation</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 text-blue-400"><PackageCheck size={16} /></div>
                  <span>Stress & impact visualization</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 text-blue-400"><PackageCheck size={16} /></div>
                  <span>Design optimization</span>
                </li>
              </ul>
            </div>
            <p className="text-slate-400 text-xs mt-auto pt-4">
              Supported formats: STL, STEP/STP
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PackagingUploadView;