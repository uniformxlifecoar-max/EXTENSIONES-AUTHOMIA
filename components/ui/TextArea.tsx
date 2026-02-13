import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, className = '', ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full group relative">
       <motion.label 
        initial={false}
        animate={{ 
          color: isFocused ? '#3B82F6' : '#9CA3AF',
          y: isFocused ? -2 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="text-[11px] font-medium uppercase tracking-[0.15em] flex justify-between transition-colors pointer-events-none"
      >
        {label}
      </motion.label>
      
      <div className="relative">
         {/* Breathing Glow Background */}
         <motion.div
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1.02 : 1,
            boxShadow: isFocused ? "0 0 20px rgba(59, 130, 246, 0.15)" : "none"
          }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-authomia-blueLight/50 to-authomia-blue/50 -z-10"
        />

        <textarea
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full bg-authomia-input border border-authomia-border rounded-lg px-5 py-4
            text-authomia-text placeholder-gray-600 transition-all duration-300
            font-sans tracking-wide text-sm relative z-10
            focus:outline-none focus:border-authomia-blueLight focus:bg-[#131b26]
            hover:border-gray-700 min-h-[120px] resize-y
            ${error ? 'border-red-800 focus:border-red-600' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <span className="text-[10px] text-red-400 mt-1 pl-1 font-semibold uppercase tracking-wider">{error}</span>}
    </div>
  );
};