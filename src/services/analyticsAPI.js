import { Base_Url } from "../config";

let diseaseCache = {};
let medicineCache = {};
let symptomCache = {};

export const fetchDiseases = async (doctor_id) => {
  if (diseaseCache[doctor_id]) return diseaseCache[doctor_id];

  const res = await fetch(
    `${Base_Url}subadmin/docterwise/diseases?doctor_id=${doctor_id}`
  );

  const data = await res.json();

  if (data.success) {
    diseaseCache[doctor_id] = data.diseases.map(d => ({
      label: d.disease_name,
      value: d.disease_id,
    }));
    return diseaseCache[doctor_id];
  }

  return [];
};

export const fetchMedicines = async (doctor_id) => {
  if (medicineCache[doctor_id]) return medicineCache[doctor_id];

  const res = await fetch(
    `${Base_Url}subadmin/docterwise/medicines?doctor_id=${doctor_id}`
  );

  const data = await res.json();

  if (data.success) {
    medicineCache[doctor_id] = data.medicines.map(m => ({
      label: m.medicine_name,
      value: m.medicine_id,
    }));
    return medicineCache[doctor_id];
  }

  return [];
};

export const fetchSymptoms = async (doctor_id) => {
  if (symptomCache[doctor_id]) return symptomCache[doctor_id];

  try {
    const res = await fetch(`${Base_Url}report-symptoms?doctor_id=${doctor_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (data.success && data.data) {
      // Extract unique symptoms from all medicines
      const symptomsSet = new Set();

      data.data.forEach(medicine => {
        if (medicine.symptoms && Array.isArray(medicine.symptoms)) {
          medicine.symptoms.forEach(symptom => {
            if (symptom.symptom_name) {
              symptomsSet.add(symptom.symptom_name);
            }
          });
        }
      });

      const formatted = Array.from(symptomsSet).map(symptomName => ({
        label: symptomName,
        value: symptomName,
      }));

      symptomCache[doctor_id] = formatted;
      return formatted;
    }

    return [];
  } catch (error) {
    console.error("Error fetching symptoms:", error);
    return [];
  }
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
  page = 1,
  limit = 10,
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
          page,
          limit,
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

export const fetchDiseaseDashboard = async ({ doctor_id, disease, age_group, gender, page = 1, limit = 10 }) => {
  try {
    const res = await fetch(
      `${Base_Url}subadmin-disease-dashboard`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctor_id,
          disease: disease || [],
          age_group,
          gender,
          page,
          limit
        }),
      }
    );

    const data = await res.json();
    return data.success ? data : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const fetchDiseaseMedicationStats = async ({
  doctor_id,
  disease,
  medication,
  age_group,
  gender,
  singleOnly,
  combinedOnly,
}) => {
  try {
    const res = await fetch(
      `${Base_Url}subadmin-DiseasesMedicine`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctor_id,
          disease: disease || [],
          medication: medication || [],
          age_group,
          gender,
          singleOnly,
          combinedOnly,
        }),
      }
    );

    const data = await res.json();
    return data.success ? data : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const fetchDiseaseMedicationSummary = async ({
  doctor_id,
  disease,
  age_group,
  gender,
  page,
  limit,
  singleOnly,
  combinedOnly,
}) => {
  try {
    const res = await fetch(
      `${Base_Url}subadmin-DiseasesMedicine-Summary`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctor_id,
          disease,
          age_group,
          gender,
          page,
          limit,
          singleOnly,
          combinedOnly,
        }),
      }
    );

    const data = await res.json();
    return data.success ? data : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const fetchDiseaseMedicationDetails = async ({
  doctor_id,
  age_group,
  gender,
  diseases,
  singleOnly,
  combinedOnly,
  page,
  limit,
}) => {
  try {
    const res = await fetch(
      `${Base_Url}subadmin-DiseasesMedicine-Details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctor_id,
          age_group,
          gender,
          diseases: diseases || [],
          singleOnly,
          combinedOnly,
          page,
          limit,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      return {
        total: 0,
        patients: data.data,
      };
    }

    return { total: 0, patients: [] };
  } catch (err) {
    console.error(err);
    return { total: 0, patients: [] };
  }
};

export const fetchMedicationFull = async ({
  doctor_id,
  medication,
  diseases,
  age_group,
  gender,
  search,
  summary_page = 1,
  summary_limit = 10,
  patient_page = 1,
  patient_limit = 10,
  singleOnly = false,
  combinedOnly = false,
}) => {
  try {
    const res = await fetch(
      `${Base_Url}subadmin-medication-full`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctor_id,
          medication: medication || [],
          diseases: diseases || [],
          age_group,
          gender,
          search,
          summary_page,
          summary_limit,
          patient_page,
          patient_limit,
          singleOnly,
          combinedOnly,
        }),
      }
    );

    const data = await res.json();

    return data.success ? data : null;
  } catch (err) {
    console.error("Medication Full API Error:", err);
    return null;
  }
};

export const fetchMedicationDiseaseDashboard = async ({
  doctor_id,
  medication,
  age_group,
  gender,
  exclude_disease,
  singleOnly = false,
  combinedOnly = false,
  page = 1,
  limit = 10,
}) => {
  try {
    const res = await fetch(
      `${Base_Url}medication-disease-dashboard`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctor_id,
          medication: medication || [],
          age_group,
          gender,
          exclude_disease: exclude_disease || [],
          singleOnly,
          combinedOnly,
          page,
          limit,
        }),
      }
    );

    const data = await res.json();
    return data.success ? data : null;
  } catch (err) {
    console.error("MedicationDisease API Error:", err);
    return null;
  }
};

export const fetchMedicationReportedHealth = async ({
  doctor_id,
  medication,
  age_group,
  page = 1,
  limit = 10,
  patient_page = 1,
  patient_limit = 5,
}) => {
  try {
    const res = await fetch(`${Base_Url}medication-reported-health`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctor_id,
        medication: medication || [],
        age_group,
        page,
        limit,
        patient_page,
        patient_limit,
      }),
    });

    const data = await res.json();
    return data.success ? data : null;
  } catch (err) {
    console.error("Medication Reported Health API Error:", err);
    return null;
  }
};

export const fetchCustomPatientTable = async ({
  doctor_id,
  gender,
  age_group,
  disease,
  medication,
  symptoms,
  page = 1,
  limit = 10,
}) => {
  try {
    const res = await fetch(
      `${Base_Url}subadmin-patient-analytics-CustomTable`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctor_id,
          gender,
          age_group,
          disease: disease || [],
          medication: medication || [],
          symptoms: symptoms || [],
          page,
          limit,
        }),
      }
    );

    const data = await res.json();
    return data.success ? data : { total: 0, patients: [] };
  } catch (err) {
    console.error("Custom Table API Error:", err);
    return { total: 0, patients: [] };
  }
};