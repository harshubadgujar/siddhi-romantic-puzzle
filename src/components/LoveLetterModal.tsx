import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Sparkles, MailOpen } from 'lucide-react';
import type { CoupleConfig } from '../types';

interface LoveLetterModalProps {
  isOpen: boolean;
  config: CoupleConfig;
  onClose: () => void;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({ isOpen, config, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-rose-950/90 via-slate-950/95 to-black border-2 border-rose-400/40 shadow-2xl shadow-rose-900/80 text-rose-100 flex flex-col items-center max-h-[85vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-rose-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Letter Header */}
            <div className="flex items-center gap-2 mb-4">
              <MailOpen className="w-8 h-8 text-rose-400 animate-bounce" />
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-amber-200 mb-6 text-center">
              {config.loveLetterTitle}
            </h3>

            {/* Love Letter Body */}
            <div className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 text-rose-100 font-serif leading-relaxed text-sm sm:text-base whitespace-pre-line shadow-inner">
              {config.loveLetterBody}
            </div>

            {/* Footer Heart Seal */}
            <div className="mt-6 flex items-center gap-2 text-rose-300 text-xs font-semibold uppercase tracking-wider">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-400" />
              <span>Sealed with endless love</span>
              <Heart className="w-4 h-4 fill-rose-500 text-rose-400" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
