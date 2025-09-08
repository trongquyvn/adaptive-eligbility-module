const Patient = require("../../models/Patient");

async function patientExists(patientId) {
  const exists = await Patient.exists({ patient_id: patientId });
  return !!exists;
}

module.exports = {
  patientExists,
};
