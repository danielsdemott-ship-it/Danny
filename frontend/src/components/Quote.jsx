import React from "react";

export default function Quote() {
  return (
    <section data-testid="quote-section" className="relative py-32 md:py-48 bg-[var(--pw-ink)] overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 text-center reveal">
        <span className="font-serif-italic text-[80px] md:text-[120px] text-[var(--pw-gold)] leading-none block mb-6 opacity-60">
          &ldquo;
        </span>
        <blockquote className="font-serif-display text-[clamp(32px,5.5vw,72px)] leading-[1.15] text-[var(--pw-cream)]">
          We don&rsquo;t sell visibility.
          <br />
          <span className="font-serif-italic text-[var(--pw-gold)]">
            We sell the absence of it.
          </span>
        </blockquote>
        <div className="mt-14 flex items-center justify-center gap-4">
          <span className="block w-10 h-px bg-[var(--pw-mute)]" />
          <span className="font-mono-tracked text-[10px] text-[var(--pw-mute)]">
            PhantomWorx LLC · House Statement
          </span>
          <span className="block w-10 h-px bg-[var(--pw-mute)]" />
        </div>
      </div>
    </section>
  );
}
