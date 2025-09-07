// models/Patient.js
const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    patient_id: { type: String, required: true, unique: true },
    jurisdiction: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", PatientSchema);
