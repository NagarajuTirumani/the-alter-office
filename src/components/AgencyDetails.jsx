import { useState } from "react";
import AgencyTabs from "./AgencyTabs";
import AgencyForm from "./AgencyForm";
import { newAgency, validateAgency, isAgencyValid, castForSave } from "../utils/utils";

export default function AgencyDetailsModal() {
  const [agencies, setAgencies] = useState([newAgency()]);
  const [activeIndex, setActiveIndex] = useState(0);

  const currentErrors = validateAgency(agencies[activeIndex]);
  const allValid = agencies.every(isAgencyValid);

  function updateAgency(updated) {
    setAgencies((prev) =>
      prev.map((a, i) => (i === activeIndex ? updated : a)),
    );
  }

  function addAgency() {
    const updated = [...agencies, newAgency()];
    setAgencies(updated);
    setActiveIndex(updated.length - 1);
  }

  function removeAgency(index) {
    const updated = agencies.filter((_, i) => i !== index);
    setAgencies(updated);
    setActiveIndex(Math.max(0, index - 1));
  }

  function handleSave() {
    if (!allValid) return;
    const payload = agencies.map(castForSave);
    console.log("Saving payload:", payload);
    alert("Saved! Check the console for the final shaped data.");
  }

  const agencyTabItems = agencies.map((a, i) => ({
    id: a.id,
    label: "Agency " + (i + 1),
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          width: 480,
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          alignSelf: "flex-start",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #eee",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18 }}>Agency Details</div>
          <div style={{ color: "#888", fontSize: 14, marginTop: 4 }}>
            A &amp; B Homes
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          <AgencyTabs
            items={agencyTabItems}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            onRemove={removeAgency}
            onAdd={addAgency}
            addLabel="+ ADD AGENCY"
          />

          <AgencyForm
            agency={agencies[activeIndex]}
            onChange={updateAgency}
            errors={currentErrors}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #eee",
            display: "flex",
            gap: 12,
          }}
        >
          <button
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            disabled={!allValid}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 8,
              border: "none",
              background: allValid ? "#2563eb" : "#aaa",
              color: "#fff",
              cursor: allValid ? "pointer" : "not-allowed",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
}
