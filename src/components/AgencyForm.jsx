import InputField from "./InputField";
import TextArea from "./TextArea";
import POCSection from "./POCSection";
import { newPOC } from "../utils/utils";

export default function AgencyForm({ agency, onChange, errors, showPOC, onTogglePOC }) {
  function updateField(field, value) {
    onChange({ ...agency, [field]: value });
  }

  function addPOC() {
    onChange({ ...agency, pocs: [...agency.pocs, newPOC()] });
  }

  function removePOC(index) {
    onChange({ ...agency, pocs: agency.pocs.filter((_, i) => i !== index) });
  }

  function updatePOC(index, updatedPOC) {
    onChange({
      ...agency,
      pocs: agency.pocs.map((p, i) => (i === index ? updatedPOC : p)),
    });
  }

  return (
    <div>
      <InputField
        label="Agency Name"
        required
        value={agency.agencyName}
        onChange={(val) => updateField("agencyName", val)}
        placeholder="Enter agency name"
        error={errors.agencyName}
      />

      <InputField
        label="Agency Type"
        required
        value={agency.agencyType}
        onChange={(val) => updateField("agencyType", val)}
        placeholder="e.g. AOR, Performance Marketing..."
        error={errors.agencyType}
      />

      <InputField
        label="Partnership Completion"
        type="month"
        value={agency.completionDate}
        onChange={(val) => updateField("completionDate", val)}
        error={errors.completionDate}
      />

      <TextArea
        label="Notes"
        value={agency.notes}
        onChange={(val) => updateField("notes", val)}
        placeholder="Add any notes..."
        error={errors.notes}
      />

      <hr
        style={{
          margin: "24px 0",
          border: "none",
          borderTop: "1px dashed #ddd",
        }}
      />

      <button
        type="button"
        onClick={onTogglePOC}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          marginBottom: 8,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 16 }}>Agency POC Details</span>
        <span style={{ fontSize: 16 }}>{showPOC ? "▾" : "▸"}</span>
      </button>

      {showPOC && (
        <POCSection
          pocs={agency.pocs}
          onAdd={addPOC}
          onRemove={removePOC}
          onChange={updatePOC}
          errors={errors}
        />
      )}
    </div>
  );
}
