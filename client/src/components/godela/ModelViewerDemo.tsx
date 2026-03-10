import React from 'react';
import SimpleModelChat from './SimpleModelChat';

interface ModelViewerDemoProps {
  onStepComplete: (response: string) => void;
  expectedResponse?: string;
}

export default function ModelViewerDemo({ onStepComplete, expectedResponse = '' }: ModelViewerDemoProps) {
  // Return SimpleModelChat with any props it might need
  return (
    <div className="h-full w-full">
      <SimpleModelChat />
    </div>
  );
}