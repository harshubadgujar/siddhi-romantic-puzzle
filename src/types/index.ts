export interface CoupleConfig {
  partner1Name: string;
  partner2Name: string; // Siddhi
  anniversaryDate: string;
  heroQuote1: string;
  heroQuote2: string;
  heroQuote3: string;
  puzzleImage: string;
  storySlides: {
    title: string;
    message: string;
    subtext: string;
  }[];
  proposalQuestion: string;
  proposalSubtext: string;
  loveLetterTitle: string;
  loveLetterBody: string;
}
