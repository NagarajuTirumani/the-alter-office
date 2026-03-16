import InputField from "./InputField";
import TextArea from "./TextArea";
import POCSection from "./POCSection";
import { newPOC } from "../utils/utils";

export default function AgencyForm({ agency, onChange, errors }) {
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
      />

      <TextArea
        label="Notes"
        value={agency.notes}
        onChange={(val) => updateField("notes", val)}
        placeholder="Add any notes..."
      />

      <hr
        style={{
          margin: "24px 0",
          border: "none",
          borderTop: "1px dashed #ddd",
        }}
      />

      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
        Agency POC Details
      </div>

      <POCSection
        pocs={agency.pocs}
        onAdd={addPOC}
        onRemove={removePOC}
        onChange={updatePOC}
        errors={errors}
      />
    </div>
  );
}
