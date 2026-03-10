import React from 'react';
import useDemoStore, { DemoPath } from '@/store/useDemoStore';

export default function DemoPathTester() {
  const { setDemoPath, nextDemoStep } = useDemoStore();

  const startDemo = (path: DemoPath) => {
    console.log(`Starting demo path: ${path}`);
    setDemoPath(path);
    nextDemoStep();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600 shadow-lg">
      <h3 className="text-white font-medium mb-3">Demo Path Tester</h3>
      <div className="flex flex-col space-y-2">
        <button 
          onClick={() => startDemo('airfoil')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
        >
          Start Airfoil Demo
        </button>
        <button 
          onClick={() => startDemo('heat-exchanger')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
        >
          Start Heat Exchanger Demo
        </button>
      </div>
    </div>
  );
}