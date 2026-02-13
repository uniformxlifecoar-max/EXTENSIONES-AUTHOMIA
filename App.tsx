import React from 'react';
import { Background } from './components/Background';
import { ContactForm } from './components/ContactForm';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen font-sans text-authomia-text selection:bg-authomia-red selection:text-white flex flex-col overflow-hidden">
      <Background />
      
      {/* Navbar */}
      <header className="relative z-10 w-full py-8 md:py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-center md:justify-between items-center gap-6">
          
          {/* LOGO */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="cursor-pointer"
          >
             <div className="logo-shine px-4 py-2 rounded-lg">
               <img 
                 src="https://r2.fivemanage.com/pub/1y99u9a40590.png" 
                 alt="AUTHOMIA" 
                 className="h-10 md:h-14 w-auto object-contain brightness-200 drop-shadow-lg relative z-10"
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                   e.currentTarget.nextElementSibling?.classList.remove('hidden');
                 }}
               />
               <span className="hidden text-2xl font-display font-bold tracking-[0.2em] text-white">AUTHOMIA</span>
             </div>
          </motion.div>

          {/* Status Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-authomia-border bg-authomia-bg/50 backdrop-blur-md"
          >
             <div className="relative flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-authomia-red animate-pulse absolute opacity-75"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-authomia-red relative z-10"></div>
             </div>
             <span className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em]">System Online</span>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center px-4 pb-12 mt-4 md:mt-0">
        <div className="container mx-auto">
          <ContactForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-authomia-border/30 bg-black/20 backdrop-blur-sm">
        <p className="text-[10px] text-gray-600 font-mono tracking-[0.2em] uppercase">
          Authomia Agency &copy; {new Date().getFullYear()} &bull; Secure Connection
        </p>
      </footer>
    </div>
  );
};

export default App;