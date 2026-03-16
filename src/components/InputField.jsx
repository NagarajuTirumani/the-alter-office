import FieldError from "./FieldError";

export default function InputField({
  label,
  required,
  value,
  onChange,
  placeholder,
  error,
  type,
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <input
        type={type || "text"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid " + (error ? "red" : "#ccc"),
          borderRadius: 6,
          fontSize: 14,
          boxSizing: "border-box",
          outline: "none",
        }}
      />
      <FieldError message={error} />
    </div>
  );
}
