import React from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  optional?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, error, optional, className = '', ...props }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-2 w-full group"
    >
      <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-authomia-subtext flex justify-between group-focus-within:text-authomia-blueLight transition-colors duration-300">
        {label}
        {optional && <span className="opacity-40 normal-case tracking-normal">Opcional</span>}
      </label>
      <input
        className={`
          w-full bg-authomia-input border border-authomia-border rounded-lg px-5 py-4
          text-authomia-text placeholder-gray-600 transition-all duration-300
          font-sans tracking-wide text-sm shadow-sm
          focus:outline-none focus:border-authomia-blueLight focus:bg-[#131b26] focus:shadow-glow-blue
          hover:border-gray-700
          ${error ? 'border-red-800 focus:border-red-600 focus:shadow-glow-red text-red-100' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-[10px] text-red-400 mt-1 pl-1 font-semibold uppercase tracking-wider">{error}</span>}
    </motion.div>
  );
};