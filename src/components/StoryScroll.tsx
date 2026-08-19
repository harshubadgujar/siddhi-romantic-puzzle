import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Stars, ChevronDown } from 'lucide-react';
import type { CoupleConfig } from '../types';

interface StoryScrollProps {
  config: CoupleConfig;
  onReachEnd: () => void;
}

export const StoryScroll: React.FC<StoryScrollProps> = ({ config, onReachEnd }) => {
  return (
    <div id="story-section" className="relative flex flex-col items-center">
      {/* Background scenic container */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 bg-cover bg-center transition-all duration-1000 -z-10"
        style={{ backgroundImage: `url('/images/sunset_bg.jpg')` }}
      />

      {config.storySlides.map((slide, idx) => (
        <div
          key={idx}
          className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ margin: '-150px' }}
            className="max-w-xl w-full p-8 sm:p-12 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-rose-500/25 shadow-2xl shadow-rose-950/60 text-center flex flex-col items-center gap-6 relative"
          >
            <div className="p-3 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 shadow-inner">
              {idx % 2 === 0 ? (
                <Heart className="w-7 h-7 fill-rose-500/60 text-rose-400 animate-pulse" />
              ) : (
                <Stars className="w-7 h-7 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
              )}
            </div>

            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-amber-100 leading-snug">
              {slide.title}
            </h3>

            <p className="text-xl sm:text-2xl text-rose-100 font-light leading-relaxed">
              "{slide.message}"
            </p>

            <p className="text-sm sm:text-base text-rose-300/90 font-normal italic pt-2 border-t border-rose-500/20 w-full">
              {slide.subtext}
            </p>

            {/* Scroll Indicator helper */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-rose-300/50 animate-bounce">
              <ChevronDown className="w-6 h-6" />
            </div>
          </motion.div>
        </div>
      ))}

      {/* Under the stars trigger card */}
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center px-4 py-16">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReachEnd}
          className="px-10 py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold text-lg shadow-2xl shadow-rose-500/40 hover:shadow-rose-500/60 flex items-center gap-3 transition-all cursor-pointer"
        >
          <span>Under the stars... ✨</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.button>
      </div>
    </div>
  );
};
