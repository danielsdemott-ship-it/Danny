import React from "react";

const FIELDS = [
  { name: "name",   testid: "inq-name",   label: "Your Name",                   placeholder: "As you wish to be addressed",   autoComplete: "name",  type: "text" },
  { name: "email",  testid: "inq-email",  label: "Private Channel",             placeholder: "encrypted@inbox",                autoComplete: "email", type: "email" },
  { name: "origin", testid: "inq-origin", label: "Origin · How You Found Us",   placeholder: "Referral, allusion, or otherwise" },
  { name: "room",   testid: "inq-room",   label: "The Room You Would Like Opened", placeholder: "A category, a name, a region" },
];

export default function InquireFields({ form, onChange }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
      {FIELDS.map((f) => (
        <div key={f.name}>
          <label className="pw-label" htmlFor={f.name}>{f.label}</label>
          <input
            data-testid={f.testid}
            id={f.name}
            name={f.name}
            type={f.type || "text"}
            value={form[f.name]}
            onChange={onChange}
            className="pw-input"
            placeholder={f.placeholder}
            autoComplete={f.autoComplete}
          />
        </div>
      ))}
    </div>
  );
}
