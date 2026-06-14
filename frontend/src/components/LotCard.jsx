import React from "react";

export default function LotCard({ lot, transitionDelay }) {
  const reserved = lot.status === "Reserved";
  return (
    <article
      data-testid={`lot-${lot.n}`}
      className="lot-card reveal p-8 md:p-10 relative"
      style={{ transitionDelay }}
    >
      <div className="flex items-center justify-between mb-12">
        <span
          className={`font-mono-tracked text-[10px] inline-flex items-center gap-2 ${
            reserved ? "text-[var(--pw-mute)]" : "text-[var(--pw-gold)]"
          }`}
        >
          <span
            className={`block w-1.5 h-1.5 rounded-full ${
              reserved ? "bg-[var(--pw-mute)]" : "bg-[var(--pw-gold)]"
            }`}
          />
          {lot.status}
        </span>
        <span className="font-mono-tracked text-[10px] text-[var(--pw-mute)]">
          Lot · {lot.n}
        </span>
      </div>
      <h3 className="font-serif-display text-[clamp(24px,2.4vw,34px)] text-[var(--pw-cream)] leading-[1.15] mb-3">
        {lot.title}
      </h3>
      <p className="font-mono-tracked text-[10px] text-[var(--pw-mute)] mb-10">
        {lot.meta}
      </p>
      <a
        href="#inquire"
        data-testid={`lot-${lot.n}-inquire`}
        className="link-gold"
      >
        Inquire Privately <span className="arrow">→</span>
      </a>
    </article>
  );
}
