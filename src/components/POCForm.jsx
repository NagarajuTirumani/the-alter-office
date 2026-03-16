import InputField from "./InputField";
import FieldError from "./FieldError";
import { GENDER_OPTIONS, COUNTRY_CODES } from "../utils/constants";

export default function POCForm({ poc, pocIndex, onChange, errors }) {
  function update(field, value) {
    onChange(pocIndex, { ...poc, [field]: value });
  }

  return (
    <div>
      {/* IAgencyPOC.gender + IAgencyPOC.name */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
          POC Name <span style={{ color: "red" }}>*</span>
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={poc.gender}
            onChange={(e) => update("gender", e.target.value)}
            style={{ padding: "10px 8px", border: "1px solid #ccc", borderRadius: 6, fontSize: 14 }}
          >
            {GENDER_OPTIONS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <input
            type="text"
            value={poc.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Full name"
            style={{
              flex: 1,
              padding: "10px 12px",
              border: "1px solid " + (errors["poc_" + pocIndex + "_name"] ? "red" : "#ccc"),
              borderRadius: 6,
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>
        <FieldError message={errors["poc_" + pocIndex + "_name"]} />
      </div>

      {/* IAgencyPOC.email — optional */}
      <InputField
        label="POC Email"
        type="email"
        value={poc.email}
        onChange={(val) => update("email", val)}
        placeholder="Enter email (optional)"
        error={errors["poc_" + pocIndex + "_email"]}
      />

      {/* IAgencyPOC.countryCode + IAgencyPOC.phoneNumber — both optional */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
          POC Number (optional)
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={poc.countryCode}
            onChange={(e) => update("countryCode", e.target.value)}
            style={{ padding: "10px 8px", border: "1px solid #ccc", borderRadius: 6, fontSize: 14 }}
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <input
            type="tel"
            value={poc.phoneNumber}
            onChange={(e) => update("phoneNumber", e.target.value)}
            placeholder="Phone number"
            style={{
              flex: 1,
              padding: "10px 12px",
              border: "1px solid " + (errors["poc_" + pocIndex + "_phone"] ? "red" : "#ccc"),
              borderRadius: 6,
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>
        <FieldError message={errors["poc_" + pocIndex + "_phone"]} />
      </div>
    </div>
  );
}