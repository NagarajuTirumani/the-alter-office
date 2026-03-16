export function newPOC(pocIdSeq) {
  return {
    id: pocIdSeq++,
    gender: "Mr.",
    name: "",
    email: "",
    countryCode: "+91",
    phoneNumber: "",
  };
}

export function newAgency(agencyIdSeq) {
  return {
    id: agencyIdSeq++,
    agencyName: "",
    agencyType: "",
    completionDate: "",
    notes: "",
    pocs: [newPOC()],
  };
}

export function castForSave(agency) {
  return {
    id: agency.id,
    agencyName: agency.agencyName,
    agencyType: agency.agencyType,
    completionDate: agency.completionDate ? new Date(agency.completionDate) : null,
    notes: agency.notes,
    pocs: agency.pocs.map((poc) => ({
      id: poc.id,
      gender: poc.gender,
      name: poc.name,
      email: poc.email || undefined,
      countryCode: poc.countryCode || undefined,
      phoneNumber: poc.phoneNumber !== "" ? Number(poc.phoneNumber) : undefined,
    })),
  };
}

export function validateAgency(agency) {
  const errors = {};

  if (!agency.agencyName.trim()) {
    errors.agencyName = "Agency name is required";
  }

  if (!agency.agencyType.trim()) {
    errors.agencyType = "Agency type is required";
  }

  agency.pocs.forEach((poc, i) => {
    if (!poc.name.trim()) {
      errors["poc_" + i + "_name"] = "POC name is required";
    }
    if (poc.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(poc.email)) {
      errors["poc_" + i + "_email"] = "Invalid email format";
    }
    if (poc.phoneNumber !== "" && isNaN(Number(poc.phoneNumber))) {
      errors["poc_" + i + "_phone"] = "Phone number must be numeric";
    }
  });

  return errors;
}

export function isAgencyValid(agency) {
  return Object.keys(validateAgency(agency)).length === 0;
}