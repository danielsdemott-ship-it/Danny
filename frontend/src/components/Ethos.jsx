import React from "react";

export default function Ethos() {
  return (
    <section id="ethos" data-testid="ethos-section" className="relative py-32 md:py-44 bg-[var(--pw-ink)]">
      <div className="max-w-[1480px] mx-auto px-6 md:px-12 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4 reveal">
          <span className="section-label">The Ethos</span>
        </div>

        <div className="md:col-span-8 reveal">
          <h2 className="font-serif-display text-[clamp(40px,5.5vw,84px)] leading-[1.02] text-[var(--pw-cream)] max-w-[820px]">
            Built on what is <span className="font-serif-italic text-[var(--pw-gold)]">not</span> said.
          </h2>

          <div className="mt-12 grid md:grid-cols-2 gap-10 max-w-[900px]">
            <p className="text-[15px] leading-[1.8] text-[var(--pw-cream-dim)]" style={{fontFamily:"'JetBrains Mono', monospace", textTransform:"none", letterSpacing:"0.01em"}}>
              PhantomWorx was founded on a single observation: the most consequential
              transactions of our era happen in private. They require a steward —
              not a spotlight.
            </p>
            <p className="text-[15px] leading-[1.8] text-[var(--pw-cream-dim)]" style={{fontFamily:"'JetBrains Mono', monospace", textTransform:"none", letterSpacing:"0.01em"}}>
              We are that steward. We broker introductions, negotiate terms, hold
              escrow, and operate ventures under a single, deliberately quiet
              banner. No press releases. No client lists. No exceptions.
            </p>
          </div>

          <figure className="mt-20 border-l border-[var(--pw-gold)] pl-8 max-w-[760px]">
            <blockquote className="font-serif-italic text-[clamp(24px,3vw,40px)] leading-[1.3] text-[var(--pw-cream)]">
              &ldquo;The signature you don&rsquo;t see is the one that pays.&rdquo;
            </blockquote>
          </figure>
        </div>
      </div>
    </section>
  );
}
