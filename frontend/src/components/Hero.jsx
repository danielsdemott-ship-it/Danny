import React from "react";

export default function Hero() {
  return (
    <section id="top" data-testid="hero-section" className="relative min-h-[100vh] hero-vignette overflow-hidden">
      {/* Silk texture layer */}
      <div className="absolute inset-0 hero-silk pointer-events-none" />
      {/* Decorative draped lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="goldFade" x1="0" x2="1">
            <stop offset="0" stopColor="#c9a87c" stopOpacity="0" />
            <stop offset="0.5" stopColor="#c9a87c" stopOpacity="0.6" />
            <stop offset="1" stopColor="#c9a87c" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[...Array(14)].map((_, i) => (
          <path
            key={`silk-line-${i}`}
            d={`M -100 ${120 + i * 55} C 400 ${60 + i * 55}, 1100 ${280 + i * 35}, 1800 ${140 + i * 55}`}
            stroke="url(#goldFade)"
            strokeWidth={i % 3 === 0 ? "0.8" : "0.4"}
            fill="none"
            opacity={0.4 + (i % 4) * 0.12}
          />
        ))}
      </svg>

      <div className="relative max-w-[1480px] mx-auto px-6 md:px-12 pt-44 md:pt-52 pb-32">
        <div className="reveal max-w-[1100px]">
          <div className="flex items-center gap-4 mb-10 md:mb-14">
            <span className="block w-14 h-px bg-[var(--pw-gold)]" />
            <span className="font-mono-tracked text-[11px] text-[var(--pw-gold)]">Est. PhantomWorx LLC</span>
          </div>

          <h1 className="font-serif-display text-[clamp(48px,9vw,140px)] leading-[0.95] text-[var(--pw-cream)]">
            We work <span className="font-serif-italic text-[var(--pw-gold)]">between</span>
            <br />
            the rooms
            <br />
            <span className="text-[var(--pw-cream-dim)]">most never enter.</span>
          </h1>

          <p className="mt-10 md:mt-14 max-w-[520px] text-[15px] md:text-[16px] leading-[1.7] text-[var(--pw-cream-dim)] font-mono-tracked !normal-case !tracking-[0.02em]" style={{textTransform:"none", letterSpacing:"0.01em", fontFamily:"'JetBrains Mono', monospace"}}>
            A private brokerage, middleman, and venture house for principals who
            measure success in outcomes, not announcements.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <a href="#inquire" data-testid="hero-request-audience-btn" className="btn-gold">
              Request Audience <span className="arrow">→</span>
            </a>
            <a href="#ethos" data-testid="hero-ethos-btn" className="btn-outline">
              The Ethos
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-6 md:left-12 right-6 md:right-12 flex items-end justify-between text-[var(--pw-mute)]">
          <div className="flex items-center gap-4">
            <span className="font-mono-tracked text-[10px]">Scroll · Quietly</span>
            <span className="block w-8 h-px bg-[var(--pw-mute)]" />
          </div>
          <span className="font-mono-tracked text-[10px] text-[var(--pw-gold)]">MMXXVI</span>
        </div>
      </div>
    </section>
  );
}
