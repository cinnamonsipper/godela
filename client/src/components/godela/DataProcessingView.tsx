import React, { useState } from 'react';
import ProgressHeader from './ProgressHeader';
import useDemoStore from '@/store/useDemoStore';

export default function DataProcessingView() {
  const { nextDemoStep } = useDemoStore();
  const [uploadComplete, setUploadComplete] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const handleSimulateUpload = () => {
    setUploadComplete(true);
    
    // Simulate processing completion after a short delay
    setTimeout(() => {
      setProcessingComplete(true);
    }, 1500);
  };
  
  const handleConfirmData = () => {
    nextDemoStep();
  };
  
  // Data parameters detected (for confirmation)
  const dataParameters = {
    inputs: [
      { name: "Angle of Attack (α)", unit: "degrees", range: "0° to 15°" },
      { name: "Thickness Ratio (t/c)", unit: "", range: "0.06 to 0.18" },
      { name: "Reynolds Number (Re)", unit: "×10⁶", range: "0.5 to 5.0" }
    ],
    outputs: [
      { name: "Lift Coefficient (CL)", unit: "", range: "0.0 to 2.0" },
      { name: "Drag Coefficient (CD)", unit: "", range: "0.0065 to 0.0300" }
    ]
  };
  
  return (
    <div className="flex flex-col h-full p-6 bg-[#10131E]">
      <ProgressHeader title="Data Processing" />
      
      <div className="text-sm text-blue-300 mb-6">
        Please upload your airfoil performance data to continue
      </div>
      
      {!uploadComplete ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-[#0D1017] rounded-lg p-8 border border-dashed border-[#3B82F6] w-full max-w-md">
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="text-lg font-medium text-blue-200 mb-2">Upload your current design</h3>
              <p className="text-sm text-gray-400 text-center mb-4">
                Please upload your current aircraft design file (STL, OBJ, or any mock file for demo purposes).
              </p>
              <input
                type="file"
                className="mb-4"
                onChange={handleSimulateUpload}
              />
            </div>
          </div>
        </div>
      ) : !processingComplete ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-[#0D1017] rounded-lg p-8 border border-[#3B82F6] w-full max-w-md flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2l4-4" />
            </svg>
            <h3 className="text-lg font-medium text-green-300 mb-2">File upload successful!</h3>
            <p className="text-sm text-gray-400 text-center mb-6">In a real workflow, your 3D aircraft design file would be processed here.</p>
            <button 
              onClick={() => setProcessingComplete(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-md shadow-md hover:from-indigo-700 hover:to-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex justify-center">
          {/* Parameters Confirmation */}
          <div className="flex flex-col max-w-lg w-full">
            <div className="bg-[#0D1017] rounded-lg p-6 border border-[#1A2030] shadow-md mb-6 animate-fadeInUp">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-blue-200">Confirm Data Parameters</h3>
                <div className="px-2 py-1 bg-indigo-900/50 text-indigo-300 text-xs rounded">
                  Verification Required
                </div>
              </div>
              
              <p className="text-sm text-blue-300 mb-4">
                We detected the following input and output parameters in your data. Please confirm they are correct:
              </p>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-indigo-300 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Input Parameters:
                </h4>
                <div className="bg-[#0A0E18] rounded-lg p-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#1A2030]">
                        <th className="text-left py-2 text-gray-400 font-medium">Parameter</th>
                        <th className="text-left py-2 text-gray-400 font-medium">Unit</th>
                        <th className="text-left py-2 text-gray-400 font-medium">Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataParameters.inputs.map((param, index) => (
                        <tr key={index} className="border-b border-[#1A2030] last:border-0">
                          <td className="py-2 text-blue-300">{param.name}</td>
                          <td className="py-2 text-gray-300">{param.unit}</td>
                          <td className="py-2 text-gray-300">{param.range}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-indigo-300 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Output Parameters:
                </h4>
                <div className="bg-[#0A0E18] rounded-lg p-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#1A2030]">
                        <th className="text-left py-2 text-gray-400 font-medium">Parameter</th>
                        <th className="text-left py-2 text-gray-400 font-medium">Unit</th>
                        <th className="text-left py-2 text-gray-400 font-medium">Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataParameters.outputs.map((param, index) => (
                        <tr key={index} className="border-b border-[#1A2030] last:border-0">
                          <td className="py-2 text-blue-300">{param.name}</td>
                          <td className="py-2 text-gray-300">{param.unit}</td>
                          <td className="py-2 text-gray-300">{param.range}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-[#101522] border border-[#1A2030] rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-indigo-300 mb-2">Data Processing Summary:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Removed 2 outlier points with anomalous CD values</li>
                  <li>• Applied Min-Max scaling to inputs</li>
                  <li>• Created derived features: AoA², Re·t/c</li>
                  <li>• Split: 80% training, 20% validation</li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-md shadow-md hover:from-indigo-700 hover:to-blue-700 transition-colors"
                  onClick={handleConfirmData}
                  disabled={!processingComplete}
                >
                  {processingComplete ? "Confirm Parameters" : "Processing..."}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}