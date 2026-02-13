import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  optional?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, error, optional, className = '', ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full group relative">
      {/* Animated Label */}
      <motion.label 
        initial={false}
        animate={{ 
          color: isFocused ? '#3B82F6' : '#9CA3AF',
          y: isFocused ? -2 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="text-[11px] font-medium uppercase tracking-[0.15em] flex justify-between transition-colors"
      >
        {label}
        {optional && <span className="opacity-40 normal-case tracking-normal text-authomia-subtext">Opcional</span>}
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

        {/* Active Border Pulse */}
        <motion.div
          animate={{
             borderColor: isFocused ? '#3B82F6' : '#1F2937',
             borderWidth: '1px'
          }}
          className="absolute inset-0 rounded-lg border border-transparent pointer-events-none z-20"
          style={{ borderRadius: '0.5rem' }}
        />

        <input
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full bg-authomia-input border border-transparent rounded-lg px-5 py-4
            text-authomia-text placeholder-gray-600 transition-all duration-300
            font-sans tracking-wide text-sm shadow-sm relative z-10
            focus:outline-none focus:bg-[#131b26]
            ${error ? 'border-red-800 focus:border-red-600 text-red-100' : 'border-authomia-border'}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && <span className="text-[10px] text-red-400 mt-1 pl-1 font-semibold uppercase tracking-wider">{error}</span>}
    </div>
  );
};