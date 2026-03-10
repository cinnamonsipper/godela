/**
 * Car Data Processing View
 * 
 * This component handles file uploads for car aerodynamics simulation,
 * allowing users to upload STL/CAD files or use sample data.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, FileType, Car, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useDemoStore from '@/store/useDemoStore';

export default function CarDataProcessingView() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { nextDemoStep } = useDemoStore();

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Check if file is an STL or CAD file
      if (file.name.endsWith('.stl') || file.name.endsWith('.obj') || file.name.endsWith('.step') || file.name.endsWith('.stp')) {
        setUploadedFile(file);
      } else {
        alert('Please upload an STL, OBJ, or STEP file.');
      }
    }
  };

  // Handle file selection via input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file type
      if (file.name.endsWith('.stl') || file.name.endsWith('.obj') || file.name.endsWith('.step') || file.name.endsWith('.stp')) {
        setUploadedFile(file);
      } else {
        alert('Please upload an STL, OBJ, or STEP file.');
      }
    }
  };

  // Handle use of sample data
  const handleUseSample = () => {
    // Skip the upload and move to the next step
    nextDemoStep();
  };

  // Handle continue button click
  const handleContinue = () => {
    // When a file is uploaded, process it
    if (uploadedFile) {
      // In a real implementation, we'd upload the file to a server here
      // For this demo, we'll just move to the next step
      nextDemoStep();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#10131E] to-[#0A0D14] text-white p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#161927]/70 backdrop-blur-sm border border-[#2A2F3F] rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-medium mb-4 flex items-center">
            <Car className="mr-2 text-blue-400" size={20} />
            Car Design Upload
          </h2>
          
          <p className="text-gray-400 mb-4 text-sm">
            Upload your car design as an STL, OBJ, or STEP file to analyze its aerodynamic performance.
            The simulation will calculate pressure distribution, drag, lift, and visualize airflow patterns.
          </p>
          
          <div className="mb-6">
            <div 
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-[#2A2F3F] hover:border-blue-400/50 hover:bg-[#1A1E2E]'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <input 
                type="file" 
                id="fileInput" 
                className="hidden" 
                onChange={handleChange}
                accept=".stl,.obj,.step,.stp"
              />
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#1A1E2E] rounded-full flex items-center justify-center mb-3">
                  <Upload size={24} className="text-blue-400" />
                </div>
                <p className="text-sm font-medium mb-1">Drag and drop your 3D model file here</p>
                <p className="text-xs text-gray-400 mb-2">or click to browse files</p>
                <p className="text-xs text-gray-500">Supported formats: STL, OBJ, STEP</p>
              </div>
            </div>
          </div>
          
          {uploadedFile && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-[#1A1E2E] border border-[#2A2F3F] rounded-lg p-4 mb-4"
            >
              <div className="flex items-center">
                <div className="mr-3 w-10 h-10 bg-blue-900/30 rounded-md flex items-center justify-center">
                  <FileType size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-400">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="flex flex-col gap-3 sm:flex-row justify-between mt-6">
            <Button
              onClick={handleUseSample}
              className="bg-[#1A1E2E] border border-[#2A2F3F] hover:bg-[#222940] text-white"
            >
              Use Sample Car Design
            </Button>
            
            <Button
              onClick={handleContinue}
              disabled={!uploadedFile}
              className={!uploadedFile ? "bg-blue-700/50 text-blue-200/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}
            >
              <span>Continue</span>
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#161927]/70 backdrop-blur-sm border border-[#2A2F3F] rounded-xl p-6"
        >
          <div className="flex items-start">
            <AlertTriangle size={20} className="text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium mb-2">Important Information</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                For simulation accuracy, ensure your CAD model:
                <br />• Has clean, manifold geometry with no holes or self-intersections
                <br />• Is properly scaled (dimensions in meters)
                <br />• Has appropriate detail level (between 10,000-100,000 triangles recommended)
                <br />• Is oriented with the flow direction along the x-axis
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}