import FieldError from "./FieldError";
import { useRef } from "react";

export default function InputField({
  label,
  required,
  value,
  onChange,
  placeholder,
  error,
  type,
}) {
  const inputRef = useRef(null);
  const inputType = type || "text";

  function openNativePickerIfAvailable() {
    const el = inputRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      el.showPicker();
    }
  }

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        type={inputType}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onClick={() => {
          if (inputType === "month" || inputType === "date" || inputType === "time") {
            openNativePickerIfAvailable();
          }
        }}
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
