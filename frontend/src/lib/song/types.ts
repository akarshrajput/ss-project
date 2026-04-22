export const LYRICS_MODES = ["use", "story", "instrumental"] as const;

export type LyricsMode = (typeof LYRICS_MODES)[number];

export type SongGenerateInput = {
  basePrompt: string;
  lyrics: string;
  lyricsMode: LyricsMode;
  genre: string | null;
  moods: string[];
  scene: string | null;
  vocalType: string;
  vocalStyles: string[];
  language: string;
  accent: string;
  bpm: number;
  energy: number;
  keyScale: string;
  length: number;
  structure: string;
  complexity: number;
  seed: number;
  vibeLock: boolean;
  kidSafe: boolean;
  timeSignature: "3" | "4" | "6";
};

export type SongGenerateResult = {
  promptId: string;
  tags: string;
  audioUrl: string;
  persistedAudioUrl?: string;
  seed: number;
};
