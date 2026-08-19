import type { CoupleConfig } from '../types';
import { resolveAssetUrl } from './assetResolver';

export const defaultCoupleConfig: CoupleConfig = {
  partner1Name: 'You',
  partner2Name: 'Siddhi',
  anniversaryDate: '2024-02-14',
  heroQuote1: 'Some people search their whole lives for what I found the moment I met you',
  heroQuote2: "I made you a little puzzle... because you're the missing piece I never knew I needed",
  heroQuote3: 'Solve it, and let me take you on a journey ✨',
  puzzleImage: resolveAssetUrl('images/couple_puzzle.jpg'),
  storySlides: [
    {
      title: 'Hey Siddhi...',
      message: 'I remember the exact moment you walked into my life.',
      subtext: 'Everything else just... disappeared into the background.'
    },
    {
      title: "Since that day, I can't stop thinking about you.",
      message: "You're the first person I want to tell everything to.",
      subtext: 'Mornings start with you on my mind.'
    },
    {
      title: 'With you, I feel truly alive.',
      message: 'I can finally be myself.',
      subtext: 'You make me brighter, kinder, better in every way.'
    },
    {
      title: "I'm terrified of ever losing you.",
      message: "You've become my everything — my reason to smile, my safe place, my home.",
      subtext: 'My home is wherever you are.'
    }
  ],
  proposalQuestion: 'So under these stars, I want to ask...',
  proposalSubtext: 'Will you be mine? Not just tonight, not just tomorrow — but always. Forever. ❤️',
  loveLetterTitle: 'To My Dearest Siddhi 💌',
  loveLetterBody: `My Dearest Siddhi,

From the very first moment our paths crossed, my world gained colors I never knew existed. Your smile lightens up even my darkest days, and your laughter is my absolute favorite melody in the world.

You are the missing piece to my puzzle of happiness, my secret wish upon every shooting star, and the reason my heart beats a little faster every single day. Thank you for being you, for filling my life with endless warmth, sweetness, and joy.

I promise to hold your hand through every chapter of our lives, to stand by you in every storm, and to love you more with every passing sunset.

Here is to our forever journey, hand in hand, today and always.

Forever & Always Yours ❤️`
};
