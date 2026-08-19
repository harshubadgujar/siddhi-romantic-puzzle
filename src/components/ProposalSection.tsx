import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/soundEffects';

interface ProposalProps {
  partnerName: string;
  question: string;
  subtext: string;
  onYesClicked: () => void;
}

export const ProposalSection: React.FC<ProposalProps> = ({
  partnerName,
  question,
  subtext,
  onYesClicked
}) => {
  const [noPos, setNoPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [yesScale, setYesScale] = useState<number>(1);
  const [noCount, setNoCount] = useState<number>(0);

  // Original playful dodging logic for the "No" button
  const handleNoHover = () => {
    soundFx.playClick();
    const randomX = (Math.random() - 0.5) * 260;
    const randomY = (Math.random() - 0.5) * 200;
    setNoPos({ x: randomX, y: randomY });
    setYesScale((prev) => Math.min(prev + 0.15, 2.2));
    setNoCount((prev) => prev + 1);
  };

  const handleYesClick = () => {
    soundFx.playPuzzleSolveFanfare();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 }
    });
    onYesClicked();
  };

  const getNoText = () => {
    if (noCount === 0) return 'No 🙈';
    if (noCount === 1) return 'Are you sure? 🥺';
    if (noCount === 2) return 'Think again! 😜';
    if (noCount === 3) return 'Click YES! 💕';
    return 'Nice try! 💖';
  };

  return (
    <div id="proposal-section" className="relative min-h-screen py-20 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background Starry Night */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url('/images/night_bg.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/90" />
      </div>

      {/* Main Glass Proposal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-20 max-w-xl w-full p-8 sm:p-12 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-pink-500/30 shadow-2xl shadow-purple-950/60 flex flex-col items-center gap-6"
      >
        {/* Moon & Star Icon Badge */}
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-300 fill-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <Heart className="w-8 h-8 text-rose-400 fill-rose-500 animate-bounce" />
          <Sparkles className="w-5 h-5 text-pink-300" />
        </div>

        {/* Question Title */}
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-amber-200">
          {question}
        </h2>

        {/* Customized Question for Siddhi */}
        <p className="text-base sm:text-xl text-rose-100/90 font-light leading-relaxed">
          <span className="font-semibold text-rose-300">{partnerName}</span>, {subtext}
        </p>

        {/* Action Buttons Container */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 relative min-h-[80px] w-full">
          {/* YES Button */}
          <motion.button
            style={{ scale: yesScale }}
            whileHover={{ scale: yesScale * 1.05 }}
            whileTap={{ scale: yesScale * 0.95 }}
            onClick={handleYesClick}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-bold text-lg shadow-xl shadow-rose-500/40 hover:shadow-rose-500/70 transition-all flex items-center gap-2 cursor-pointer z-30"
          >
            <Heart className="w-6 h-6 fill-white" />
            <span>YES! 💖</span>
          </motion.button>

          {/* Dodging NO Button */}
          <motion.button
            animate={{ x: noPos.x, y: noPos.y }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onMouseEnter={handleNoHover}
            onTouchStart={handleNoHover}
            onClick={handleNoHover}
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-rose-200 border border-white/20 font-medium text-sm transition-colors cursor-pointer select-none"
          >
            {getNoText()}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
