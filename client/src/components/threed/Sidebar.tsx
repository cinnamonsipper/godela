import React from 'react';
import { 
  Layers, 
  Play, 
  Pause, 
  RotateCw, 
  Grid, 
  Axis3d 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Sidebar: React.FC = () => {
  const {
    togglePlayback,
    resetAnimation,
    isPlaying,
    showGrid,
    showAxes,
    setShowGrid,
    setShowAxes,
    renderMode,
    setRenderMode,
    wireframeOpacity,
    setWireframeOpacity,
    wireframeColor,
    setWireframeColor,
    faceOpacity,
    setFaceOpacity,
    animationProgress,
    setAnimationProgress,
    animations,
    animationSpeed,
    setAnimationSpeed,
    selectedAnimations,
    toggleAnimationSelection,
  } = useApp();
  
  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-slate-900 border-r border-slate-800">
      <div className="p-4 border-b border-slate-800 flex items-center">
        <h2 className="text-lg font-semibold text-white">Model Settings</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <Tabs defaultValue="display">
          <TabsList className="w-full">
            <TabsTrigger value="display" className="flex-1">Display</TabsTrigger>
            <TabsTrigger value="animation" className="flex-1">Animation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="display" className="space-y-6 pt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-300 flex items-center">
                <Layers className="mr-2 h-4 w-4" />
                Render Mode
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={renderMode === 'normal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRenderMode('normal')}
                  className={renderMode === 'normal' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                >
                  Normal
                </Button>
                
                <Button
                  variant={renderMode === 'wireframe' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRenderMode('wireframe')}
                  className={renderMode === 'wireframe' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                >
                  Wireframe
                </Button>
              </div>
              
              {renderMode === 'wireframe' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Wireframe Opacity</Label>
                      <span className="text-xs text-slate-400">{wireframeOpacity.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[wireframeOpacity]}
                      min={0.1}
                      max={1}
                      step={0.1}
                      onValueChange={(value) => setWireframeOpacity(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Wireframe Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={wireframeColor}
                        onChange={(e) => setWireframeColor(e.target.value)}
                        className="w-10 h-10 rounded-md overflow-hidden cursor-pointer"
                      />
                      <span className="text-xs text-slate-400">{wireframeColor}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-medium text-slate-300">Display Options</h3>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <Grid className="h-4 w-4 mr-2 text-slate-400" />
                    <Label className="text-sm">Show Grid</Label>
                  </div>
                  <Switch
                    checked={showGrid}
                    onCheckedChange={setShowGrid}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <Axis3d className="h-4 w-4 mr-2 text-slate-400" />
                    <Label className="text-sm">Show Axes</Label>
                  </div>
                  <Switch
                    checked={showAxes}
                    onCheckedChange={setShowAxes}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="animation" className="space-y-6 pt-4">
            {animations.length > 0 ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-300">Animation Controls</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={togglePlayback}
                        className="h-8 w-8"
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={resetAnimation}
                        className="h-8 w-8"
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Progress</Label>
                      <span className="text-xs text-slate-400">{animationProgress.toFixed(0)}%</span>
                    </div>
                    <Slider
                      value={[animationProgress]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setAnimationProgress(value[0])}
                      disabled={isPlaying}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Speed</Label>
                      <span className="text-xs text-slate-400">{animationSpeed.toFixed(1)}x</span>
                    </div>
                    <Slider
                      value={[animationSpeed]}
                      min={0.1}
                      max={2}
                      step={0.1}
                      onValueChange={(value) => setAnimationSpeed(value[0])}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
                  <h3 className="text-sm font-medium text-slate-300">Available Animations</h3>
                  
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
                    {animations.map((animation) => (
                      <div key={animation.name} className="flex items-center justify-between py-2">
                        <Label className="text-sm truncate max-w-[200px]">{animation.name}</Label>
                        <Switch
                          checked={selectedAnimations.includes(animation.name)}
                          onCheckedChange={() => toggleAnimationSelection(animation.name)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-slate-400 mb-2">No animations available</p>
                <p className="text-xs text-slate-500">
                  Upload a model with animations to see controls
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};