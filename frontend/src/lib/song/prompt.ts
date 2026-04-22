import type { SongGenerateInput } from "@/lib/song/types";

const GENRE_MACROS: Record<string, string> = {
  Lullaby:
    "gentle lullaby, soft acoustic guitar, warm glockenspiel melody, tender cello undertone, cozy bedtime atmosphere",
  Pop: "upbeat children pop, catchy hook, bright piano, bouncy percussion, modern clean mix",
  Folk: "warm acoustic folk, fingerpicked guitar, ukulele support, gentle hand percussion, storytelling tone",
  Orchestral:
    "cinematic orchestral score, warm strings, playful woodwinds, harp transitions, adventurous family-safe mood",
  Jazz: "playful jazz, soft upright piano, brushed snare swing, warm vibraphone, fun and lively",
  Techno:
    "futuristic electronic, bright synth melody, light kick pulse, sparkly arpeggios, child-safe energy",
  "Lo-fi": "cozy lo-fi, warm vinyl texture, mellow chords, soft beats, nostalgic calm mood",
  Rock: "fun rock anthem, clean guitar riffs, punchy drums, uplifting chorus, playful confidence",
  Ambient:
    "peaceful ambient soundscape, evolving pads, nature textures, no heavy percussion, dreamy and calm",
  Reggae: "cheerful reggae groove, offbeat guitar, smooth bass, sunny tropical warmth, uplifting vibe",
};

const MOOD_MACROS: Record<string, string> = {
  happy: "happy, joyful, uplifting",
  calm: "calm, peaceful, serene",
  playful: "playful, bouncy, fun",
  mysterious: "mysterious, curious, wonder-filled",
  epic: "epic, heroic, cinematic",
  cute: "cute, sweet, adorable",
  sad: "gentle melancholy, tender emotion",
  energetic: "high energy, vibrant, exciting",
  spooky: "mildly spooky, playful halloween, child-safe",
  dreamy: "dreamy, whimsical, magical",
};

const SCENE_MACROS: Record<string, string> = {
  Forest: "enchanted forest, birds and leaves ambience",
  Space: "outer space adventure, twinkling cosmos ambience",
  Ocean: "gentle ocean waves, sparkling underwater wonder",
  Castle: "fairy-tale castle atmosphere, magical kingdom tone",
  City: "friendly city ambience, urban adventure mood",
  Classroom: "school discovery atmosphere, educational warmth",
  Playground: "playground laughter, sunny active fun",
  Nighttime: "peaceful nighttime sky, moonlit calm",
  Farm: "sunny farm, countryside warmth, playful animals",
  Jungle: "tropical jungle exploration, adventurous curiosity",
};

const VOCAL_MACROS: Record<string, string> = {
  "Female vocal": "warm female vocalist, clear diction",
  "Male vocal": "friendly male vocalist, clear diction",
  "Child voice": "bright child-like voice, innocent tone",
  Choir: "soft children choir, warm harmony",
  Rap: "playful child-safe rap rhythm, expressive spoken cadence",
  Instrumental: "fully instrumental, no vocals",
};

const STRUCTURE_MACROS: Record<string, string> = {
  Loop: "seamless looping structure, stable arrangement",
  "Verse+Chorus": "clear verse and chorus structure, memorable hook",
  "Story Arc": "narrative musical arc with beginning middle and ending",
  "Build-up": "gradual dynamic build from simple start to rich finish",
};

