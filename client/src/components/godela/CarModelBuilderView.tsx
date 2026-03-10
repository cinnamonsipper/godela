/**
 * Car Model Builder View
 * 
 * This component handles the configuration of simulation parameters
 * for car aerodynamics simulations using NVIDIA Modulus.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Settings, Wind, Layers, BarChart4 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import useDemoStore from '@/store/useDemoStore';
import { DEFAULT_SIMULATION_PARAMS } from '@/lib/modulusSchemas';

export default function CarModelBuilderView() {
  const { nextDemoStep } = useDemoStore();
  
  // Simulation parameters with default values from modulusSchemas
  const [streamVelocity, setStreamVelocity] = useState(DEFAULT_SIMULATION_PARAMS.streamVelocity);
  const [stencilSize, setStencilSize] = useState(DEFAULT_SIMULATION_PARAMS.stencilSize);
  const [pointCloudSize, setPointCloudSize] = useState(DEFAULT_SIMULATION_PARAMS.pointCloudSize);

  // Handle continue button click
  const handleContinue = () => {
    // In a real implementation, we'd save these parameters
    // For this demo, we'll just move to the next step
    nextDemoStep();
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
            <Settings className="mr-2 text-blue-400" size={20} />
            Simulation Parameters
          </h2>
          
          <p className="text-gray-400 mb-6 text-sm">
            Configure the parameters for your car aerodynamics simulation.
            These settings control the physics model and resolution of the results.
          </p>
          
          <div className="space-y-8">
            {/* Stream Velocity Parameter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Wind size={18} className="mr-2 text-blue-400" />
                  <label className="text-sm font-medium">Stream Velocity</label>
                </div>
                <span className="text-sm text-blue-300">{streamVelocity} m/s</span>
              </div>
              <Slider
                value={[streamVelocity]}
                min={10}
                max={100}
                step={5}
                onValueChange={(value) => setStreamVelocity(value[0])}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                The speed of the airflow around the car (10-100 m/s)
              </p>
            </div>
            
            {/* Stencil Size Parameter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Layers size={18} className="mr-2 text-blue-400" />
                  <label className="text-sm font-medium">Stencil Size</label>
                </div>
                <span className="text-sm text-blue-300">{stencilSize}</span>
              </div>
              <Slider
                value={[stencilSize]}
                min={1}
                max={3}
                step={1}
                onValueChange={(value) => setStencilSize(value[0])}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                Controls resolution around the car's surface (larger values increase accuracy but take longer)
              </p>
            </div>
            
            {/* Point Cloud Size Parameter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <BarChart4 size={18} className="mr-2 text-blue-400" />
                  <label className="text-sm font-medium">Point Cloud Size</label>
                </div>
                <span className="text-sm text-blue-300">{pointCloudSize.toLocaleString()}</span>
              </div>
              <Slider
                value={[pointCloudSize]}
                min={5000}
                max={50000}
                step={5000}
                onValueChange={(value) => setPointCloudSize(value[0])}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of points in the simulation (5,000-50,000 points)
              </p>
            </div>
          </div>
          
          <div className="flex justify-end mt-8">
            <Button
              onClick={handleContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <span>Run Simulation</span>
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
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-medium">Simulation Details</h3>
            <div className="text-xs text-gray-400 space-y-2">
              <div className="flex justify-between">
                <span>Physics Model:</span>
                <span className="text-blue-300">RANS (Reynolds-Averaged Navier-Stokes)</span>
              </div>
              <div className="flex justify-between">
                <span>Turbulence Model:</span>
                <span className="text-blue-300">k-ω SST</span>
              </div>
              <div className="flex justify-between">
                <span>Boundary Conditions:</span>
                <span className="text-blue-300">Velocity inlet, Pressure outlet</span>
              </div>
              <div className="flex justify-between">
                <span>Fluid Medium:</span>
                <span className="text-blue-300">Air at 25°C (1.225 kg/m³)</span>
              </div>
              <div className="flex justify-between">
                <span>Neural Network:</span>
                <span className="text-blue-300">Physics-Informed Neural Network (PINN)</span>
              </div>
              <div className="flex justify-between">
                <span>Inference Time:</span>
                <span className="text-blue-300">~30 seconds</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}