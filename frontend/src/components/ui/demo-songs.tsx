import Link from "next/link";
import { WavePlayer } from "@/components/ui/wave-player";

const DEMO_SONGS = [
  {
    title: "Poem Song",
    lyrics: `I still remember that winter café near the station,
You kept drawing stars on the tissue while pretending not to look at me.
Outside, the rain was loud enough to hide our awkward silence,
But somehow your laugh stayed in my head longer than the storm.
Now every midnight feels unfinished,
Like a book missing its final page.
I walk past strangers hoping one of them turns around like you did,
But cities move on faster than memories ever can.`,
    basePrompt: "Soft emotional piano with cinematic strings, poetic spoken-word feeling, rainy atmosphere, intimate late-night vibe",
    vocalType: "Female voice",
    duration: "2 min",
    genre: "Classical",
    mood: "Dreamy",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpc5jq39-lk7xtq-1779174226097.mp3",
    listenLink: "https://www.singify.fun/song/mpc5jq39-lk7xtq",
    accent: "#6366f1",
  },
  {
    title: "Funny Song",
    lyrics: `You changed the WiFi password after our breakup,
Now even my smart TV feels betrayed.
Spotify stopped in the middle of my sad playlist,
And Netflix asked, "Are you still watching?"
No bro, emotionally I'm not.
Your new boyfriend probably gets full network bars,
While I'm sitting here reconnecting my life every five seconds.
I miss you a little...
But honestly I miss the unlimited internet more.`,
    basePrompt: "Funny upbeat pop track with meme energy, quirky synths, humorous storytelling vocals, catchy social-media style chorus",
    vocalType: "Male voice",
    duration: "60s",
    genre: "Pop",
    mood: "Happy",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpc5kgji-rv6kqx-1779174207335.mp3",
    listenLink: "https://www.singify.fun/song/mpc5kgji-rv6kqx",
    accent: "#2dd4bf",
  },
  {
    title: "Beats Song",
    lyrics: `2 AM and the city still glowing like it never sleeps,
Streetlights reflecting on the windshield while the bass keeps shaking the seats.
No destination, just driving through neon highways,
Thinking about old mistakes like they're part of the playlist.
Every red light feels cinematic,
Every cigarette smoke disappears into the rain.
Maybe freedom is just loud music and empty roads,
Maybe healing sounds exactly like this beat.`,
    basePrompt: "Dark trap beat with futuristic synths, deep 808 bass, cyberpunk night-drive atmosphere, smooth transitions",
    vocalType: "Male voice",
    duration: "1 min",
    genre: "Hip-Hop",
    mood: "Dark",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpasbr6i-b7hgb1-1779083810845.mp3",
    listenLink: "https://www.singify.fun/song/mpasbr6i-b7hgb1",
    accent: "#a855f7",
  },
  {
    title: "Funk Song",
    lyrics: `Tonight I walked into the club like rent was already paid,
Gold lights everywhere, confidence shining brighter than my chain.
DJ dropped the beat and suddenly nobody had problems anymore,
Even heartbreak started dancing near the disco floor.
My shoes got more moves than my entire life plan,
And somehow strangers became best friends for three whole songs.
If tomorrow gets messy, that's tomorrow's problem,
Tonight we dance until the sunrise forgives us.`,
    basePrompt: "Retro disco funk with groovy bass guitar, dancefloor energy, live drums, stylish 70s nightclub vibe",
    vocalType: "Female voice",
    duration: "2 min",
    genre: "Jazz",
    mood: "Upbeat",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpc5odd5-kjjqpw-1779174189408.mp3",
    listenLink: "https://www.singify.fun/song/mpc5odd5-kjjqpw",
    accent: "#f59e0b",
  },
  {
    title: "Lyrics Song",
    lyrics: `The last train always feels quieter than the others,
Like everyone inside is carrying something they never talk about.
I kept staring at your old messages while stations passed by,
Reading conversations that sounded happier months ago.
An old man beside me fell asleep holding flowers,
And suddenly I wondered if love always becomes memory this slowly.
The city lights blurred against the window,
And for the first time I didn't know where home really was.`,
    basePrompt: "Indie acoustic storytelling song with emotional vocals, soft guitar, realistic human feeling, late-night travel atmosphere",
    vocalType: "Male voice",
    duration: "2 min",
    genre: "Folk",
    mood: "Melancholic",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpasczu3-c5atxz-1779083777473.mp3",
    listenLink: "https://www.singify.fun/song/mpasczu3-c5atxz",
    accent: "#06b6d4",
  },
  {
    title: "Sad Song",
    lyrics: `Your hoodie still hangs behind the bedroom door,
And I still haven't found the courage to move it.
It's strange how a room can stay exactly the same,
But feel completely different after someone leaves.
I tried sleeping early just to avoid thinking,
But memories somehow stay awake longer than people do.
The silence here is heavier at night,
Like even the walls know you're not coming back.`,
    basePrompt: "Heartbreaking piano ballad with emotional ambience, soft female vocals, cinematic sadness, slow emotional pacing",
    vocalType: "Female voice",
    duration: "2 min",
    genre: "R&B",
    mood: "Sad",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpc5qk54-f60ctn-1779172801317.mp3",
    listenLink: "https://www.singify.fun/song/mpc5qk54-f60ctn",
    accent: "#ef4444",
  },
  {
    title: "Motivational Song",
    lyrics: `I know what failure tastes like,
Cold nights, empty pockets, unanswered calls.
I know how it feels watching everyone move ahead,
While you're still trying to figure yourself out.
But pressure creates diamonds, not comfort.
Every scar on me came with a lesson attached.
Maybe I'm not there yet,
But every single day I'm becoming harder to stop.
One day the same people who doubted me
Will call my journey "luck."
They won't see the nights I kept going
When quitting would've been easier.`,
    basePrompt: "Powerful cinematic motivational anthem with emotional build-up, energetic drums, inspiring chorus and strong progression",
    vocalType: "Male voice",
    duration: "2 min",
    genre: "Rock",
    mood: "Energetic",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpc5s2kw-nyvjyf-1779172780200.mp3",
    listenLink: "https://www.singify.fun/song/mpc5s2kw-nyvjyf",
    accent: "#22c55e",
  },
  {
    title: "Horror Song",
    lyrics: `Every night at exactly 3:14,
The hallway light turns on by itself.
No footsteps. No shadows.
Just silence so loud it feels alive.
Yesterday I heard whispering behind my bedroom wall,
Soft enough to sound human, wrong enough to not be.
I tried recording it on my phone,
But the audio only captured my breathing.
Now I don't sleep with the mirror uncovered anymore,
Because sometimes the reflection moves slower than I do.`,
    basePrompt: "Dark horror ambience with eerie whispers, cinematic tension, unsettling atmosphere, deep suspense bass",
    vocalType: "Female voice",
    duration: "2 min",
    genre: "EDM",
    mood: "Dark",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpasf1n2-er2gui-1779083727318.mp3",
    listenLink: "https://www.singify.fun/song/mpc5vcps-cadck1",
    accent: "#e879f9",
  },
  {
    title: "Anime Opening Song",
    lyrics: `We were just kids chasing impossible dreams,
Running through storms like the world belonged to us.
Everybody said we would fall eventually,
But they never understood how strong hope can become.
Even if tomorrow breaks apart around us,
I'll still keep moving forward with this fire inside me.
Through every battle, every scar, every goodbye,
We'll keep reaching higher than the sky above.
This isn't the end of our story,
It's only the opening scene.`,
    basePrompt: "High-energy anime opening with emotional vocals, electric guitars, fast drums, heroic uplifting atmosphere",
    vocalType: "Children",
    duration: "1 min",
    genre: "Rock",
    mood: "Energetic",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpasg4qa-mfjqva-1779083714673.mp3",
    listenLink: "https://www.singify.fun/song/mpasg4qa-mfjqva",
    accent: "#fb7185",
  },
  {
    title: "Travel Song",
    lyrics: `I took the windowside seat just to watch the cities change,
Different roads, different faces, but somehow I still feel the same.
A little café near the mountains played an old love song,
And for a second it felt like life was finally slowing down.
Backpack full of clothes, mind full of unfinished thoughts,
Trying to outrun memories through airports and train stops.
Maybe people don't travel to escape places,
Maybe they travel hoping to find a new version of themselves.
Tonight the hotel lights feel peaceful,
And tomorrow the road begins again.`,
    basePrompt: "Warm indie travel song with acoustic guitar, road-trip atmosphere, cinematic scenery feeling, emotional but hopeful vocals",
    vocalType: "Male voice",
    duration: "1 min",
    genre: "Folk",
    mood: "Calm",
    songLink: "https://wrehkhvdxnpqturqquqr.supabase.co/storage/v1/object/public/songs/0feb3a23-e20d-4678-82e5-907b816d8d21/community-mpash5vx-jh100c-1779083699270.mp3",
    listenLink: "https://www.singify.fun/song/mpash5vx-jh100c",
    accent: "#14b8a6",
  },
];

export function DemoSongs() {
  return (
    <section className="site-container px-4 pt-16 sm:px-6 lg:px-8" aria-labelledby="demo-songs-heading">
      <div className="text-center mb-10">

        <h2 id="demo-songs-heading" className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Experience the Magic of AI Music
        </h2>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Listen to a few amazing track examples generated by our community.
          From poetic melodies to upbeat pop, discover what you can create.
        </p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {DEMO_SONGS.map((song, index) => (
          <article
            key={song.title}
            className="glass-card glass-card-glow h-full overflow-hidden"
            style={{ borderColor: `${song.accent}24` }}
          >
            <div className="flex flex-col gap-6 px-6 py-6">
              {/* <div>
                <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {song.title}
                </h3>
              </div> */}

              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>
                  Lyrics
                </p>
                <p className="mt-3 whitespace-pre-line text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
                  {song.lyrics.split("\n").slice(0, 4).join("\n")}
                </p>
              </div>

              <div>
                {/* <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>
                  Play here
                </p> */}
                <div className="mt-3 w-full">
                  <WavePlayer
                    src={song.songLink}
                    title={song.title}
                    artist="AI Generated"
                    genre={song.genre}
                    duration={song.duration}
                    accent={song.accent}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}