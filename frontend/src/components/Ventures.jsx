import React from "react";

const VENTURES = [
  { state: "Acquired", n: "01 / 06", title: "Asset Holding · Class A" },
  { state: "Operating", n: "02 / 06", title: "Hospitality · Concierge" },
  { state: "Operating", n: "03 / 06", title: "Logistics · Cross-Border" },
  { state: "Stewarded", n: "04 / 06", title: "Family Office · Advisory" },
  { state: "Incubating", n: "05 / 06", title: "Digital Assets · Quiet Capital" },
  { state: "Reserved", n: "06 / 06", title: "—" },
];

export default function Ventures() {
  return (
    <section id="ventures" data-testid="ventures-section" className="relative py-32 md:py-44 bg-[var(--pw-ink)]">
      <div className="max-w-[1480px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-4 reveal">
            <span className="section-label">Ventures</span>
          </div>
          <div className="md:col-span-8 reveal">
            <h2 className="font-serif-display text-[clamp(40px,5.5vw,84px)] leading-[1.02] text-[var(--pw-cream)]">
              A portfolio kept <span className="font-serif-italic text-[var(--pw-gold)]">off the record.</span>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {VENTURES.map((v, i) => (
            <article
              key={i}
              data-testid={`venture-${i + 1}`}
              className="lot-card reveal p-8 md:p-10 min-h-[180px] flex flex-col justify-between"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-tracked text-[10px] text-[var(--pw-gold)]">
                  {v.state}
                </span>
                <span className="font-mono-tracked text-[10px] text-[var(--pw-mute)]">
                  {v.n}
                </span>
              </div>
              <h3 className="font-serif-display text-[clamp(22px,2.2vw,30px)] text-[var(--pw-cream)] mt-12 leading-[1.2]">
                {v.title}
              </h3>
            </article>
          ))}
        </div>

        <p className="mt-16 font-mono-tracked text-[10px] text-[var(--pw-mute)]">
          Details available under NDA to qualified parties.
        </p>
      </div>
    </section>
  );
}
