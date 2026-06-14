import React, { useState } from "react";
import axios from "axios";
import InquireFields from "@/components/InquireFields";

const EMPTY = { name: "", email: "", origin: "", intent: "", room: "" };

function InquireSidebar() {
  return (
    <div className="md:col-span-5 reveal">
      <span className="section-label">Inquire</span>
      <h2 className="font-serif-display text-[clamp(40px,5vw,76px)] leading-[1.02] text-[var(--pw-cream)] mt-8">
        Some introductions <span className="font-serif-italic text-[var(--pw-gold)]">earn</span> a reply.
      </h2>
      <p className="mt-10 text-[14px] leading-[1.8] text-[var(--pw-cream-dim)] max-w-[440px]" style={{fontFamily:"'JetBrains Mono', monospace", textTransform:"none", letterSpacing:"0.01em"}}>
        We do not maintain a public intake. Send a brief note — origin, intent,
        and the room you would like opened. Replies are sent within seventy-two
        hours, or not at all.
      </p>
      <div className="mt-16 space-y-4 max-w-[360px]">
        {[
          ["Encryption", "On receipt"],
          ["Acknowledgement", "≤ 72h"],
          ["Discretion", "Absolute"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between border-b border-[var(--pw-line-soft)] py-3">
            <span className="font-mono-tracked text-[10px] text-[var(--pw-mute)]">{k}</span>
            <span className="font-mono-tracked text-[10px] text-[var(--pw-gold)]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuccessBlock({ message }) {
  return (
    <div data-testid="inquire-success" className="mt-10 border border-[var(--pw-gold)] p-6">
      <p className="font-serif-italic text-[var(--pw-gold)] text-[18px] mb-2">Sealed.</p>
      <p className="text-[13px] leading-[1.7] text-[var(--pw-cream-dim)]" style={{fontFamily:"'JetBrains Mono', monospace", textTransform:"none", letterSpacing:"0.01em"}}>
        {message}
      </p>
    </div>
  );
}

export default function Inquire({ api }) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.intent.trim()) {
      setStatus({ state: "error", message: "Name, email, and intent are required." });
      return;
    }
    setStatus({ state: "sending", message: "" });
    try {
      const res = await axios.post(`${api}/inquiries`, form);
      setStatus({ state: "sent", message: res.data.message });
      setForm(EMPTY);
    } catch (err) {
      const detail =
        err?.response?.data?.detail?.[0]?.msg ||
        err?.response?.data?.detail ||
        "Transmission failed. Try again.";
      setStatus({ state: "error", message: String(detail) });
    }
  };

  return (
    <section id="inquire" data-testid="inquire-section" className="relative py-32 md:py-44 bg-[var(--pw-ink-2)] border-t border-[var(--pw-line-soft)]">
      <div className="max-w-[1480px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-16">
          <InquireSidebar />
          <form data-testid="inquire-form" onSubmit={onSubmit} className="md:col-span-7 reveal">
            <InquireFields form={form} onChange={onChange} />
            <div className="mt-10">
              <label className="pw-label" htmlFor="intent">Intent</label>
              <textarea
                data-testid="inq-intent"
                id="intent"
                name="intent"
                value={form.intent}
                onChange={onChange}
                rows={5}
                className="pw-input resize-none"
                placeholder="In one paragraph — what would success look like, quietly?"
              />
            </div>
            <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <button
                type="submit"
                data-testid="inquire-submit"
                disabled={status.state === "sending"}
                className="btn-gold disabled:opacity-50"
              >
                {status.state === "sending" ? "Sealing…" : "Seal & Send"}
                <span className="arrow">→</span>
              </button>
              <span className="font-mono-tracked text-[10px] text-[var(--pw-mute)]">
                Encrypted on receipt · Held in confidence
              </span>
            </div>
            {status.state === "sent" && <SuccessBlock message={status.message} />}
            {status.state === "error" && (
              <p data-testid="inquire-error" className="mt-8 font-mono-tracked text-[11px] text-red-300">
                {status.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
