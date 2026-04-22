import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "FAQ — Text to Song & AI Music Generator Questions Answered",
  description: "Got questions about Songify? Learn how our free AI song generator turns text into songs, how the lyrics generator works, and what makes it the top AI music maker online.",
  path: "/faq",
});

const faqs = [
  {
    question: "What is a text to song AI and how does Songify work?",
    answer: "A text to song AI converts any written input — lyrics, a poem, a story, or even a single sentence — into a fully produced audio track. Songify's AI song generator reads your prompt, writes or adapts lyrics, selects a musical style, and renders a complete song in seconds. No music theory knowledge required.",
  },
  {
    question: "Is Songify really a free AI song generator?",
    answer: "Yes. Songify lets you generate your first song without creating an account and at zero cost. Guest mode gives you one free generation per session. Sign up for free to unlock more generations, cloud storage, and MP3 downloads — no credit card needed.",
  },
  {
    question: "How is Songify different from other AI music generators?",
    answer: "Most AI music generators create background music without vocals or lyrics. Songify is a complete AI song maker — it generates both the lyrics and the music together from a single text prompt. Think of it as a lyrics generator and an AI music maker rolled into one tool.",
  },
  {
    question: "Can I use Songify as a lyrics generator only?",
    answer: "Yes. In the Studio, switch the mode to \u2018Story \u2192 Song\u2019 or paste your own lyrics and set mode to \u2018Use as lyrics\u2019. Songify\u2019s AI lyrics generator will adapt your text into a structured song format (verse, chorus, bridge) before producing the final audio.",
  },
  {
    question: "What music genres does the AI song maker support?",
    answer: "Songify supports a wide range of genres including Pop, Folk, Lo-fi, Rock, Jazz, Orchestral, Techno, Ambient, Reggae, and Lullaby. You can also mix moods and scenes to create a truly unique sound — making it one of the most flexible AI music generators available.",
  },
  {
    question: "Which languages can the AI music maker produce songs in?",
    answer: "Currently Songify supports English, Hindi, Spanish, French, and German. Our AI lyrics generator has been tested with all five and produces natural, in-language output. More languages are being added — vote for yours in the community forum.",
  },
  {
    question: "How long does it take to generate a song?",
    answer: "Most songs are ready in under 60 seconds. Short clips (10–30 s) are typically done in 15–20 seconds. Longer tracks up to 3 minutes may take 45–90 seconds depending on server load. Songify is optimised to be the fastest free AI music generator online.",
  },
  {
    question: "Can I download the AI-generated songs as MP3?",
    answer: "Yes. Every track generated through Songify can be downloaded as an MP3 file. Logged-in users get instant one-click downloads from the Studio output panel and from their Library. Guest users can listen in-browser and sign up to save their track.",
  },
  {
    question: "Who owns the songs created by Songify's AI song generator?",
    answer: "You do. Songs generated with your prompt belong to you. Songify grants a broad licence for personal and commercial use. We recommend reading our Terms of Service for details on attribution and redistribution, especially for commercial projects.",
  },
  {
    question: "Can I use Songify as a song generator for kids' content?",
    answer: "Absolutely. Songify has a built-in Kid Safe mode that filters all output for family-friendly content. This makes it the ideal AI song maker for lullabies, classroom music, children's audiobooks, and educational videos.",
  },
  {
    question: "Does Songify work on mobile devices?",
    answer: "Yes. The Songify Studio and the homepage song generator are fully responsive and work on iOS and Android browsers. The waveform player, genre controls, and download button are all touch-friendly — create AI songs from your phone anywhere, anytime.",
  },
  {
    question: "Is Songify the top AI platform for song lyrics?",
    answer: "Songify is built specifically for the text-to-song use case: you type, AI writes the lyrics and composes the music. Unlike generic AI writing tools, Songify understands song structure (verse, pre-chorus, chorus, bridge) and produces output that sounds like a real track — making it one of the top AI platforms for song lyrics online.",
  },
];

export default function FaqPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ]);
  const faqSchema = buildFaqSchema(faqs);

  return (
    <main className="site-container w-full flex-1 flex-col px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <div style={{ maxWidth: 640, marginBottom: "3rem" }}>
        <p className="section-eyebrow mb-3">FAQ</p>
        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
          Frequently asked questions
        </h1>
      </div>

      <div style={{ maxWidth: 740, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {faqs.map((item, i) => (
          <article key={item.question} className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-violet)", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                {i + 1}
              </span>
              <div>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                  {item.question}
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {item.answer}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
