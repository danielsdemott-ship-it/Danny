import React from "react";

const PILLARS = [
  { title: "Discretion", body: "No name leaves the room without permission. None." },
  { title: "Composure", body: "We are paid to be the calmest party at the table." },
  { title: "Conviction", body: "We only carry deals we would sign with our own hand." },
];

export default function Pillars() {
  return (
    <section data-testid="pillars-section" className="relative py-32 md:py-44 bg-[var(--pw-ink-2)] border-y border-[var(--pw-line-soft)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="text-center mb-20 reveal">
          <span className="section-label">Pillars</span>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-6 text-center">
          {PILLARS.map((p, i) => (
            <div key={p.title} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <span className="block w-12 h-px bg-[var(--pw-gold)] mx-auto mb-10" />
              <h3 className="font-serif-display text-[clamp(28px,3vw,40px)] text-[var(--pw-cream)] mb-5">
                {p.title}
              </h3>
              <p className="text-[14px] leading-[1.75] text-[var(--pw-cream-dim)] max-w-[280px] mx-auto" style={{fontFamily:"'JetBrains Mono', monospace", textTransform:"none", letterSpacing:"0.01em"}}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
