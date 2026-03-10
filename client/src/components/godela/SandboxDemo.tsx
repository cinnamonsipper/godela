import React from 'react';
import SimpleSandboxChat from './SimpleSandboxChat';

interface SandboxDemoProps {
  onStepComplete?: (response: string) => void;
  expectedResponse?: string;
}

/**
 * Sandbox Demo Component
 * 
 * This is a completely separate demo path for experimentation with the chat interface.
 * It follows a similar pattern to the ModelViewerDemo but allows for isolated development
 * and testing without affecting the other demo paths.
 */
export default function SandboxDemo({ onStepComplete, expectedResponse = '' }: SandboxDemoProps) {
  return (
    <div className="h-full w-full">
      <SimpleSandboxChat />
    </div>
  );
}