import React, { useEffect, useState } from "react";
import LotCard from "@/components/LotCard";
import { API_BASE, formatMoney, titleCase } from "@/lib/api";

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

function mapInventoryItem(item, index) {
  const valuation = formatMoney(item.price);
  const status = titleCase(item.availability || "available");

  return {
    id: item.id,
    status,
    n: item.status_code || String(index + 1).padStart(3, "0"),
    title: item.title,
    meta: [item.category, valuation].filter(Boolean).join(" · "),
  };
}

export default function Listings() {
  const [inventoryLots, setInventoryLots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchInventory() {
      try {
        const response = await fetch(`${API_BASE}/inventory`);
        if (!response.ok) throw new Error("Inventory unavailable");

        const data = await response.json();
        if (active) {
          setInventoryLots(data.slice(0, 6).map(mapInventoryItem));
        }
      } catch {
        if (active) setInventoryLots([]);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    fetchInventory();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document
      .querySelectorAll("#listings .reveal:not(.in)")
      .forEach((el) => el.classList.add("in"));
  }, [inventoryLots]);

  const lots = inventoryLots.length ? inventoryLots : LOTS;

  return (
    <section id="listings" data-testid="listings-section" className="relative py-32 md:py-44 bg-[var(--pw-ink)]">
      <div className="max-w-[1480px] mx-auto px-6 md:px-12">
        <ListingsHeader />
        <div className="grid md:grid-cols-2 gap-6">
          {lots.map((lot, i) => (
            <LotCard key={lot.id || lot.n} lot={lot} transitionDelay={`${i * 70}ms`} />
          ))}
        </div>
        <p className="mt-16 text-center font-mono-tracked text-[10px] text-[var(--pw-mute)]">
          {isLoading ? "Retrieving private catalogue." : "Full catalogue disclosed upon qualification."}
        </p>
      </div>
    </section>
  );
}
