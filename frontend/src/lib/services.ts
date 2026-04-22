export type ServicePage = {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  useCases: string[];
  faqItems: Array<{ question: string; answer: string }>;
};

export const servicePages: ServicePage[] = [
  {
    slug: "text-to-speech",
    name: "Text to Speech",
    title: "Text to Speech Generator",
    description:
      "Convert text into clear, natural speech with controllable tone and delivery for content, apps, and narration workflows.",
    intro:
      "Songify text to speech lets teams convert scripts into clean voice output for product demos, lessons, support flows, and social media audio.",
    useCases: [
      "Narration for explainers and tutorials",
      "Voice for web and mobile applications",
      "Automated support and onboarding audio",
    ],
    faqItems: [
      {
        question: "Can I control speaking style in text to speech?",
        answer:
          "Yes. Songify supports tone and delivery controls so output can match formal, friendly, or expressive use cases.",
      },
      {
        question: "Is text to speech suitable for product demos?",
        answer:
          "Yes. Teams use Songify text to speech for demos, onboarding flows, and support walkthrough narration.",
      },
    ],
  },
  {
    slug: "ai-music-generation",
    name: "AI Music Generation",
    title: "AI Music Generation Platform",
    description:
      "Generate artist-free AI music from prompts, genres, and mood controls for videos, podcasts, products, and branded campaigns.",
    intro:
      "Songify AI music generation transforms lyrics and style prompts into polished tracks with genre, tempo, structure, and mood controls.",
    useCases: [
      "Background music for content creators",
      "Brand music experiments and ad campaigns",
      "Rapid music prototyping for product teams",
    ],
    faqItems: [
      {
        question: "Can Songify generate music without hiring artists?",
        answer:
          "Yes. Songify is built for artist-free AI music generation with style, mood, and structure controls.",
      },
      {
        question: "Can I iterate music outputs quickly?",
        answer:
          "Yes. You can regenerate with adjusted prompts, tempo, and arrangement controls to reach target sound faster.",
      },
    ],
  },
  {
    slug: "voice-generation",
    name: "Voice Generation",
    title: "AI Voice Generation",
    description:
      "Create synthetic voices with controllable tone, pacing, and expression for product voice layers and content pipelines.",
    intro:
      "Songify voice generation helps teams produce consistent voice output for multiple channels while maintaining style and delivery targets.",
    useCases: [
      "Character and branded voice prototypes",
      "Multichannel campaign voice assets",
      "Internal product and UX voice testing",
    ],
    faqItems: [
      {
        question: "Is AI voice generation consistent across outputs?",
        answer:
          "Songify focuses on consistent delivery controls so teams can maintain recognizable voice style across projects.",
      },
      {
        question: "Can voice generation be used for marketing assets?",
        answer:
          "Yes. Teams often use generated voices for campaign variants, product explainers, and social content.",
      },
    ],
  },
  {
    slug: "poem-to-audio",
    name: "Poem to Audio",
    title: "Poem to Audio Converter",
    description:
      "Turn poems and literary text into expressive audio with natural pacing and emotional tone suitable for publishing and storytelling.",
    intro:
      "Songify poem to audio mode captures rhythm, pauses, and emotional contour so written poetry can become engaging listening experiences.",
    useCases: [
      "Poetry publishing and audiobook samples",
      "Creative writing showcases",
      "Narrative content for classrooms and workshops",
    ],
    faqItems: [
      {
        question: "Can poem-to-audio preserve rhythm and pauses?",
        answer:
          "Yes. Songify poem workflows are tuned for natural pacing and expressive cadence in poetic text.",
      },
      {
        question: "Who uses poem-to-audio generation?",
        answer:
          "Writers, educators, and creative teams use poem-to-audio for publishing previews and spoken storytelling.",
      },
    ],
  },
  {
    slug: "speech-tone-tools",
    name: "Speech Tone Tools",
    title: "Speech Tone and Delivery Tools",
    description:
      "Adjust speech tone, intensity, and style so generated audio matches the context, audience, and communication intent.",
    intro:
      "Songify speech tone tools provide practical controls for calm, energetic, formal, and expressive delivery profiles.",
    useCases: [
      "Tone matching for product announcements",
      "Localized communication variants",
      "Educational and customer-facing scripts",
    ],
    faqItems: [
      {
        question: "What are speech tone tools useful for?",
        answer:
          "They help align generated speech with audience context, such as formal updates, friendly onboarding, or energetic promos.",
      },
      {
        question: "Can I test multiple tone styles quickly?",
        answer:
          "Yes. Songify lets you iterate tone, energy, and delivery so teams can compare options before publishing.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return servicePages.find((service) => service.slug === slug);
}
