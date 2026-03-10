import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown, CheckCircle, Package, CreditCard } from 'lucide-react';

interface OrderPrototypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMultiProduct: boolean;
}

export default function OrderPrototypeModal({ isOpen, onClose, isMultiProduct }: OrderPrototypeModalProps) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  if (!isOpen) return null;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    // After 3 seconds, close the modal
    setTimeout(() => {
      setOrderPlaced(false);
      onClose();
    }, 3000);
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  };

  const calculateBasePrice = () => {
    return isMultiProduct ? 19.65 : 14.99;
  };

  const shipping = 4.25;
  const basePrice = calculateBasePrice();
  const subtotal = basePrice;
  const tax = subtotal * 0.13; // 13% tax rate
  const total = subtotal + shipping + tax;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-[#F5F7FA] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {orderPlaced ? (
          <div className="p-8 flex flex-col items-center justify-center h-96">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle size={40} className="text-white" />
            </motion.div>
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Order Placed!</h2>
            <p className="text-gray-600 text-center mb-6">
              Your prototype will be manufactured and shipped within 2-3 business days.
            </p>
            <p className="text-gray-500 text-sm">
              Order confirmation has been sent to your email.
            </p>
          </div>
        ) : (
          <>
            {/* Modal header */}
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 flex items-center justify-between">
              <h2 className="text-xl font-medium text-white">Order Packaging Prototype</h2>
              <button 
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal content */}
            <div className="p-6">
              {/* Package Options */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Selected Package</h3>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 flex items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center mr-4 flex-shrink-0">
                    <Package size={24} className="text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">
                        {isMultiProduct ? 'STANDARD' : 'CONFORMING'}
                      </h4>
                      <span className="font-medium text-gray-900">${basePrice.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {isMultiProduct ? '4 × 3 × 4 inches' : '3 × 3 × 4 inches'} - {isMultiProduct ? 'Dual product' : 'Single product'} protection
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className="text-xs text-indigo-600 font-medium">Optimized for impact absorption</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:border-indigo-300 transition-colors">
                  <span className="text-sm text-gray-700">Add custom branding</span>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-2">+$8.50</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Order Summary</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items</span>
                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total before tax</span>
                    <span className="text-gray-900">${(subtotal + shipping).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST/HST (13%)</span>
                    <span className="text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-900">Order Total</span>
                      <span className="text-gray-900">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  By placing your order, you agree to Godela's terms and conditions.
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Secured</span>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded p-3 flex items-center">
                  <CreditCard size={20} className="text-gray-500 mr-3" />
                  <span className="text-sm text-gray-700">•••• •••• •••• 4242</span>
                </div>
              </div>
              
              {/* Order Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium py-4 rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
              >
                PLACE ORDER
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}