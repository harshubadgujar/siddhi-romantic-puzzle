import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { defaultCoupleConfig } from './utils/defaultData';
import type { CoupleConfig } from './types';
import { FloatingParticles } from './components/FloatingParticles';
import { AudioPlayer } from './components/AudioPlayer';
import { HeroSection } from './components/HeroSection';
import { JigsawPuzzle } from './components/JigsawPuzzle';
import { StoryScroll } from './components/StoryScroll';
import { ProposalSection } from './components/ProposalSection';
import { LoveLetterModal } from './components/LoveLetterModal';
import { CustomizerModal } from './components/CustomizerModal';
import { soundFx } from './utils/soundEffects';

export function App() {
  const [config, setConfig] = useState<CoupleConfig>(() => {
    const saved = localStorage.getItem('siddhi_romantic_config');
    const baseConfig = saved ? JSON.parse(saved) : defaultCoupleConfig;

    // Detect URL parameter ?name=Bhumii or ?name=Mansi or ?to=Mansi
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('name') || params.get('to');
    const fromParam = params.get('from');

    if (nameParam && nameParam.trim()) {
      const rawName = nameParam.trim();
      const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      const defaultName = baseConfig.partner2Name || 'Siddhi';

      return {
        ...baseConfig,
        partner2Name: formattedName,
        partner1Name: fromParam ? fromParam.trim() : baseConfig.partner1Name,
        storySlides: baseConfig.storySlides.map((slide: { title: string; message: string; subtext: string }) => ({
          ...slide,
          title: slide.title.replace(new RegExp(defaultName, 'g'), formattedName),
          message: slide.message.replace(new RegExp(defaultName, 'g'), formattedName),
          subtext: slide.subtext.replace(new RegExp(defaultName, 'g'), formattedName)
        })),
        proposalSubtext: baseConfig.proposalSubtext.replace(new RegExp(defaultName, 'g'), formattedName),
        loveLetterTitle: `To My Dearest ${formattedName} 💌`,
        loveLetterBody: baseConfig.loveLetterBody.replace(new RegExp(defaultName, 'g'), formattedName)
      };
    }

    return baseConfig;
  });

  // Admin Mode detection: URL parameter ?admin=true or ?edit=true or triple-click audio player
  const params = new URLSearchParams(window.location.search);
  const urlAdmin = params.get('admin') === 'true' || params.get('edit') === 'true' || params.get('mode') === 'admin';
  const [isAdminState, setIsAdminState] = useState<boolean>(urlAdmin);

  // Step state: 1: Hero, 2: Puzzle, 3: Story, 4: Proposal
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [unlockedStep, setUnlockedStep] = useState<number>(1);
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('siddhi_romantic_config', JSON.stringify(config));
    document.title = `For ${config.partner2Name} 💖 - A Special Romantic Journey`;
    
    // Bind mobile touch audio unlock listener
    soundFx.bindMobileTouchUnlock();
  }, [config]);

  const advanceToNextStep = (nextStepNumber: number) => {
    if (nextStepNumber > unlockedStep) {
      setUnlockedStep(nextStepNumber);
    }
    setCurrentStep(nextStepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetConfig = () => {
    setConfig(defaultCoupleConfig);
    localStorage.removeItem('siddhi_romantic_config');
    setCurrentStep(1);
    setUnlockedStep(1);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-rose-50 font-sans selection:bg-rose-500 selection:text-white relative overflow-x-hidden flex flex-col">
      {/* Background Particles Canvas */}
      <FloatingParticles />

      {/* Top Controls */}
      <AudioPlayer onUnlockAdmin={() => setIsAdminState(true)} />

      {/* Admin Settings Modal & QR Code Scanner (Hidden by default for recipient girls) */}
      <CustomizerModal
        config={config}
        isAdmin={isAdminState}
        onSave={(newCfg) => setConfig(newCfg)}
        onReset={handleResetConfig}
      />

      {/* Step Container with AnimatePresence */}
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
            >
              <HeroSection
                config={config}
                onStart={() => advanceToNextStep(2)}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <JigsawPuzzle
                imageSrc={config.puzzleImage}
                partnerName={config.partner2Name}
                onSolveComplete={() => advanceToNextStep(3)}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <StoryScroll
                config={config}
                onReachEnd={() => advanceToNextStep(4)}
              />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
            >
              <ProposalSection
                partnerName={config.partner2Name}
                question={config.proposalQuestion}
                subtext={config.proposalSubtext}
                onYesClicked={() => setIsLetterOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Proposal Letter Reveal Modal */}
      <LoveLetterModal
        isOpen={isLetterOpen}
        config={config}
        onClose={() => setIsLetterOpen(false)}
      />
    </main>
  );
}

export default App;
