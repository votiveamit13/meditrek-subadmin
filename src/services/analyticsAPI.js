import { Base_Url } from "../config";

let diseaseCache = null;
let medicineCache = null;

export const fetchDiseases = async () => {
  if (diseaseCache) return diseaseCache;

  const res = await fetch(`${Base_Url}subadmin/diseases`);
  const data = await res.json();

  if (data.success) {
    diseaseCache = data.diseases.map(d => ({
      label: d.disease_name,
      value: d.disease_id,
    }));
    return diseaseCache;
  }

  return [];
};

export const fetchMedicines = async () => {
  if (medicineCache) return medicineCache;

  const res = await fetch(`${Base_Url}subadmin/medicines`);
  const data = await res.json();

  if (data.success) {
    medicineCache = data.medicines.map(m => ({
      label: m.medicine_name,
      value: m.medicine_id,
    }));
    return medicineCache;
  }

  return [];
};

export const fetchDemographics = async ({ doctor_id } = {}) => {
  try {
    const res = await fetch(
      `${Base_Url}subadmin-patient-demographics`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctor_id,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      return {
        total: data.total_patients,
        list: data.data,
      };
    }

    return { total: 0, list: [] };
  } catch (error) {
    console.error("Demographics Error:", error);
    return { total: 0, list: [] };
  }
};

export const fetchDemographicDetails = async ({
  doctor_id,
  age_group,
  gender,
}) => {
  try {
    const res = await fetch(
      `${Base_Url}subadmin-patient-demographics-details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctor_id,
          age_group,
          gender,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      return {
        total: data.total,
        patients: data.patients || [],
      };
    }

    return { total: 0, patients: [] };
  } catch (error) {
    console.error("Demographics Details Error:", error);
    return { total: 0, patients: [] };
  }
};