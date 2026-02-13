import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// --- Interfaces ---

interface IntroOverlayProps {
  onComplete: () => void;
}

interface FlowLineProps {
  d: string;
  trigger: boolean;
  color: string;
  delay?: number;
  strokeWidth?: number;
}

interface PillarProps {
  y: number;
  active: boolean;
  title: string;
  subtext: string;
  align: 'left' | 'center' | 'right';
  color: string;
  offsetX?: number;
}

// --- Sub Components (Defined before usage to prevent hoisting issues) ---

const FlowLine: React.FC<FlowLineProps> = ({ d, trigger, color, delay = 0, strokeWidth = 2 }) => (
  <motion.path
    d={d}
    stroke={color}
    strokeWidth={trigger ? strokeWidth : 0}
    strokeLinecap="round"
    fill="none"
    filter="url(#glowLine)"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ 
      pathLength: trigger ? 1 : 0,
      opacity: trigger ? 0.8 : 0
    }}
    transition={{ duration: 2, ease: "easeInOut", delay }}
  />
);

const Pillar: React.FC<PillarProps> = ({ y, active, title, subtext, align, color, offsetX = 0 }) => {
  return (
    <div 
      className="absolute flex flex-col items-center justify-center w-64"
      style={{ top: y, left: `calc(50% + ${offsetX}px - 8rem)` }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: active ? 1 : 0.5 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10"
      >
        <div 
          className="w-4 h-4 rounded-full bg-[#0B0B0F] border-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] z-20 relative transition-colors duration-500"
          style={{ borderColor: active ? color : '#333' }}
        />
        {active && (
          <div className="absolute inset-0 w-4 h-4 rounded-full animate-ping opacity-50" style={{ backgroundColor: color }} />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: align === 'left' ? -30 : 30 }}
        animate={{ opacity: active ? 1 : 0, x: active ? 0 : (align === 'left' ? -30 : 30) }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className={`absolute ${align === 'left' ? 'right-full mr-8 text-right' : align === 'right' ? 'left-full ml-8 text-left' : 'top-full mt-6 text-center'} w-48`}
      >
        <h3 className="text-xl font-display font-bold text-white tracking-widest uppercase drop-shadow-lg">{title}</h3>
        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-1">{subtext}</p>
      </motion.div>
    </div>
  );
};

// --- Main Component ---

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [skip, setSkip] = useState(false);

  // Animation Sequence Controller
  useEffect(() => {
    if (skip) return;

    const timeline = [
      { s: 1, t: 2500 },  // Descent Start
      { s: 2, t: 5000 },  // P1: Admin
      { s: 3, t: 8000 },  // P2: Marketing
      { s: 4, t: 11000 }, // P3: Sales
      { s: 5, t: 14000 }, // P4: Fulfillment
      { s: 6, t: 17000 }, // Core Convergence
      { s: 7, t: 18500 }, // Brand Reveal (Neon)
      { s: 8, t: 21000 }, // FLASH (Whiteout)
    ];

    const timers = timeline.map(event => setTimeout(() => setStage(event.s), event.t));
    
    // Trigger onComplete when the flash is fully white (stage 8 + transition time)
    // The component will then exit, fading the white out to reveal the app
    const finalTimer = setTimeout(onComplete, 22500); 

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finalTimer);
    };
  }, [onComplete, skip]);

  const handleSkip = () => {
    setSkip(true);
    onComplete();
  };

  // --- CAMERA RIG LOGIC ---
  const getCameraY = () => {
    switch (stage) {
      case 0: return 0;
      case 1: return -200;
      case 2: return -800;  // P1 Admin
      case 3: return -1600; // P2 Marketing
      case 4: return -2400; // P3 Sales
      case 5: return -3200; // P4 Fulfillment
      case 6: return -3800; // Core approach - Moved deeper for centering
      case 7: return -3800; // Stay centered
      case 8: return -3800; // Stay centered during flash
      default: return 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeOut" } }} // Slow fade out of the white screen
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050507] overflow-hidden cursor-none"
    >
      {/* ATMOSPHERE */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-50"></div>
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/60 to-black/95 z-40 pointer-events-none"></div>

      {/* --- WHITE FLASH OVERLAY (For the transition) --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 8 ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "circIn" }} // Quick but smooth ramp up to white
        className="fixed inset-0 z-[200] bg-white pointer-events-none"
      />

      {/* --- VIRTUAL CAMERA RIG --- */}
      <motion.div
        className="relative w-full max-w-4xl h-screen flex justify-center perspective-1000"
        animate={{ 
          y: getCameraY(),
          scale: 1, 
        }}
        transition={{ 
          duration: 3,
          ease: [0.25, 0.1, 0.25, 1], // Cinematic Bezier
        }}
      >
        <div className="absolute top-[50vh] w-full flex flex-col items-center">
          
          {/* --- STAGE 0: ORIGIN --- */}
          <div className="relative h-[800px] flex flex-col items-center justify-start pt-32">
             <AnimatePresence>
               {stage === 0 && (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
                   className="text-center px-4"
                 >
                   <h2 className="text-xl md:text-3xl font-display font-light text-white tracking-wide leading-relaxed">
                     La automatización no empieza con tecnología...
                   </h2>
                 </motion.div>
               )}
             </AnimatePresence>

             {/* THE DECISION LINE */}
             <motion.div
               initial={{ height: 0 }}
               animate={{ height: stage >= 1 ? '100%' : 0 }}
               transition={{ duration: 2.5, ease: "easeInOut" }}
               className="w-[2px] bg-gradient-to-b from-transparent via-white to-authomia-blue absolute top-52 shadow-[0_0_20px_rgba(255,255,255,0.6)]"
             />

             <AnimatePresence>
               {stage === 1 && (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="absolute top-[40%] bg-black/90 backdrop-blur-xl px-8 py-4 border border-white/10 rounded-full z-10 shadow-2xl"
                   style={{ transform: 'translateX(-50%)', left: '50%' }}
                 >
                   <p className="text-sm md:text-lg font-display text-white tracking-[0.2em] uppercase whitespace-nowrap">
                     ...empieza con una decisión.
                   </p>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* --- THE MAIN FLOW SYSTEM (SVG) --- */}
          <svg className="absolute top-[800px] w-[800px] h-[4000px] overflow-visible pointer-events-none" style={{ zIndex: 0 }}>
             <defs>
               <filter id="glowLine">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
               </filter>
               
               <linearGradient id="fulfillmentGradient" x1="400" y1="2400" x2="400" y2="3800" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#10B981" /> {/* Fulfillment Green */}
                 <stop offset="40%" stopColor="#10B981" />
                 <stop offset="70%" stopColor="#FFFFFF" /> {/* White Core Energy */}
                 <stop offset="100%" stopColor="#FFFFFF" /> 
               </linearGradient>
             </defs>

             {/* 1. Admin (Center) -> Marketing (Right) */}
             <FlowLine d="M 400 0 C 400 400 550 400 550 800" trigger={stage >= 2} color="#3B82F6" />
             
             {/* 2. Marketing (Right) -> Sales (Left) */}
             <FlowLine d="M 550 800 C 550 1200 250 1200 250 1600" trigger={stage >= 3} color="#6366F1" delay={0.5} />
             
             {/* 3. Sales (Left) -> Fulfillment (Center) */}
             <FlowLine d="M 250 1600 C 250 2000 400 2000 400 2400" trigger={stage >= 4} color="#EF4444" delay={0.5} />

             {/* 4. Fulfillment (Center) -> THE CORE (Down) */}
             {/* Extended path to reach the new deeper center */}
             <FlowLine 
                d="M 400 2400 L 400 3800" 
                trigger={stage >= 5} 
                color="url(#fulfillmentGradient)" 
                delay={0.2} 
                strokeWidth={5}
             />
          </svg>

          {/* --- PILLARS --- */}
          <Pillar y={800} active={stage >= 2} title="Administración" subtext="Control & Data" align="center" color="#3B82F6" />
          <Pillar y={1600} active={stage >= 3} title="Marketing" subtext="Demand & Growth" align="right" color="#6366F1" offsetX={150} />
          <Pillar y={2400} active={stage >= 4} title="Ventas" subtext="Conversion & Close" align="left" color="#EF4444" offsetX={-150} />
          <Pillar y={3200} active={stage >= 5} title="Fulfillment" subtext="Delivery & Experience" align="center" color="#10B981" />

          {/* --- THE BRAND REVEAL --- */}
          {/* Centered exactly at 3800px using translateY to adjust for height */}
          <div 
            className="absolute h-screen w-full flex flex-col items-center justify-center z-20 pointer-events-none"
            style={{ top: 3800, transform: 'translateY(-50%)' }}
          >
             
             {/* The Energy Core - Explodes */}
             <AnimatePresence>
               {stage >= 6 && stage < 8 && (
                 <motion.div
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ 
                     scale: stage >= 7 ? [1, 20, 0] : 1, // Explode
                     opacity: stage >= 7 ? [1, 0] : 1
                   }}
                   transition={{ duration: stage >= 7 ? 0.6 : 1 }}
                   className="w-4 h-4 bg-white rounded-full shadow-[0_0_50px_white] relative z-10 mb-8"
                 >
                    <div className="absolute inset-0 bg-white rounded-full animate-ping"></div>
                 </motion.div>
               )}
             </AnimatePresence>

             {/* The Logo Text */}
             <AnimatePresence>
               {stage >= 7 && (
                 <motion.div
                   initial={{ opacity: 0, scale: 0.95, filter: "blur(15px)" }}
                   animate={{ 
                      opacity: 1, 
                      scale: 1,
                      filter: "blur(0px)" 
                   }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className="text-center relative z-20"
                 >
                   <div className="relative">
                      {/* Font size large, white neon effect with multiple shadows for bloom */}
                      <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-display font-bold text-white tracking-[0.15em] leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                        AUTHOMIA
                      </h1>
                      
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
                        className="h-[2px] bg-white shadow-[0_0_15px_white] mx-auto mt-6"
                      />

                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="text-sm md:text-xl text-white font-mono uppercase tracking-[0.5em] mt-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                      >
                        Agency System
                      </motion.p>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

        </div>
      </motion.div>

      {/* --- SKIP BUTTON --- */}
      <button
        onClick={handleSkip}
        className="fixed bottom-8 right-8 z-[1100] text-[10px] text-authomia-subtext uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2 opacity-30 hover:opacity-100 group"
      >
        <span className="group-hover:translate-x-1 transition-transform">Saltar Intro</span>
        <X size={12} />
      </button>

      {/* Progress Line */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 h-40 w-[1px] bg-white/5 z-[200] hidden md:block">
        <motion.div 
          className="w-full bg-gradient-to-b from-authomia-blue to-authomia-red"
          animate={{ height: `${Math.min((stage / 7) * 100, 100)}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </motion.div>
  );
};