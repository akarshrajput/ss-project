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
      "Singify text to speech lets teams convert scripts into clean voice output for product demos, lessons, support flows, and social media audio. Our advanced neural networks ensure that the generated speech sounds natural and engaging, avoiding the robotic tone of traditional TTS systems.",
    useCases: [
      "Narration for explainers and tutorials",
      "Voice for web and mobile applications",
      "Automated support and onboarding audio",
      "Audiobooks and e-learning narration",
      "Voiceovers for marketing videos and ads",
      "Podcast intro and outro voiceovers",
    ],
    faqItems: [
      {
        question: "Can I control speaking style in text to speech?",
        answer:
          "Yes. Singify supports tone and delivery controls so output can match formal, friendly, or expressive use cases. You can adjust the energy level, pacing, and emotional undertone to fit your specific needs.",
      },
      {
        question: "Is text to speech suitable for product demos?",
        answer:
          "Yes. Teams use Singify text to speech for demos, onboarding flows, and support walkthrough narration. It provides a consistent and professional voice that can be updated instantly whenever your script changes.",
      },
      {
        question: "What languages and accents are supported?",
        answer:
          "Singify supports a wide range of global languages and regional accents. This allows you to localize your content effectively and reach a broader audience with native-sounding voices.",
      },
      {
        question: "Can I download the generated audio files?",
        answer:
          "Yes, once you generate the audio in the Studio, you can download it in high-quality formats such as WAV or MP3 for use in your projects.",
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
      "Singify AI music generation transforms lyrics and style prompts into polished tracks with genre, tempo, structure, and mood controls. Whether you need a background track for a video or a full song with lyrics, our platform delivers studio-quality results in seconds.",
    useCases: [
      "Background music for content creators",
      "Brand music experiments and ad campaigns",
      "Rapid music prototyping for product teams",
      "Custom soundtracks for video games",
      "Intro and outro music for podcasts",
      "Unique background scores for films and shorts",
    ],
    faqItems: [
      {
        question: "Can Singify generate music without hiring artists?",
        answer:
          "Yes. Singify is built for artist-free AI music generation with style, mood, and structure controls. This saves time and budget while giving you complete creative control over the output.",
      },
      {
        question: "Can I iterate music outputs quickly?",
        answer:
          "Yes. You can regenerate with adjusted prompts, tempo, and arrangement controls to reach target sound faster. Our platform allows for rapid experimentation to find the perfect match for your project.",
      },
      {
        question: "Do I own the rights to the generated music?",
        answer:
          "The ownership rights depend on your plan. Generally, tracks generated on paid tiers come with commercial usage rights, allowing you to use them in monetized content without copyright strikes.",
      },
      {
        question: "Can I generate music with vocals?",
        answer:
          "Yes, Singify can generate both instrumental tracks and songs with full AI-generated vocals based on the lyrics or prompts you provide.",
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
      "Singify voice generation helps teams produce consistent voice output for multiple channels while maintaining style and delivery targets. Create unique character voices or maintain a consistent brand voice across all your digital touchpoints.",
    useCases: [
      "Character and branded voice prototypes",
      "Multichannel campaign voice assets",
      "Internal product and UX voice testing",
      "Localized voice acting for global content",
      "Brand-specific virtual assistants",
      "Interactive voice response (IVR) systems",
    ],
    faqItems: [
      {
        question: "Is AI voice generation consistent across outputs?",
        answer:
          "Singify focuses on consistent delivery controls so teams can maintain recognizable voice style across projects. This is crucial for building brand identity and user trust.",
      },
      {
        question: "Can voice generation be used for marketing assets?",
        answer:
          "Yes. Teams often use generated voices for campaign variants, product explainers, and social content. It allows for quick testing of different messaging with different voice styles.",
      },
      {
        question: "How realistic are the generated voices?",
        answer:
          "Our platform uses state-of-the-art AI models that capture the nuances of human speech, including breath, intonation, and emotion, making the voices highly realistic and hard to distinguish from real recordings.",
      },
      {
        question: "Can I clone my own voice?",
        answer:
          "Voice cloning features are available on specific advanced plans. This allows you to create a digital replica of your voice for automated content generation.",
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
      "Singify poem to audio mode captures rhythm, pauses, and emotional contour so written poetry can become engaging listening experiences. Perfect for authors, educators, and creators looking to bring written words to life.",
    useCases: [
      "Poetry publishing and audiobook samples",
      "Creative writing showcases",
      "Narrative content for classrooms and workshops",
      "Soundscapes for meditation and relaxation",
      "Audio art installations and exhibitions",
      "Dramatic readings for theater and performance",
    ],
    faqItems: [
      {
        question: "Can poem-to-audio preserve rhythm and pauses?",
        answer:
          "Yes. Singify poem workflows are tuned for natural pacing and expressive cadence in poetic text. The system respects line breaks and punctuation to maintain the intended rhythm.",
      },
      {
        question: "Who uses poem-to-audio generation?",
        answer:
          "Writers, educators, and creative teams use poem-to-audio for publishing previews and spoken storytelling. It adds a professional audio dimension to written works easily.",
      },
      {
        question: "What voice options are available for poetry?",
        answer:
          "We offer a curated selection of voices specifically suited for expressive reading, ranging from soft and intimate to dramatic and powerful, allowing you to match the mood of your poem.",
      },
      {
        question: "Can I add background music to the poem audio?",
        answer:
          "Yes, you can combine the generated spoken word with background tracks from our AI music generator to create a complete audio experience.",
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
      "Singify speech tone tools provide practical controls for calm, energetic, formal, and expressive delivery profiles. Fine-tune your audio to ensure it resonates correctly with your target audience.",
    useCases: [
      "Tone matching for product announcements",
      "Localized communication variants",
      "Educational and customer-facing scripts",
      "A/B testing marketing messages with different tones",
      "Adapting content for different age groups",
      "Creating dynamic audio for interactive stories",
    ],
    faqItems: [
      {
        question: "What are speech tone tools useful for?",
        answer:
          "They help align generated speech with audience context, such as formal updates, friendly onboarding, or energetic promos. This ensures your message is received with the intended emotional impact.",
      },
      {
        question: "Can I test multiple tone styles quickly?",
        answer:
          "Yes. Singify lets you iterate tone, energy, and delivery so teams can compare options before publishing. This rapid prototyping saves time in the production cycle.",
      },
      {
        question: "How many distinct tones can I choose from?",
        answer:
          "We offer a wide spectrum of tone presets (e.g., professional, enthusiastic, empathetic, authoritative) as well as granular sliders for custom adjustments.",
      },
      {
        question: "Can I mix different tones in a single track?",
        answer:
          "Advanced editing features in the Studio allow you to apply different tone settings to different sections of the text for a more dynamic delivery.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return servicePages.find((service) => service.slug === slug);
}
