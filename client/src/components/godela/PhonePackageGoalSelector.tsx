import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Leaf, Shield, DollarSign, Scale } from 'lucide-react';

export type DesignGoal = 'eco-friendly' | 'protection' | 'cost' | 'balanced';

interface DesignGoalOption {
  id: DesignGoal;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface PhonePackageGoalSelectorProps {
  selectedGoal: DesignGoal | null;
  onSelectGoal: (goal: DesignGoal) => void;
  onNext: () => void;
  className?: string;
}

const PhonePackageGoalSelector: React.FC<PhonePackageGoalSelectorProps> = ({
  selectedGoal,
  onSelectGoal,
  onNext,
  className = ''
}) => {
  const goalOptions: DesignGoalOption[] = [
    {
      id: 'eco-friendly',
      name: 'Maximize Eco-Friendliness',
      description: 'Prioritize sustainability with high recycled content and biodegradable materials',
      icon: <Leaf className="h-5 w-5" />,
      color: 'bg-green-500/20 text-green-400'
    },
    {
      id: 'protection',
      name: 'Prioritize Protection',
      description: 'Ensure your phone receives maximum protection during shipping and handling',
      icon: <Shield className="h-5 w-5" />,
      color: 'bg-blue-500/20 text-blue-400'
    },
    {
      id: 'cost',
      name: 'Achieve Lowest Cost',
      description: 'Optimize for cost efficiency while maintaining adequate protection',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-amber-500/20 text-amber-400'
    },
    {
      id: 'balanced',
      name: 'Balanced Approach',
      description: 'Find the optimal middle ground between sustainability, protection, and cost',
      icon: <Scale className="h-5 w-5" />,
      color: 'bg-purple-500/20 text-purple-400'
    }
  ];

  return (
    <div className={`${className} flex flex-col h-full`}>
      <h3 className="text-lg font-medium text-slate-200 mb-3">What's your primary goal for this iPhone package?</h3>
      
      <div className="grid grid-cols-1 gap-3 flex-1">
        {goalOptions.map((option) => (
          <motion.div
            key={option.id}
            className={`
              p-4 rounded-lg border cursor-pointer flex
              ${selectedGoal === option.id 
                ? 'bg-slate-800/70 border-indigo-500/60 shadow-md shadow-indigo-800/10'
                : 'bg-slate-900/70 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50'}
              transition-all duration-200
            `}
            onClick={() => onSelectGoal(option.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className={`mr-3 p-2 rounded-md ${option.color}`}>
              {option.icon}
            </div>
            
            <div>
              <h4 className="font-medium text-slate-200">{option.name}</h4>
              <p className="text-sm text-slate-400 mt-1">{option.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-5">
        <Button 
          className="w-full bg-indigo-600 hover:bg-indigo-700"
          disabled={!selectedGoal}
          onClick={onNext}
        >
          Next: Tune Design & Sustainability
        </Button>
      </div>
    </div>
  );
};

export default PhonePackageGoalSelector;