export function buildTags(input: SongGenerateInput) {
  const parts: string[] = [input.basePrompt.trim()];

  if (input.genre && GENRE_MACROS[input.genre]) {
    parts.push(GENRE_MACROS[input.genre]);
  }

  if (input.moods.length > 0) {
    parts.push(input.moods.map((mood) => MOOD_MACROS[mood] ?? mood).join(", "));
  }

  if (input.scene && SCENE_MACROS[input.scene]) {
    parts.push(SCENE_MACROS[input.scene]);
  }

  parts.push(VOCAL_MACROS[input.vocalType] ?? input.vocalType);

  if (input.vocalType !== "Instrumental" && input.vocalStyles.length > 0) {
    parts.push(input.vocalStyles.join(", "));
  }

  if (input.energy < 33) {
    parts.push("minimal dynamics, sparse arrangement, calm intensity");
  } else if (input.energy < 67) {
    parts.push("balanced dynamics, moderate arrangement density");
  } else {
    parts.push("high dynamics, rich arrangement density, stronger impact");
  }

  if (input.complexity < 35) {
    parts.push("simple arrangement, few instruments, clean spacing");
  } else if (input.complexity < 70) {
    parts.push("medium complexity arrangement, tasteful layering");
  } else {
    parts.push("complex layered arrangement, lush production");
  }

  if (STRUCTURE_MACROS[input.structure]) {
    parts.push(STRUCTURE_MACROS[input.structure]);
  }

  if (input.language === "de") {
    parts.push("German vocals, Hochdeutsch, clear pronunciation");
  } else if (input.language === "hi") {
    parts.push("Hindi vocals, clear pronunciation");
  } else if (input.language === "en" && input.accent !== "Neutral") {
    parts.push(`${input.accent} English accent`);
  }

  if (input.kidSafe) {
    parts.push("child-safe content, no harmful themes, family friendly");
  }

  return parts.filter(Boolean).join(", ");
}

export function buildLyrics(input: SongGenerateInput) {
  if (input.lyricsMode === "instrumental") {
    return "";
  }

  if (input.lyricsMode === "story") {
    return `\n[verse 1]\n${input.lyrics}\n\n[chorus]\nla la la, sing with me\nla la la, bright and free\n`;
  }

  return input.lyrics;
}

export function buildWorkflow(params: {
  tags: string;
  lyrics: string;
  seed: number;
  duration: number;
  bpm: number;
  language: string;
  keyScale: string;
  timeSignature: string;
}) {
  return {
    "104": {
      class_type: "UNETLoader",
      inputs: { unet_name: "acestep_v1.5_turbo.safetensors", weight_dtype: "default" },
    },
    "105": {
      class_type: "DualCLIPLoader",
      inputs: {
        clip_name1: "qwen_0.6b_ace15.safetensors",
        clip_name2: "qwen_1.7b_ace15.safetensors",
        type: "ace",
        device: "default",
      },
    },
    "106": {
      class_type: "VAELoader",
      inputs: { vae_name: "ace_1.5_vae.safetensors" },
    },
    "78": {
      class_type: "ModelSamplingAuraFlow",
      inputs: { model: ["104", 0], shift: 3 },
    },
    "94": {
      class_type: "TextEncodeAceStepAudio1.5",
      inputs: {
        clip: ["105", 0],
        tags: params.tags,
        lyrics: params.lyrics,
        seed: params.seed,
        bpm: params.bpm,
        duration: params.duration,
        timesignature: String(params.timeSignature),
        language: params.language,
        keyscale: params.keyScale,
        generate_audio_codes: true,
        cfg_scale: 2,
        temperature: 0.85,
        top_p: 0.9,
        top_k: 0,
        min_p: 0,
      },
    },
    "98": {
      class_type: "EmptyAceStep1.5LatentAudio",
      inputs: { seconds: params.duration, batch_size: 1 },
    },
    "47": {
      class_type: "ConditioningZeroOut",
      inputs: { conditioning: ["94", 0] },
    },
    "3": {
      class_type: "KSampler",
      inputs: {
        model: ["78", 0],
        positive: ["94", 0],
        negative: ["47", 0],
        latent_image: ["98", 0],
        seed: params.seed,
        steps: 8,
        cfg: 1,
        sampler_name: "euler",
        scheduler: "simple",
        denoise: 1,
      },
    },
    "18": {
      class_type: "VAEDecodeAudio",
      inputs: { samples: ["3", 0], vae: ["106", 0] },
    },
    "107": {
      class_type: "SaveAudioMP3",
      inputs: { audio: ["18", 0], filename_prefix: "audio/ComfyUI", quality: "320k" },
    },
  };
}
