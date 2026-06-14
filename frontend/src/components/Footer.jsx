import React from "react";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-[var(--pw-ink)] py-16 border-t border-[var(--pw-line-soft)]">
      <div className="max-w-[1480px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-serif-italic text-[28px] leading-none text-[var(--pw-gold)]">P</span>
              <span className="font-serif-display text-[22px] text-[var(--pw-cream)]">PhantomWorx</span>
            </div>
            <p className="font-serif-italic text-[18px] text-[var(--pw-cream-dim)] max-w-[420px] leading-[1.45]">
              Quiet introductions, sealed deals, lasting outcomes.
            </p>
          </div>

          <div className="md:col-span-4">
            <span className="pw-label">Atelier</span>
            <p className="text-[13px] text-[var(--pw-cream-dim)] leading-[1.8] mt-2" style={{fontFamily:"'JetBrains Mono', monospace", textTransform:"none", letterSpacing:"0.01em"}}>
              By appointment only.<br />
              No public office. No published roster.
            </p>
          </div>

          <div className="md:col-span-3 md:text-right">
            <span className="pw-label">Correspondence</span>
            <a href="#inquire" className="link-gold mt-2">
              Open a Channel <span className="arrow">→</span>
            </a>
          </div>
        </div>

        <div className="hairline-soft my-12" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <span className="font-mono-tracked text-[10px] text-[var(--pw-mute)]">
            © MMXXVI · PhantomWorx LLC · All matters held in confidence
          </span>
          <div className="flex items-center gap-6">
            <span className="font-mono-tracked text-[10px] text-[var(--pw-mute)]">No press releases</span>
            <span className="font-mono-tracked text-[10px] text-[var(--pw-mute)]">No client lists</span>
            <span className="font-mono-tracked text-[10px] text-[var(--pw-gold)]">No exceptions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
