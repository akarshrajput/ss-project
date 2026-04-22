export async function GET() {
  const content = [
    "# Songify",
    "",
    "Songify is a Next.js application for AI text-to-song, music generation, speech generation, and audio workflow discovery.",
    "",
    "## Key pages",
    "- /",
    "- /studio",
    "- /pricing",
    "- /services",
    "- /services/text-to-speech",
    "- /services/ai-music-generation",
    "- /services/voice-generation",
    "- /services/poem-to-audio",
    "- /services/speech-tone-tools",
    "- /faq",
    "- /about",
    "- /contact",
    "- /terms",
    "- /privacy",
    "",
    "## Notes",
    "- Public pages are indexable and contain descriptive copy for crawlers.",
    "- The Studio is the primary product entry point.",
    "- Pricing is a standalone page and should not redirect.",
  ].join("\n");

  return new Response(content, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}