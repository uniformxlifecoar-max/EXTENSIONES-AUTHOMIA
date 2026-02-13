import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: string[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className = '', ...props }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-2 w-full relative group"
    >
      <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-authomia-subtext group-focus-within:text-authomia-blueLight transition-colors duration-300">
        {label}
      </label>
      <div className="relative">
        <select
          className={`
            w-full bg-authomia-input border border-authomia-border rounded-lg px-5 py-4 pr-10
            text-authomia-text placeholder-gray-600 transition-all duration-300 appearance-none
            font-sans tracking-wide text-sm
            focus:outline-none focus:border-authomia-blueLight focus:bg-[#131b26] focus:shadow-glow-blue
            hover:border-gray-700
            cursor-pointer
            ${error ? 'border-red-800 focus:border-red-600' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="" disabled className="bg-zinc-900 text-zinc-500">Selecciona una opción</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-authomia-bg text-white py-2">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-authomia-subtext pointer-events-none w-4 h-4" />
      </div>
      {error && <span className="text-[10px] text-red-400 mt-1 pl-1 font-semibold uppercase tracking-wider">{error}</span>}
    </motion.div>
  );
};