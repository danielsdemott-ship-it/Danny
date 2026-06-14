import React from "react";

const DISCIPLINES = [
  {
    n: "01",
    title: "Private Sourcing",
    body: "Rare, custom, and hard-to-acquire assets — located, vetted, and delivered without trace. Vehicles, watches, real estate, art, allocations.",
  },
  {
    n: "02",
    title: "Strategic Introductions",
    body: "Curated access to the operators, principals, and capital that move quietly. We open the room — discreetly, deliberately, once.",
  },
  {
    n: "03",
    title: "Acquisition Consulting",
    body: "Off-market diligence, negotiation, and escrow oversight. We carry the conversation so your name never has to enter it.",
  },
  {
    n: "04",
    title: "Exclusive Opportunities",
    body: "A standing roster of ventures, allocations, and positions reserved for our principals. By appointment, never by listing.",
  },
];

export default function Practice() {
  return (
    <section id="practice" data-testid="practice-section" className="relative py-32 md:py-44 bg-[var(--pw-ink-2)] border-y border-[var(--pw-line-soft)]">
      <div className="max-w-[1480px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-4 reveal">
            <span className="section-label">Practice</span>
          </div>
          <div className="md:col-span-8 reveal">
            <h2 className="font-serif-display text-[clamp(40px,5.5vw,84px)] leading-[1.02] text-[var(--pw-cream)]">
              Four disciplines.
              <br />
              <span className="font-serif-italic text-[var(--pw-gold)]">One signature.</span>
            </h2>
            <p className="mt-8 max-w-[460px] text-[14px] leading-[1.7] text-[var(--pw-cream-dim)]" style={{fontFamily:"'JetBrains Mono', monospace", textTransform:"none", letterSpacing:"0.01em"}}>
              Each engagement is bespoke, vetted, and held to a standard no public
              firm could afford to maintain.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-2">
          {DISCIPLINES.map((d, i) => (
            <article
              key={d.n}
              data-testid={`discipline-${d.n}`}
              className="reveal group relative py-12 border-t border-[var(--pw-line-soft)] hover:border-[var(--pw-gold)] transition-colors duration-500"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-8">
                <span className="font-mono-tracked text-[12px] text-[var(--pw-gold)]">{d.n}</span>
                <span className="block w-12 h-px bg-[var(--pw-gold)] mt-3 opacity-50 group-hover:opacity-100 group-hover:w-20 transition-all duration-500" />
              </div>
              <h3 className="font-serif-display text-[clamp(28px,3vw,42px)] text-[var(--pw-cream)] mb-5 leading-[1.1]">
                {d.title}
              </h3>
              <p className="text-[14px] leading-[1.75] text-[var(--pw-cream-dim)] max-w-[480px]" style={{fontFamily:"'JetBrains Mono', monospace", textTransform:"none", letterSpacing:"0.01em"}}>
                {d.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
