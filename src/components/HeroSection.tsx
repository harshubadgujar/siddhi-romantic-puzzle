import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ChevronDown } from 'lucide-react';
import type { CoupleConfig } from '../types';
import { soundFx } from '../utils/soundEffects';

interface HeroProps {
  config: CoupleConfig;
  onStart: () => void;
}

export const HeroSection: React.FC<HeroProps> = ({ config, onStart }) => {
  const handleClickStart = () => {
    soundFx.playClick();
    soundFx.startRomanticMusic();
    onStart();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background Image with Ambient Glow overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{ backgroundImage: `url('/images/sunset_bg.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-rose-950/40 to-slate-950/90" />
      </div>

      {/* Main Glassmorphism Card */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-20 max-w-lg w-full mx-auto p-8 sm:p-12 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl shadow-rose-900/40 flex flex-col items-center gap-6"
      >
        {/* Heart Icon Badge */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="p-3.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-400 shadow-inner"
        >
          <Heart className="w-8 h-8 fill-rose-500 text-rose-400" />
        </motion.div>

        {/* Dynamic Title */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl sm:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-amber-100 drop-shadow-md tracking-tight"
        >
          Hey {config.partner2Name} ♥
        </motion.h1>

        {/* Sequential Quotes Fade-in matching video timing */}
        <div className="space-y-4 text-rose-100/90 font-light text-base sm:text-lg leading-relaxed w-full">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="italic text-rose-100/95"
          >
            "{config.heroQuote1}"
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-pink-200 font-normal"
          >
            {config.heroQuote2}
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.8 }}
            className="text-amber-200/90 text-sm flex items-center justify-center gap-1.5 pt-1"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            {config.heroQuote3}
          </motion.p>
        </div>

        {/* Start / Continue Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClickStart}
          className="mt-4 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-medium shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 flex items-center gap-2 group transition-all cursor-pointer"
        >
          <span>Continue</span>
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </motion.button>
      </motion.div>
    </div>
  );
};
