import React from 'react';
import { motion } from 'framer-motion';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-2 w-full group"
    >
      <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-authomia-subtext group-focus-within:text-authomia-blueLight transition-colors duration-300">
        {label}
      </label>
      <textarea
        className={`
          w-full bg-authomia-input border border-authomia-border rounded-lg px-5 py-4
          text-authomia-text placeholder-gray-600 transition-all duration-300
          font-sans tracking-wide text-sm
          focus:outline-none focus:border-authomia-blueLight focus:bg-[#131b26] focus:shadow-glow-blue
          hover:border-gray-700 min-h-[120px] resize-y
          ${error ? 'border-red-800 focus:border-red-600' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-[10px] text-red-400 mt-1 pl-1 font-semibold uppercase tracking-wider">{error}</span>}
    </motion.div>
  );
};