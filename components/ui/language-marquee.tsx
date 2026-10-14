"use client";

const PHRASES = [
  { text: "हाँ, मैं तैयार हूँ", lang: "Hindi" },
  { text: "I do", lang: "English" },
  { text: "ஆம், நான் தயார்", lang: "Tamil" },
  { text: "جی ہاں، میں تیار ہوں", lang: "Urdu" },
  { text: "হ্যাঁ, আমি প্রস্তুত", lang: "Bengali" },
  { text: "हो, मी तयार आहे", lang: "Marathi" },
  { text: "હા, હું તૈયાર છું", lang: "Gujarati" },
  { text: "نعم، أقبل", lang: "Arabic" },
  { text: "ਹਾਂ, ਮੈਂ ਤਿਆਰ ਹਾਂ", lang: "Punjabi" },
  { text: "అవును, నేను సిద్ధంగా ఉన్నాను", lang: "Telugu" },
  { text: "Sim, aceito", lang: "Portuguese" },
  { text: "Ja, ich will", lang: "German" },
];

export function LanguageMarquee() {
  const doubled = [...PHRASES, ...PHRASES];

  return (
    <div className="relative w-full overflow-hidden marquee-mask py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((phrase, i) => (
          <span key={i} className="inline-flex items-center mx-6 md:mx-10 shrink-0">
            <span className="font-serif text-lg md:text-2xl italic text-accent-gold/80">
              «{phrase.text}»
            </span>
            <span className="ml-3 text-[9px] uppercase tracking-widest text-stone-400 font-mono hidden sm:inline">
              {phrase.lang}
            </span>
            <span className="mx-6 text-stone-300">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
