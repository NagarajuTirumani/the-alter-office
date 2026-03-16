import { v4 as uuidv4 } from 'uuid';

export function newPOC() {
  return {
    id: uuidv4(),
    gender: "MALE",
    name: "",
    email: "",
    countryCode: "+91",
    phoneNumber: "",
  };
};

export function newAgency() {
  return {
    id: uuidv4(),
    agencyNumber: undefined,
    agencyName: "",
    agencyType: "",
    completionDate: "",
    notes: "",
    pocs: [newPOC()],
  };
}

export function normalizeCompletionDate(value) {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
}

export function normalizePhoneNumber(value) {
  if (typeof value === "number" && value === 0) return "";
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const digits = raw.replace(/[^\d]/g, "");
  if (digits === "0") return "";
  return digits;
}

export function castForSave(agency) {
  return {
    id: agency.id,
    agencyNumber: agency.agencyNumber,
    agencyName: agency.agencyName,
    agencyType: agency.agencyType,
    completionDate: normalizeCompletionDate(agency.completionDate) || null,
    notes: agency.notes,
    pocs: agency.pocs.map((poc) => ({
      id: poc.id,
      gender: poc.gender,
      name: poc.name,
      email: poc.email || undefined,
      countryCode: poc.countryCode || undefined,
      phoneNumber: normalizePhoneNumber(poc.phoneNumber) || undefined,
    })),
  };
}

export function validateAgency(agency) {
  const errors = {};

  const name = agency.agencyName.trim();
  if (!name) {
    errors.agencyName = "Agency name is required";
  } else if (name.length < 2 || name.length > 50) {
    errors.agencyName = "Agency name must be 2-50 characters";
  }

  const type = agency.agencyType.trim();
  if (!type) {
    errors.agencyType = "Agency type is required";
  }

  if (!agency.completionDate) {
    errors.completionDate = "Partnership completion is required";
  } else {
    const selected = new Date(agency.completionDate + "-01T00:00:00");
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    if (selected < currentMonth) {
      errors.completionDate = "Completion must be current or future month";
    }
  }

  const notes = agency.notes.trim();
  if (!notes) {
    errors.notes = "Notes are required";
  } else if (notes.length < 10 || notes.length > 250) {
    errors.notes = "Notes must be 10-250 characters";
  }

  agency.pocs.forEach((poc, i) => {
    const pocName = poc.name.trim();
    if (!pocName) {
      errors["poc_" + i + "_name"] = "POC name is required";
    } else if (pocName.length < 2 || pocName.length > 50) {
      errors["poc_" + i + "_name"] = "POC name must be 2-50 characters";
    }
    if (poc.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(poc.email)) {
      errors["poc_" + i + "_email"] = "Invalid email format";
    }
    const digitsPhone = normalizePhoneNumber(poc.phoneNumber);
    if (digitsPhone !== "") {
      const len = digitsPhone.length;
      if (poc.countryCode === "+91") {
        if (len !== 10) {
          errors["poc_" + i + "_phone"] = "Indian numbers must be 10 digits";
        }
      } else if (len < 6 || len > 15) {
        errors["poc_" + i + "_phone"] = "Phone number must be 6-15 digits";
      }
    }
  });

  return errors;
}

export function isAgencyValid(agency) {
  return Object.keys(validateAgency(agency)).length === 0;
}

export function hasAgencyChanges(original, current) {
  if (!original) return true;
  const o = castForSave(original);
  const c = castForSave(current);
  return JSON.stringify(o) !== JSON.stringify(c);
}

export function diffAgencies(initial, current) {
  const agenciesToAdd = [];
  const agenciesToUpdate = [];
  const agenciesToRemove = [];

  const initialById = new Map(initial.map((a) => [a.id, a]));
  const currentById = new Map(current.map((a) => [a.id, a]));

  current.forEach((agency) => {
    const original = initialById.get(agency.id);
    if (!original) {
      agenciesToAdd.push(castForSave(agency));
    } else if (hasAgencyChanges(original, agency)) {
      agenciesToUpdate.push(castForSave(agency));
    }
  });

  initial.forEach((agency) => {
    if (!currentById.has(agency.id)) {
      agenciesToRemove.push(agency);
    }
  });

  return { agenciesToAdd, agenciesToUpdate, agenciesToRemove };
}