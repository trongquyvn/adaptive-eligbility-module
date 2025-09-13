const mongoose = require("mongoose");

const EvaluationLogSchema = new mongoose.Schema({
  patient_id: { type: String, required: true },
  evaluated_at: { type: String },
  registry_code: { type: String },
  status: { type: String },
  key_reasons: [{ type: String }],
  eligible_domains: [{ type: String }],
  eligible_regimens: [{ type: String }],
  data_needed: [{ type: String }],
  rule_id: { type: String, default: "" },
  rule_version: { type: String, default: "v1.0" },
  patientData: mongoose.Schema.Types.Mixed,
  rule: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EvaluationLog", EvaluationLogSchema);
