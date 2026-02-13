import React from 'react';
import { motion } from 'framer-motion';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-authomia-bg">
      
      {/* Dominant Deep Blue - Top Left */}
      <motion.div 
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6], // Increased opacity
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-20%] left-[-20%] w-[90vw] h-[90vh] rounded-full blur-[100px] bg-gradient-radial from-authomia-blue via-authomia-blue/40 to-transparent mix-blend-screen"
      />
      
      {/* Imposing Red - Bottom Right */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.7, 0.5], // Increased opacity
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-[-20%] right-[-20%] w-[100vw] h-[90vh] rounded-full blur-[120px] bg-gradient-radial from-authomia-red via-authomia-red/30 to-transparent mix-blend-screen"
      />

      {/* Atmospheric Moving Light */}
      <motion.div 
        animate={{
          opacity: [0.1, 0.3, 0.1],
          rotate: [0, 180],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-gradient-conic from-transparent via-authomia-blueLight/10 to-transparent blur-[90px]"
      />

      {/* Noise Texture for Film Grain feel */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
        }}
      />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80" />
    </div>
  );
};