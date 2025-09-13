const mongoose = require("mongoose");

const EvaluationLogSchema = new mongoose.Schema({
  patient_id: { type: String, required: true },
  evaluated_at: { type: String },
  registry_code: { type: String },
  status: { type: String },
  reasons: [{ type: String }],
  rule_id: { type: String, default: "" },
  rule_version: { type: String, default: "v1.0" },
  timestamp: { type: Date, default: Date.now },
  data: mongoose.Schema.Types.Mixed,
  rule: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model("EvaluationLog", EvaluationLogSchema);
