import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Eye, Sparkles, Heart, ArrowDown, Wand2, Hash, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/soundEffects';
import { resolveAssetUrl } from '../utils/assetResolver';

interface JigsawProps {
  imageSrc: string;
  partnerName: string;
  onSolveComplete: () => void;
}

export const JigsawPuzzle: React.FC<JigsawProps> = ({ imageSrc, partnerName, onSolveComplete }) => {
  const GRID_SIZE = 3;
  const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

  const [tiles, setTiles] = useState<number[]>([]);
  const [emptyIndex, setEmptyIndex] = useState<number>(TOTAL_TILES - 1);
  const [moves, setMoves] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showNumbers, setShowNumbers] = useState<boolean>(true);
  const [isEasyMode, setIsEasyMode] = useState<boolean>(true);

  // Dynamically resolve image source for GitHub Pages / Localhost
  const resolvedImageSrc = resolveAssetUrl(imageSrc || 'images/couple_puzzle.jpg');

  // Smart Easy Shuffle (guaranteed non-backtracking 4 moves away from solved state)
  const shuffleTiles = useCallback((easy: boolean = true) => {
    const arr = Array.from({ length: TOTAL_TILES }, (_, i) => i);
    let emptyIdx = TOTAL_TILES - 1;
    const numMoves = easy ? 4 : 35;
    let prevIdx = -1;

    for (let i = 0; i < numMoves; i++) {
      const row = Math.floor(emptyIdx / GRID_SIZE);
      const col = emptyIdx % GRID_SIZE;
      const neighbors: number[] = [];

      if (row > 0) neighbors.push(emptyIdx - GRID_SIZE);
      if (row < GRID_SIZE - 1) neighbors.push(emptyIdx + GRID_SIZE);
      if (col > 0) neighbors.push(emptyIdx - 1);
      if (col < GRID_SIZE - 1) neighbors.push(emptyIdx + 1);

      const validNeighbors = neighbors.filter((n) => n !== prevIdx);
      const chosenNeighbor = validNeighbors.length > 0
        ? validNeighbors[Math.floor(Math.random() * validNeighbors.length)]
        : neighbors[Math.floor(Math.random() * neighbors.length)];

      arr[emptyIdx] = arr[chosenNeighbor];
      arr[chosenNeighbor] = TOTAL_TILES - 1;
      prevIdx = emptyIdx;
      emptyIdx = chosenNeighbor;
    }

    setTiles(arr);
    setEmptyIndex(emptyIdx);
    setMoves(0);
    setIsSolved(false);
  }, [TOTAL_TILES, GRID_SIZE]);

  useEffect(() => {
    shuffleTiles(isEasyMode);
  }, [shuffleTiles, isEasyMode]);

  // Check if puzzle is solved
  const checkWin = (currentTiles: number[]) => {
    for (let i = 0; i < TOTAL_TILES; i++) {
      if (currentTiles[i] !== i) return false;
    }
    return true;
  };

  // Handle tile slide click / touch
  const handleTileClick = (clickedIndex: number) => {
    if (isSolved) return;

    const clickedRow = Math.floor(clickedIndex / GRID_SIZE);
    const clickedCol = clickedIndex % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;

    // Check if clicked tile is adjacent to empty space
    const isAdjacent =
      (Math.abs(clickedRow - emptyRow) === 1 && clickedCol === emptyCol) ||
      (Math.abs(clickedCol - emptyCol) === 1 && clickedRow === emptyRow);

    if (isAdjacent) {
      soundFx.playTileSwap();
      const newTiles = [...tiles];
      newTiles[emptyIndex] = newTiles[clickedIndex];
      newTiles[clickedIndex] = TOTAL_TILES - 1;

      const newMoves = moves + 1;
      setTiles(newTiles);
      setEmptyIndex(clickedIndex);
      setMoves(newMoves);

      if (checkWin(newTiles)) {
        setIsSolved(true);
        soundFx.playPuzzleSolveFanfare();
        confetti({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.6 }
        });
      }
    }
  };

  // Magic Auto Solve
  const handleMagicSolve = () => {
    soundFx.playPuzzleSolveFanfare();
    const solvedArray = Array.from({ length: TOTAL_TILES }, (_, i) => i);
    setTiles(solvedArray);
    setEmptyIndex(TOTAL_TILES - 1);
    setIsSolved(true);
    confetti({
      particleCount: 170,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  // Calculate background offset for piece
  const getPieceBgStyle = (tileVal: number) => {
    const row = Math.floor(tileVal / GRID_SIZE);
    const col = tileVal % GRID_SIZE;
    const bgX = (col / (GRID_SIZE - 1)) * 100;
    const bgY = (row / (GRID_SIZE - 1)) * 100;
    return {
      backgroundImage: `url("${resolvedImageSrc}")`,
      backgroundSize: '300% 300%',
      backgroundPosition: `${bgX}% ${bgY}%`
    };
  };

  return (
    <div id="puzzle-section" className="relative min-h-screen py-16 px-4 flex flex-col items-center justify-center">
      {/* Main Container Glass Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-rose-500/20 shadow-2xl shadow-rose-950/50 flex flex-col items-center text-center"
      >
        {/* Title */}
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-6 h-6 text-rose-400 fill-rose-500 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-rose-100">
            Can you piece us together? 💕
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-rose-200/80 mb-5">
          Hey {partnerName}... Just 3-4 simple clicks to solve and unlock our story!
        </p>

        {/* Toolbar */}
        <div className="w-full flex items-center justify-between px-3 py-2 mb-4 bg-white/5 rounded-2xl border border-white/10 text-xs sm:text-sm text-rose-200 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-rose-300">Moves: {moves}</span>
            <button
              onClick={() => {
                const nextEasy = !isEasyMode;
                setIsEasyMode(nextEasy);
                shuffleTiles(nextEasy);
              }}
              className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 text-[11px] font-medium border border-rose-400/30 flex items-center gap-1"
            >
              <Smile className="w-3 h-3 text-pink-300" />
              <span>{isEasyMode ? 'Easy 💕' : 'Hard 🔥'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setShowNumbers(!showNumbers)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all text-xs ${
                showNumbers
                  ? 'bg-rose-500/20 text-rose-200 border-rose-400/40'
                  : 'bg-white/5 text-rose-300/60 border-white/10'
              }`}
              title="Toggle Numbers Helper"
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Numbers</span>
            </button>

            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 transition-all text-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => shuffleTiles(isEasyMode)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-rose-100 transition-all text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>

            <button
              onClick={handleMagicSolve}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 transition-all text-xs font-medium"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Solve 🪄</span>
            </button>
          </div>
        </div>

        {/* Full Image Preview Modal */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden border-2 border-rose-400/40 shadow-lg"
            >
              <img src={resolvedImageSrc} alt="Preview" className="w-full h-full object-cover" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3x3 SLIDING JIGSAW PUZZLE GRID */}
        <div className="relative w-full aspect-square grid grid-cols-3 gap-2 p-2.5 bg-slate-950/90 rounded-2xl border border-rose-500/30 shadow-inner overflow-hidden select-none">
          {tiles.map((tileVal, idx) => {
            const isBlank = tileVal === TOTAL_TILES - 1 && !isSolved;
            const isClickable = !isSolved && !isBlank;

            return (
              <motion.button
                key={idx}
                layout
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                onClick={() => handleTileClick(idx)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleTileClick(idx);
                }}
                disabled={!isClickable}
                className={`relative w-full h-full rounded-xl overflow-hidden border transition-all touch-manipulation select-none ${
                  isBlank
                    ? 'border-dashed border-rose-500/20 bg-transparent'
                    : 'border-rose-300/40 shadow-md cursor-pointer hover:border-rose-400 active:scale-95 ring-1 ring-white/10'
                }`}
                style={{
                  touchAction: 'manipulation',
                  boxShadow: !isBlank ? 'inset 0 0 10px rgba(0,0,0,0.3), 0 4px 6px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                {!isBlank && (
                  <div className="relative w-full h-full pointer-events-none">
                    {/* Jigsaw Tile Image */}
                    <div
                      className="w-full h-full bg-cover"
                      style={getPieceBgStyle(tileVal)}
                    />

                    {/* Jigsaw Interlocking Cutout Effect Overlay */}
                    <div className="absolute inset-0 border border-white/15 pointer-events-none rounded-xl" />

                    {/* Tile Number Helper Badge */}
                    {showNumbers && (
                      <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-pink-200 border border-pink-400/40 flex items-center justify-center shadow pointer-events-none">
                        {tileVal + 1}
                      </div>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* SOLVED CELEBRATION */}
        <AnimatePresence>
          {isSolved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-rose-500/30 via-pink-500/30 to-amber-500/30 border border-rose-400/50 flex flex-col items-center gap-3 w-full"
            >
              <div className="flex items-center gap-2 text-amber-200 font-medium">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>You did it in {moves} moves! 🎉</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSolveComplete}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
              >
                <span>Wanna join the journey with me?</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
