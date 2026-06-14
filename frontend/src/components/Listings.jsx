import React from "react";
import LotCard from "@/components/LotCard";

const LOTS = [
  { status: "Available", n: "001", title: "European Hypercar · Allocation", meta: "Factory · Sealed bid" },
  { status: "Available", n: "002", title: "Independent Watchmaker · Pair", meta: "Provenance verified" },
  { status: "Available", n: "003", title: "Coastal Estate · Off-Market", meta: "Region withheld" },
  { status: "Reserved",  n: "004", title: "Private Equity · Side Letter", meta: "Under NDA" },
];

function ListingsHeader() {
  return (
    <div className="grid md:grid-cols-12 gap-12 mb-20">
      <div className="md:col-span-4 reveal">
        <span className="section-label">Current Listings</span>
      </div>
      <div className="md:col-span-8 reveal">
        <h2 className="font-serif-display text-[clamp(40px,5.5vw,84px)] leading-[1.02] text-[var(--pw-cream)]">
          The discreet <span className="font-serif-italic text-[var(--pw-gold)]">marketplace.</span>
        </h2>
        <p className="mt-8 max-w-[520px] text-[14px] leading-[1.7] text-[var(--pw-cream-dim)]" style={{fontFamily:"'JetBrains Mono', monospace", textTransform:"none", letterSpacing:"0.01em"}}>
          A rotating selection of opportunities held for our principals.
          Inquire for provenance, terms, and the rest of the catalogue.
        </p>
      </div>
    </div>
  );
}

export default function Listings() {
  return (
    <section id="listings" data-testid="listings-section" className="relative py-32 md:py-44 bg-[var(--pw-ink)]">
      <div className="max-w-[1480px] mx-auto px-6 md:px-12">
        <ListingsHeader />
        <div className="grid md:grid-cols-2 gap-6">
          {LOTS.map((lot, i) => (
            <LotCard key={lot.n} lot={lot} transitionDelay={`${i * 70}ms`} />
          ))}
        </div>
        <p className="mt-16 text-center font-mono-tracked text-[10px] text-[var(--pw-mute)]">
          Full catalogue disclosed upon qualification.
        </p>
      </div>
    </section>
  );
}
