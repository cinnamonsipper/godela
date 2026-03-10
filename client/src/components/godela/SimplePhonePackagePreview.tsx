import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Types for the component props
export type PackageStyle = 'slim-fit-mailer' | 'molded-pulp' | 'cushioned-envelope' | 'premium-box' | 'eco-waffle';
export type MaterialType = 'kraft' | 'white-recycled' | 'molded-pulp';
export type ProtectionLevel = 'standard' | 'enhanced';

interface SimplePhonePackagePreviewProps {
  style: PackageStyle;
  material: MaterialType;
  protectionLevel: ProtectionLevel;
  recycledContent: number;
  brandColor: string;
  showPhone: boolean;
  showPackage: boolean;
  className?: string;
}

/**
 * A simplified phone package preview that doesn't rely on React Three Fiber
 * This version uses CSS 3D transforms and styling to achieve a similar visual effect
 */
const SimplePhonePackagePreview: React.FC<SimplePhonePackagePreviewProps> = ({
  style,
  material,
  protectionLevel,
  recycledContent,
  brandColor,
  showPhone,
  showPackage,
  className = ''
}) => {
  const [rotation, setRotation] = useState({ x: 20, y: 30 });
  
  // Handle mouse movement for interactive rotation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    
    // Calculate rotation based on mouse position
    const newRotationY = ((e.clientX - centerX) / bounds.width) * 40;
    const newRotationX = ((e.clientY - centerY) / bounds.height) * 40;
    
    setRotation({
      x: newRotationX,
      y: newRotationY
    });
  };

  // Determine colors based on material type
  const getMaterialColors = () => {
    switch (material) {
      case 'kraft':
        return {
          main: '#d2b48c',
          highlight: '#e5d3b3',
          shadow: '#a89070'
        };
      case 'white-recycled':
        return {
          main: '#f5f5f5',
          highlight: '#ffffff',
          shadow: '#e0e0e0'
        };
      case 'molded-pulp':
        return {
          main: '#e0d5c0',
          highlight: '#f0e8d8',
          shadow: '#c8bea8'
        };
      default:
        return {
          main: '#f5f5f5',
          highlight: '#ffffff',
          shadow: '#e0e0e0'
        };
    }
  };
  
  // Get adjusted dimensions based on protection level
  const getDimensions = () => {
    const baseWidth = style === 'cushioned-envelope' ? 80 : 70;
    const baseHeight = style === 'cushioned-envelope' ? 130 : 120;
    const baseDepth = style === 'cushioned-envelope' ? 10 : 20;
    
    const adjustment = protectionLevel === 'enhanced' ? 1.15 : 1;
    
    return {
      width: baseWidth * adjustment,
      height: baseHeight * adjustment,
      depth: baseDepth * adjustment
    };
  };
  
  // Get material texture pattern
  const getMaterialPattern = () => {
    switch (material) {
      case 'kraft':
        return `radial-gradient(circle, transparent 30%, rgba(0,0,0,0.1) 30%)`;
      case 'white-recycled':
        return `linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.05) 75%)`;
      case 'molded-pulp':
        return `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 60%)`;
      default:
        return 'none';
    }
  };
  
  const colors = getMaterialColors();
  const dimensions = getDimensions();
  const pattern = getMaterialPattern();
  
  // Apply brand color tint
  const applyBrandColorTint = (baseColor: string) => {
    // Simple color mixing - in a real app, this would be more sophisticated
    return baseColor;
  };
  
  const renderPackageByStyle = () => {
    switch (style) {
      case 'slim-fit-mailer':
        return (
          <div 
            className="relative w-full h-full" 
            style={{
              perspective: '800px',
              transformStyle: 'preserve-3d'
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.2s ease-out'
              }}
            >
              {/* Box front */}
              <div
                className="absolute transform-gpu"
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  transform: `translateZ(${dimensions.depth / 2}px)`,
                  backgroundColor: applyBrandColorTint(colors.main),
                  backgroundImage: pattern,
                  backgroundSize: '10px 10px',
                  border: `1px solid ${colors.shadow}`,
                  borderRadius: '4px',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                }}
              ></div>
              
              {/* Box back */}
              <div
                className="absolute transform-gpu"
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  transform: `translateZ(${-dimensions.depth / 2}px) rotateY(180deg)`,
                  backgroundColor: applyBrandColorTint(colors.main),
                  backgroundImage: pattern,
                  backgroundSize: '10px 10px',
                  border: `1px solid ${colors.shadow}`,
                  borderRadius: '4px',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                }}
              ></div>
              
              {/* Box sides */}
              <div
                className="absolute transform-gpu"
                style={{
                  width: `${dimensions.depth}px`,
                  height: `${dimensions.height}px`,
                  transform: `translateX(${dimensions.width / 2 - dimensions.depth / 2}px) rotateY(90deg)`,
                  backgroundColor: applyBrandColorTint(colors.highlight),
                  backgroundImage: pattern,
                  backgroundSize: '10px 10px',
                  border: `1px solid ${colors.shadow}`,
                  borderRadius: '4px',
                }}
              ></div>
              
              <div
                className="absolute transform-gpu"
                style={{
                  width: `${dimensions.depth}px`,
                  height: `${dimensions.height}px`,
                  transform: `translateX(${-dimensions.width / 2 + dimensions.depth / 2}px) rotateY(-90deg)`,
                  backgroundColor: applyBrandColorTint(colors.highlight),
                  backgroundImage: pattern,
                  backgroundSize: '10px 10px',
                  border: `1px solid ${colors.shadow}`,
                  borderRadius: '4px',
                }}
              ></div>
              
              {/* Box top and bottom */}
              <div
                className="absolute transform-gpu"
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.depth}px`,
                  transform: `translateY(${-dimensions.height / 2 + dimensions.depth / 2}px) rotateX(90deg)`,
                  backgroundColor: applyBrandColorTint(colors.shadow),
                  backgroundImage: pattern,
                  backgroundSize: '10px 10px',
                  border: `1px solid ${colors.shadow}`,
                  borderRadius: '4px',
                }}
              ></div>
              
              <div
                className="absolute transform-gpu"
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.depth}px`,
                  transform: `translateY(${dimensions.height / 2 - dimensions.depth / 2}px) rotateX(-90deg)`,
                  backgroundColor: applyBrandColorTint(colors.shadow),
                  backgroundImage: pattern,
                  backgroundSize: '10px 10px',
                  border: `1px solid ${colors.shadow}`,
                  borderRadius: '4px',
                }}
              ></div>
              
              {/* Phone inside box if both are visible */}
              {showPhone && showPackage && (
                <div 
                  className="absolute transform-gpu"
                  style={{
                    width: '40px',
                    height: '80px',
                    transform: 'translateZ(0)',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    boxShadow: '0 0 10px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Phone screen */}
                  <div
                    className="absolute inset-1 bg-black rounded-lg overflow-hidden"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
                    }}
                  ></div>
                </div>
              )}
              
              {/* Only phone if package isn't shown */}
              {showPhone && !showPackage && (
                <div 
                  className="absolute transform-gpu"
                  style={{
                    width: '50px',
                    height: '100px',
                    transform: 'translateZ(0)',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Phone screen */}
                  <div
                    className="absolute inset-1 bg-gray-900 rounded-lg overflow-hidden"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
                    }}
                  ></div>
                  
                  {/* Home button */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-gray-800 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'molded-pulp':
        return (
          <div 
            className="relative w-full h-full" 
            style={{
              perspective: '800px',
              transformStyle: 'preserve-3d'
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.2s ease-out'
              }}
            >
              {/* Base tray */}
              <div
                className="absolute transform-gpu rounded-lg"
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  transform: `translateZ(${-dimensions.depth / 3}px)`,
                  backgroundColor: colors.main,
                  backgroundImage: `radial-gradient(circle at 30% 30%, ${colors.highlight} 0%, ${colors.main} 60%)`,
                  backgroundSize: '20px 20px',
                  border: `1px solid ${colors.shadow}`,
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)'
                }}
              >
                {/* Inner cavity */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md"
                  style={{
                    width: '55px',
                    height: '95px',
                    backgroundColor: colors.shadow,
                    backgroundImage: `radial-gradient(circle at 30% 30%, ${colors.main} 0%, ${colors.shadow} 60%)`,
                    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)'
                  }}
                ></div>
              </div>
              
              {/* Sleeve */}
              <div
                className="absolute transform-gpu rounded-lg"
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  transform: `translateZ(${dimensions.depth / 4}px)`,
                  backgroundColor: brandColor !== '#a78bfa' ? brandColor : colors.highlight,
                  opacity: 0.9,
                  border: `1px solid ${colors.shadow}`,
                  boxShadow: '0 0 15px rgba(0,0,0,0.1)'
                }}
              ></div>
              
              {/* Phone if visible */}
              {showPhone && (
                <div 
                  className="absolute transform-gpu"
                  style={{
                    width: '50px',
                    height: '90px',
                    transform: 'translateZ(2px)',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Phone screen */}
                  <div
                    className="absolute inset-1 bg-gray-900 rounded-lg overflow-hidden"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
                    }}
                  ></div>
                  
                  {/* Home button */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-gray-800 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'cushioned-envelope':
        return (
          <div 
            className="relative w-full h-full" 
            style={{
              perspective: '800px',
              transformStyle: 'preserve-3d'
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.2s ease-out'
              }}
            >
              {/* Envelope back */}
              <div
                className="absolute transform-gpu"
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  transform: `translateZ(${-dimensions.depth / 2}px)`,
                  backgroundColor: applyBrandColorTint(colors.main),
                  backgroundImage: pattern,
                  backgroundSize: '15px 15px',
                  border: `1px solid ${colors.shadow}`,
                  borderRadius: '8px',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                }}
              ></div>
              
              {/* Bubble lining inside */}
              <div
                className="absolute transform-gpu"
                style={{
                  width: `${dimensions.width * 0.9}px`,
                  height: `${dimensions.height * 0.9}px`,
                  left: `${dimensions.width * 0.05}px`,
                  top: `${dimensions.height * 0.05}px`,
                  transform: 'translateZ(-2px)',
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  backgroundImage: `radial-gradient(circle, transparent 30%, rgba(0,0,0,0.05) 30%)`,
                  backgroundSize: '10px 10px',
                  borderRadius: '6px',
                }}
              ></div>
              
              {/* Envelope front (semi-transparent to see contents) */}
              <div
                className="absolute transform-gpu"
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  transform: `translateZ(${dimensions.depth / 2}px)`,
                  backgroundColor: brandColor !== '#a78bfa' ? brandColor : applyBrandColorTint(colors.main),
                  backgroundImage: pattern,
                  backgroundSize: '15px 15px',
                  border: `1px solid ${colors.shadow}`,
                  borderRadius: '8px',
                  boxShadow: '0 0 15px rgba(0,0,0,0.1)',
                  opacity: 0.7
                }}
              ></div>
              
              {/* Phone if visible */}
              {showPhone && (
                <div 
                  className="absolute transform-gpu"
                  style={{
                    width: '50px',
                    height: '90px',
                    transform: 'translateZ(0)',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Phone screen */}
                  <div
                    className="absolute inset-1 bg-gray-900 rounded-lg overflow-hidden"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
                    }}
                  ></div>
                  
                  {/* Home button */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-gray-800 rounded-full"></div>
                </div>
              )}
              
              {/* Enhanced protection corner buffers */}
              {protectionLevel === 'enhanced' && (
                <>
                  <div className="absolute top-5 left-5 w-16 h-16 border-t-2 border-l-2 border-white/30 rounded-tl-xl transform-gpu"></div>
                  <div className="absolute top-5 right-5 w-16 h-16 border-t-2 border-r-2 border-white/30 rounded-tr-xl transform-gpu"></div>
                  <div className="absolute bottom-5 left-5 w-16 h-16 border-b-2 border-l-2 border-white/30 rounded-bl-xl transform-gpu"></div>
                  <div className="absolute bottom-5 right-5 w-16 h-16 border-b-2 border-r-2 border-white/30 rounded-br-xl transform-gpu"></div>
                </>
              )}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400">Select a package style</p>
          </div>
        );
    }
  };
  
  return (
    <div 
      className={`${className} relative w-full h-full bg-gradient-to-b from-slate-900 to-slate-950`}
      onMouseMove={handleMouseMove}
    >
      {/* Ambient lighting effects */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-[30%] left-[40%] w-40 h-40 bg-blue-500/10 rounded-full filter blur-2xl"></div>
        <div className="absolute bottom-[20%] right-[30%] w-32 h-32 bg-indigo-500/10 rounded-full filter blur-2xl"></div>
      </div>
      
      {/* Preview container */}
      <div className="relative w-full h-full">
        {showPackage ? renderPackageByStyle() : showPhone && (
          <div className="flex items-center justify-center h-full">
            <div 
              className="relative"
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.2s ease-out'
              }}
            >
              <div 
                className="w-16 h-28 bg-gray-900 rounded-xl mx-auto shadow-2xl"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
                }}
              >
                <div className="absolute inset-1 rounded-lg overflow-hidden bg-black/20"></div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-800 rounded-full"></div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-800 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplePhonePackagePreview;