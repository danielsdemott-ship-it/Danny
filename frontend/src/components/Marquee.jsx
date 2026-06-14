import React from "react";

const PHRASES = [
  "The loudest deals are the smallest ones.",
  "Reputation is currency. We never spend yours.",
  "Operate in the room. Live outside of it.",
  "Discretion compounds.",
  "Some signatures are never published.",
];

export default function Marquee() {
  const items = PHRASES.concat(PHRASES, PHRASES);
  return (
    <section data-testid="marquee" className="relative py-10 border-y border-[var(--pw-line-soft)] overflow-hidden bg-[var(--pw-ink-2)]">
      <div className="marquee-track flex items-center gap-12 whitespace-nowrap">
        {items.map((p, i) => (
          <React.Fragment key={`${p}-${i}`}>
            <span className="font-serif-italic text-[var(--pw-cream-dim)] text-[18px] md:text-[22px]">
              {p}
            </span>
            <span className="text-[var(--pw-gold)] text-[14px]">✦</span>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
