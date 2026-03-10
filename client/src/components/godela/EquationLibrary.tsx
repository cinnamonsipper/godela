import { useState, useEffect } from 'react';
import { Search, X, Plus, Filter, ArrowRight } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

// Import physics equations from a shared location
import { physicsEquations, PhysicsEquation } from '@/data/equations';

interface EquationLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEquations: (selectedEquations: PhysicsEquation[]) => void;
  existingEquationIds?: string[];
}

const EquationLibrary = ({ isOpen, onClose, onAddEquations, existingEquationIds = [] }: EquationLibraryProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedEquations, setSelectedEquations] = useState<Record<string, boolean>>({});
  const [filteredEquations, setFilteredEquations] = useState(physicsEquations);
  
  // Get unique categories
  const categories = ['all', ...Array.from(new Set(physicsEquations.map(eq => eq.category)))];
  
  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      // Initialize with existing equations already selected
      const initialSelected = existingEquationIds.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      
      setSelectedEquations(initialSelected);
      setSearchQuery('');
      setActiveCategory('all');
    }
  }, [isOpen, existingEquationIds]);
  
  // Filter equations based on search and category
  useEffect(() => {
    let filtered = physicsEquations;
    
    // Apply category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(eq => eq.category === activeCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(eq => 
        eq.name.toLowerCase().includes(query) || 
        eq.description.toLowerCase().includes(query) ||
        (eq.variables && eq.variables.some(v => v.toLowerCase().includes(query))) ||
        (eq.constraints && eq.constraints.some(c => c.toLowerCase().includes(query)))
      );
    }
    
    setFilteredEquations(filtered);
  }, [searchQuery, activeCategory]);
  
  const toggleEquation = (id: string) => {
    setSelectedEquations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleAddSelected = () => {
    const equationsToAdd = physicsEquations.filter(eq => selectedEquations[eq.id]);
    onAddEquations(equationsToAdd);
    onClose();
  };
  
  const clearSelection = () => {
    setSelectedEquations({});
  };
  
  const selectedCount = Object.values(selectedEquations).filter(Boolean).length;
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="sm:max-w-[800px] max-h-[90vh] bg-gradient-to-br from-[#101525] to-[#0D1017] border border-white/10 text-white rounded-lg shadow-xl w-full overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <span className="bg-blue-500/20 p-1.5 rounded mr-2 text-blue-300">
                <Filter size={16} />
              </span>
              Physics Equation Library
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-[280px_1fr] gap-4 p-4">
          {/* Left sidebar */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search equations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/5 border border-white/10 placeholder:text-slate-400 text-white rounded-md w-full h-10"
              />
              {searchQuery && (
                <button
                  className="absolute right-1 top-1 h-7 w-7 p-0 text-slate-400 hover:text-white"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`w-full flex justify-between items-center text-sm px-3 py-1.5 rounded-md ${
                      activeCategory === category
                        ? 'bg-white/10 text-white'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                    <span className="bg-slate-700/50 text-slate-300 text-xs px-2 py-0.5 rounded-full">
                      {category === 'all' 
                        ? physicsEquations.length
                        : physicsEquations.filter(eq => eq.category === category).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <h3 className="text-sm font-medium text-white mb-2">Selected Equations</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="bg-blue-600/30 text-blue-200 text-xs px-2 py-0.5 rounded-full">
                  {selectedCount} selected
                </span>
                {selectedCount > 0 && (
                  <button className="text-xs text-slate-300 hover:text-white" onClick={clearSelection}>
                    Clear all
                  </button>
                )}
              </div>
              
              <button 
                className={`w-full py-2 px-3 rounded-md flex items-center justify-center ${
                  selectedCount === 0 
                    ? 'bg-blue-700/50 text-blue-300/50 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                onClick={handleAddSelected}
                disabled={selectedCount === 0}
              >
                <Plus size={14} className="mr-1" />
                Add to Model
                <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
          
          {/* Right content area */}
          <div className="bg-[#0A0E18]/70 rounded-md border border-white/5 overflow-hidden">
            <div className="h-[500px] overflow-y-auto p-3 space-y-4">
              {filteredEquations.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <p>No equations match your search criteria.</p>
                </div>
              ) : (
                filteredEquations.map(equation => (
                  <div 
                    key={equation.id} 
                    className={`p-3 rounded-md transition-all ${
                      selectedEquations[equation.id] 
                        ? 'bg-blue-900/40 border border-blue-700/40' 
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start">
                      <input 
                        type="checkbox"
                        id={`eq-${equation.id}`} 
                        checked={!!selectedEquations[equation.id]}
                        onChange={() => toggleEquation(equation.id)}
                        className="mr-3 mt-1 rounded"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <label htmlFor={`eq-${equation.id}`} className="font-medium text-white cursor-pointer">
                            {equation.name}
                          </label>
                          <span className="ml-2 bg-blue-900/40 text-blue-300 text-xs px-2 py-0.5 rounded">
                            {equation.category}
                          </span>
                        </div>
                        
                        <div className="my-3 bg-slate-900/80 rounded border border-slate-700 p-3">
                          <BlockMath math={equation.latex} />
                        </div>
                        
                        <p className="text-sm text-slate-300 mb-2">
                          {equation.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mt-1">
                          {equation.variables.map(variable => (
                            <span key={variable} className="bg-blue-900/30 text-blue-300 border border-blue-700/30 rounded text-xs px-1.5 py-0.5">
                              {variable}
                            </span>
                          ))}
                          
                          {equation.constraints.map(constraint => (
                            <span key={constraint} className="bg-amber-900/30 text-amber-300 border border-amber-700/30 rounded text-xs px-1.5 py-0.5">
                              {constraint}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquationLibrary;