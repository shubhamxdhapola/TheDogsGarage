import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const Stepper = ({
  steps = [],
  currentStep = 0,
  onStepClick,
  className = '',
  orientation = 'horizontal',
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={`space-y-5 ${className}`}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <div key={index} className="flex items-start gap-3.5 relative">
              {index < steps.length - 1 && (
                <div
                  className="absolute left-4 top-8 bottom-[-20px] w-0.5 transition-colors duration-300"
                  style={{
                    backgroundColor: isCompleted ? '#059669' : '#E5E7EB',
                  }}
                />
              )}
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.08 : 1,
                  backgroundColor: isCompleted ? '#059669' : isCurrent ? '#18181B' : '#FFFFFF',
                  borderColor: isCompleted ? '#059669' : isCurrent ? '#18181B' : '#E7E5E4',
                }}
                className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  isCompleted || isCurrent ? 'text-white' : 'text-stone-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </motion.div>
              <div className="pt-1">
                <p className={`text-xs font-display ${isCurrent ? 'text-stone-900 font-black' : isCompleted ? 'text-emerald-700 font-bold' : 'text-stone-400 font-medium'}`}>
                  {step.title || step}
                </p>
                {step.description && (
                  <p className="text-[11px] text-stone-500 mt-0.5">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between w-full ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={index}>
            <div
              className={`flex flex-col items-center group ${onStepClick && isCompleted ? 'cursor-pointer' : ''}`}
              onClick={() => onStepClick && isCompleted && onStepClick(index)}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.08 : 1,
                  backgroundColor: isCompleted ? '#059669' : isCurrent ? '#18181B' : '#FFFFFF',
                  borderColor: isCompleted ? '#059669' : isCurrent ? '#18181B' : '#E7E5E4',
                }}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  isCompleted || isCurrent ? 'text-white' : 'text-stone-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </motion.div>
              <span
                className={`text-[11px] font-bold mt-1.5 transition-colors text-center font-display ${
                  isCurrent ? 'text-stone-900 font-extrabold' : isCompleted ? 'text-emerald-700' : 'text-stone-400'
                }`}
              >
                {step.title || step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-3 h-0.5 bg-stone-200 relative overflow-hidden rounded-full self-start mt-4.5">
                <motion.div
                  initial={false}
                  animate={{ width: index < currentStep ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-emerald-600"
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
