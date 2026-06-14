import React, { useEffect, useState } from "react";

const LINKS = [
  { label: "Ethos", href: "#ethos" },
  { label: "Practice", href: "#practice" },
  { label: "Listings", href: "#listings" },
  { label: "The Wire", href: "#wire" },
  { label: "Ventures", href: "#ventures" },
  { label: "Inquire", href: "#inquire" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-nav"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "nav-blur py-4" : "py-7"
      }`}
    >
      <div className="max-w-[1480px] mx-auto px-6 md:px-12 flex items-center justify-between">
        <a
          href="#top"
          data-testid="logo-link"
          className="flex items-center gap-3 group"
        >
          <span className="font-serif-italic text-[28px] leading-none text-[var(--pw-gold)]">P</span>
          <span className="flex flex-col leading-none">
            <span className="font-serif-display text-[20px] tracking-[0.02em] text-[var(--pw-cream)]">
              PhantomWorx
            </span>
            <span
              data-testid="logo-tagline"
              className="hidden sm:block font-mono-tracked text-[8.5px] text-[var(--pw-gold)] mt-1.5"
            >
              Discreet Brokerage · Private Ventures
            </span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="font-mono-tracked text-[11px] text-[var(--pw-cream-dim)] hover:text-[var(--pw-gold)] transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#inquire"
          data-testid="private-line-btn"
          className="hidden md:inline-flex btn-outline !py-3 !px-6"
        >
          Private Line
        </a>

        <button
          data-testid="mobile-menu-toggle"
          className="md:hidden text-[var(--pw-cream)] p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-px bg-current mb-1.5"></span>
          <span className="block w-6 h-px bg-current mb-1.5"></span>
          <span className="block w-4 h-px bg-current ml-auto"></span>
        </button>
      </div>

      {open && (
        <div className="md:hidden mt-4 mx-6 border-t border-[var(--pw-line-soft)] py-6 px-2 nav-blur" data-testid="mobile-menu">
          <div className="flex flex-col gap-5">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-mono-tracked text-[12px] text-[var(--pw-cream-dim)] hover:text-[var(--pw-gold)]"
              >
                {l.label}
              </a>
            ))}
            <a href="#inquire" onClick={() => setOpen(false)} className="btn-outline self-start !py-3 !px-6 mt-2">
              Private Line
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
