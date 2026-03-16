

import FieldError from "./FieldError";

export default function TextArea({ label, value, onChange, placeholder, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>{label}</label>}
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid " + (error ? "red" : "#ccc"),
          borderRadius: 6,
          fontSize: 14,
          boxSizing: "border-box",
          resize: "vertical",
          outline: "none",
        }}
      />
      <FieldError message={error} />
    </div>
  );
}