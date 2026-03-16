import { useEffect, useState } from "react";
import AgencyTabs from "./AgencyTabs";
import AgencyForm from "./AgencyForm";
import {
  newAgency,
  validateAgency,
  isAgencyValid,
  castForSave,
  diffAgencies,
  normalizeCompletionDate,
  normalizePhoneNumber,
} from "../utils/utils";

export default function AgencyDetailsModal() {
  const [agencies, setAgencies] = useState([newAgency()]);
  const [initialAgencies, setInitialAgencies] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pocExpanded, setPocExpanded] = useState(true);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("agencyManagementData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const normalized = (Array.isArray(parsed) ? parsed : []).map((a) => ({
          ...newAgency(),
          ...a,
          completionDate: normalizeCompletionDate(a?.completionDate),
          pocs:
            Array.isArray(a?.pocs) && a.pocs.length > 0
              ? a.pocs.map((p) => ({
                  ...newAgency().pocs[0],
                  ...p,
                  phoneNumber: normalizePhoneNumber(p?.phoneNumber),
                }))
              : [newAgency().pocs[0]],
        }));
        setAgencies(normalized);
        setInitialAgencies(normalized);
      } catch {
        setInitialAgencies([]);
      }
    }
  }, []);

  useEffect(() => {
    console.log("initialAgencies:", initialAgencies);
  }, [initialAgencies]);

  useEffect(() => {
    console.log("agencies:", agencies);
  }, [agencies]);

  const currentErrors = showErrors ? validateAgency(agencies[activeIndex]) : {};
  const allValid = agencies.every(isAgencyValid);
  const hasChanges =
    !initialAgencies ||
    JSON.stringify(agencies.map(castForSave)) !==
      JSON.stringify((initialAgencies || []).map(castForSave));

  function updateAgency(updated) {
    setAgencies((prev) =>
      prev.map((a, i) => (i === activeIndex ? updated : a)),
    );
  }

  function addAgency() {
    // Don't allow adding a new tab if ANY existing agency is incomplete.
    // This prevents creating multiple empty agencies when user switches tabs.
    const firstInvalidIndex = agencies.findIndex((a) => !isAgencyValid(a));
    if (firstInvalidIndex !== -1) {
      setShowErrors(true);
      setActiveIndex(firstInvalidIndex);
      return;
    }

    setShowErrors(false);
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
    setShowErrors(true);
    if (!allValid || !hasChanges) return;
    console.log("initialAgencies:", initialAgencies);
    const { agenciesToAdd, agenciesToUpdate, agenciesToRemove } = diffAgencies(
      initialAgencies || [],
      agencies,
    );

    const payload = {
      agenciesToAdd,
      agenciesToUpdate,
      agenciesToRemove,
    };

    // Persist in the same order as the current UI/tabs.
    const orderedToSave = agencies.map(castForSave);
    window.localStorage.setItem("agencyManagementData", JSON.stringify(orderedToSave));
    console.log("Saving payload:", payload);
    setInitialAgencies(agencies);
    alert("Saved! Check the console for the final shaped data.");
  }

  const agencyTabItems = agencies.map((a, i) => ({
    id: a.id,
    label: "Agency " + (i + 1),
  }));

  const agencyErrorIndexes = showErrors
    ? agencies
        .map((a, i) => [i, validateAgency(a)])
        .filter(([, errs]) => Object.keys(errs).length > 0)
        .map(([i]) => i)
    : [];

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
            errorIndexes={agencyErrorIndexes}
          />

          <AgencyForm
            agency={agencies[activeIndex]}
            onChange={updateAgency}
            errors={currentErrors}
            showPOC={pocExpanded}
            onTogglePOC={() => setPocExpanded((prev) => !prev)}
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
            disabled={!allValid || !hasChanges}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 8,
              border: "none",
              background: allValid && hasChanges ? "#2563eb" : "#aaa",
              color: "#fff",
              cursor: allValid && hasChanges ? "pointer" : "not-allowed",
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
