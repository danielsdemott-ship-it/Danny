import React from "react";

const NOTES = [
  {
    n: "VI · MMXXVI",
    title: "On the Quiet Market",
    body: "Why the most interesting transactions of the next decade will never see a press release — and how to position for them.",
  },
  {
    n: "V · MMXXVI",
    title: "The Cost of Being Known",
    body: "Visibility is a tax. A short note on why principals are paying more to disappear, and what they're buying back.",
  },
  {
    n: "IV · MMXXVI",
    title: "Allocation, Not Acquisition",
    body: "A field guide to entering the rooms where ownership is granted rather than purchased.",
  },
];

export default function Wire() {
  return (
    <section id="wire" data-testid="wire-section" className="relative py-32 md:py-44 bg-[var(--pw-ink-2)] border-y border-[var(--pw-line-soft)]">
      <div className="max-w-[1480px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-7 reveal">
            <span className="section-label mb-8">The Phantom Wire</span>
            <h2 className="font-serif-display text-[clamp(40px,5.5vw,84px)] leading-[1.02] text-[var(--pw-cream)] mt-6">
              Field notes from <span className="font-serif-italic text-[var(--pw-gold)]">the quiet.</span>
            </h2>
          </div>
          <div className="md:col-span-5 flex md:items-end reveal">
            <p className="text-[14px] leading-[1.7] text-[var(--pw-cream-dim)]" style={{fontFamily:"'JetBrains Mono', monospace", textTransform:"none", letterSpacing:"0.01em"}}>
              Occasional dispatches on the private market — written for principals,
              never for press. No subscription, by intention.
            </p>
          </div>
        </div>

        <div className="border-t border-[var(--pw-line-soft)]">
          {NOTES.map((note, i) => (
            <a
              key={note.n}
              href="#inquire"
              data-testid={`wire-note-${i}`}
              className="wire-row group grid md:grid-cols-12 gap-8 py-10 border-b border-[var(--pw-line-soft)] reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="md:col-span-2">
                <span className="font-mono-tracked text-[10px] text-[var(--pw-gold)]">{note.n}</span>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-serif-display text-[clamp(22px,2.4vw,34px)] text-[var(--pw-cream)] mb-3 leading-[1.2]">
                  {note.title}
                </h3>
                <p className="text-[14px] leading-[1.7] text-[var(--pw-cream-dim)] max-w-[640px]" style={{fontFamily:"'JetBrains Mono', monospace", textTransform:"none", letterSpacing:"0.01em"}}>
                  {note.body}
                </p>
              </div>
              <div className="md:col-span-1 flex md:justify-end md:items-center">
                <span className="text-[var(--pw-gold)] text-xl group-hover:translate-x-2 transition-transform duration-500">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
