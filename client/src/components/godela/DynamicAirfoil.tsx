import React from 'react';

interface DynamicAirfoilProps {
  angleOfAttack: number;
  thickness: number;
  width?: number;
  height?: number;
}

const DynamicAirfoil: React.FC<DynamicAirfoilProps> = ({
  angleOfAttack,
  thickness,
  width = 400,
  height = 200
}) => {
  // Airfoil parameters
  const chordLength = width * 0.7;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Thickness calculation (NACA airfoil style)
  const maxThickness = chordLength * thickness;
  
  // Generate NACA-like airfoil points
  const generateAirfoilPoints = () => {
    const points = [];
    const numPoints = 50;
    
    // Upper surface
    for (let i = 0; i <= numPoints; i++) {
      const x = i / numPoints;
      const chord = x * chordLength;
      // NACA thickness distribution (simplified)
      let yt = 5 * maxThickness * (0.2969 * Math.sqrt(x) - 0.1260 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1015 * x * x * x * x);
      
      // Optional: Add camber here for more complex airfoils
      
      points.push({
        x: centerX - chordLength / 2 + chord,
        y: centerY - yt
      });
    }
    
    // Lower surface (reverse)
    for (let i = numPoints; i >= 0; i--) {
      const x = i / numPoints;
      const chord = x * chordLength;
      // NACA thickness distribution (same formula, opposite sign)
      let yt = 5 * maxThickness * (0.2969 * Math.sqrt(x) - 0.1260 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1015 * x * x * x * x);
      
      // Optional: Add camber here for more complex airfoils
      
      points.push({
        x: centerX - chordLength / 2 + chord,
        y: centerY + yt
      });
    }
    
    return points;
  };
  
  // Generate flow streamlines that wrap around the airfoil
  const generateStreamlines = () => {
    const lines = [];
    const numLines = 8;
    const lineSpacing = height / (numLines + 1);
    
    // Calculate the effective thickness for streamline displacement
    const effectiveThickness = chordLength * thickness * 1.5;
    
    // Set bounds to contain streamlines within the viewport
    const padding = 10; // Increase padding to keep streamlines further from edges
    const minY = padding;
    const maxY = height - padding;
    
    // Reduced horizontal space for streamlines to prevent overflow
    const horizPadding = 5;
    const streamlineWidth = width - (horizPadding * 2);
    
    for (let i = 1; i <= numLines; i++) {
      // Adjust starting point to be further from the edges
      const y = i * lineSpacing;
      
      // Only create streamlines that start clearly within bounds
      if (y >= minY && y <= maxY) {
        const distanceFromCenter = Math.abs(y - centerY);
        const isAffectedByAirfoil = distanceFromCenter < effectiveThickness * 2;
        
        // Create streamline points
        const streamlinePoints = [];
        const numPoints = 100;
        
        for (let j = 0; j <= numPoints; j++) {
          // Make sure x values are within the reduced horizontal space
          const x = horizPadding + (j / numPoints) * streamlineWidth;
          let streamY = y;
          
          // If this streamline is close enough to be affected by the airfoil
          if (isAffectedByAirfoil) {
            // Create a displaced path around the airfoil
            // This is a simplified version of flow around an airfoil
            const distanceFromLeadingEdge = Math.abs(x - (centerX - chordLength / 2));
            const distanceFromTrailingEdge = Math.abs(x - (centerX + chordLength / 2));
            const isNearAirfoil = x >= (centerX - chordLength / 2 - 10) && x <= (centerX + chordLength / 2 + 20);
            
            if (isNearAirfoil) {
              // Calculate displacement due to airfoil thickness
              // Maximum displacement in the middle, tapering to zero at leading/trailing edges
              let displacementFactor = 0;
              
              // Distance from leading edge normalized to [0, 1] over the chord
              const chordPosition = (x - (centerX - chordLength / 2)) / chordLength;
              
              if (chordPosition >= 0 && chordPosition <= 1) {
                // NACA-like thickness distribution for displacement
                displacementFactor = 5 * thickness * (0.2969 * Math.sqrt(chordPosition) - 0.1260 * chordPosition - 
                  0.3516 * Math.pow(chordPosition, 2) + 0.2843 * Math.pow(chordPosition, 3) - 0.1015 * Math.pow(chordPosition, 4));
                  
                // Scale it up a bit but limit to prevent overflow
                displacementFactor *= 2 * chordLength;
              } else if (chordPosition > 1 && chordPosition < 1.1) {
                // Taper off displacement after trailing edge, with reduced magnitude
                displacementFactor = 5 * thickness * 0.01 * (1.1 - chordPosition) * 8 * chordLength;
              }
              
              // Apply displacement depending on whether streamline is above or below airfoil
              const displacementSign = y < centerY ? -1 : 1;
              
              // Reduce the displacement for lines very close to edges
              const edgeProximity = Math.min(y - minY, maxY - y) / padding;
              const edgeScaleFactor = Math.min(1, edgeProximity);
              
              // Apply scaled displacement based on edge proximity
              const displacement = displacementSign * displacementFactor * edgeScaleFactor;
              
              // Add angle of attack effect with reduced magnitude
              const aoaEffect = Math.sin(angleOfAttack * Math.PI / 180) * chordLength * 0.04 * (y < centerY ? -1 : 0.5) * edgeScaleFactor;
              
              streamY = y + displacement + aoaEffect;
              
              // Strict constraint on streamline position to stay within bounds
              streamY = Math.max(minY, Math.min(maxY, streamY));
            }
          }
          
          // Only add the point if it's within bounds
          if (x >= 0 && x <= width && streamY >= 0 && streamY <= height) {
            streamlinePoints.push({ x, y: streamY });
          }
        }
        
        // Only add streamlines that have points
        if (streamlinePoints.length > 0) {
          lines.push({
            points: streamlinePoints,
            isMiddle: Math.abs(y - centerY) < lineSpacing / 2,
            isAffectedByAirfoil
          });
        }
      }
    }
    
    return lines;
  };
  
  // Convert points array to SVG path string
  const getPathFromPoints = (points: {x: number, y: number}[]) => {
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    path += ' Z';
    return path;
  };
  
  // Apply the angle of attack rotation transformation
  const getRotationTransform = () => {
    return `rotate(${angleOfAttack}, ${centerX}, ${centerY})`;
  };
  
  // Get flow direction based on angle of attack
  const getFlowDirection = () => {
    // Flow visualization is always horizontal, airfoil rotates to show AoA
    return { x: -1, y: 0 };
  };
  
  const airfoilPoints = generateAirfoilPoints();
  const airfoilPath = getPathFromPoints(airfoilPoints);
  const streamlines = generateStreamlines();
  const flowDirection = getFlowDirection();
  
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="overflow-hidden max-w-full max-h-full"
      style={{ display: 'block' }}
    >
      {/* Background grid (optional) */}
      <defs>
        {/* Grid patterns */}
        <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#253045" strokeWidth="0.5" opacity="0.3" />
        </pattern>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="url(#smallGrid)" />
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#253045" strokeWidth="1" opacity="0.2" />
        </pattern>
        
        {/* Clipping path for streamlines */}
        <clipPath id="airfoilBoxClip">
          <rect x="0" y="0" width={width} height={height} />
        </clipPath>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill="url(#grid)" />
      
      {/* Flow direction indicator */}
      <g transform={`translate(${width * 0.1}, ${height / 2})`}>
        <path
          d="M 0,0 L 20,0 L 16,-4 M 20,0 L 16,4"
          stroke="#4F87FF"
          strokeWidth="2"
          fill="none"
        />
        <text x="0" y="-10" fill="#4F87FF" fontSize="12" fontWeight="500">Flow</text>
      </g>
      
      {/* Flow streamlines - rendered before airfoil so they appear to go behind it */}
      <g clipPath="url(#airfoilBoxClip)">
        {streamlines.map((line, index) => (
          <g key={`streamline-${index}`}>
            <path
              d={line.points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')}
              stroke="#3B4B6A"
              strokeWidth={line.isMiddle ? 1.5 : 1}
              strokeDasharray="5,5"
              fill="none"
              opacity={line.isMiddle ? 0.8 : (line.isAffectedByAirfoil ? 0.7 : 0.4)}
            />
          </g>
        ))}
      </g>
      
      {/* Airfoil with rotation - rendered after streamlines so it appears on top */}
      <g transform={getRotationTransform()}>
        {/* Chord line (reference) */}
        <line
          x1={centerX - chordLength / 2}
          y1={centerY}
          x2={centerX + chordLength / 2}
          y2={centerY}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1"
          strokeDasharray="3,2"
        />
        
        {/* Quarter-chord marker */}
        <circle
          cx={centerX - chordLength / 4}
          cy={centerY}
          r="3"
          fill="white"
          opacity="0.6"
        />
        <text
          x={centerX - chordLength / 4}
          y={centerY - 8}
          fill="white"
          fontSize="10"
          textAnchor="middle"
          opacity="0.8"
        >
          c/4
        </text>
        
        {/* Max thickness indicator */}
        <line
          x1={centerX}
          y1={centerY - maxThickness / 2 - 5}
          x2={centerX}
          y2={centerY + maxThickness / 2 + 5}
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1"
          strokeDasharray="3,2"
        />
        <text
          x={centerX + 5}
          y={centerY}
          fill="white"
          fontSize="10"
          opacity="0.8"
        >
          t/c
        </text>
        
        {/* Airfoil shape */}
        <path
          d={airfoilPath}
          fill="url(#airfoilGradient)"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="1"
        />
        
        {/* Create gradient for airfoil */}
        <defs>
          <linearGradient id="airfoilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#84A9FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3456BF" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </g>
      
      {/* Angle of attack indicator */}
      {angleOfAttack !== 0 && (
        <g>
          <path
            d={`M ${centerX - 30} ${centerY} A 30 30 0 0 ${angleOfAttack > 0 ? 0 : 1} ${centerX - 30 * Math.cos(angleOfAttack * Math.PI / 180)} ${centerY - 30 * Math.sin(angleOfAttack * Math.PI / 180)}`}
            fill="none"
            stroke="#FFD54F"
            strokeWidth="1.5"
            strokeDasharray="2,2"
          />
          <text
            x={centerX - 45}
            y={centerY - 15}
            fill="#FFD54F"
            fontSize="12"
            fontWeight="500"
          >
            α = {angleOfAttack}°
          </text>
        </g>
      )}
      
      {/* Airfoil info */}
      <text
        x={width - 10}
        y={height - 10}
        fill="rgba(255, 255, 255, 0.7)"
        fontSize="10"
        textAnchor="end"
      >
        NACA 00{Math.round(thickness * 100)}
      </text>
    </svg>
  );
};

export default DynamicAirfoil;