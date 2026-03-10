import React from 'react';
import { motion } from 'framer-motion';
import { PackageStyle } from './PhonePackagePreview';
import { CheckCircle } from 'lucide-react';

interface PackageStyleOption {
  id: PackageStyle;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface PhonePackageStyleSelectorProps {
  selectedStyle: PackageStyle;
  onSelectStyle: (style: PackageStyle) => void;
  className?: string;
}

const PhonePackageStyleSelector: React.FC<PhonePackageStyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
  className = ''
}) => {
  const packageOptions: PackageStyleOption[] = [
    {
      id: 'slim-fit-mailer',
      name: 'Slim-Fit Corrugated Mailer',
      description: 'A sleek, efficient box that offers good protection with minimal material waste',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
        </svg>
      )
    },
    {
      id: 'molded-pulp',
      name: 'Molded Pulp Tray with Sleeve',
      description: 'Recyclable molded pulp cradles your phone securely with excellent eco-credentials',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
          <polyline points="7.5 19.79 7.5 14.6 3 12" />
          <polyline points="21 12 16.5 14.6 16.5 19.79" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      )
    },
    {
      id: 'cushioned-envelope',
      name: 'Cushioned Paper-Based Envelope',
      description: 'Lightweight, flexible protection ideal for pre-boxed phones or accessories',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
          <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          <path d="M16 19h6" />
          <path d="M19 16v6" />
        </svg>
      )
    },
    {
      id: 'premium-box',
      name: 'Premium Display Box',
      description: 'Elegant retail-ready box with advanced protection and premium unboxing experience',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.29 7 12 12 20.71 7" />
          <line x1="12" y1="22" x2="12" y2="12" />
          <rect x="7" y="8" width="10" height="8" rx="1" />
        </svg>
      )
    },
    {
      id: 'eco-waffle',
      name: 'Eco-Waffle Padded Pack',
      description: 'Innovative waffle-pattern cushioning made from 100% recyclable materials',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      )
    }
  ];

  return (
    <div className={`${className} grid gap-3`}>
      <h3 className="text-lg font-medium text-slate-200 mb-1">Select Package Style</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {packageOptions.map((option) => (
          <motion.div
            key={option.id}
            className={`
              relative p-4 rounded-lg border border-slate-700/50 cursor-pointer
              ${selectedStyle === option.id 
                ? 'bg-slate-800/70 border-indigo-500/60 shadow-md shadow-indigo-800/10' 
                : 'bg-slate-900/70 hover:bg-slate-800/50 hover:border-slate-600/50'}
              transition-all duration-200
            `}
            onClick={() => onSelectStyle(option.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-start">
              <div className="mr-3 p-2 bg-indigo-500/10 rounded-md text-indigo-400">
                {option.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <h4 className="font-medium text-slate-200">{option.name}</h4>
                  {selectedStyle === option.id && (
                    <CheckCircle className="ml-2 h-4 w-4 text-indigo-500" />
                  )}
                </div>
                <p className="text-sm text-slate-400 mt-1">{option.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PhonePackageStyleSelector;