const mongoose = require("mongoose");

const EvaluationLogSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  outcome: {
    type: String,
    enum: ["Eligible", "Not Eligible", "Pending"],
    required: true,
  },
  reasonsFailed: [{ type: String }],
  rulesVersion: { type: String, default: "v1.0" },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EvaluationLog", EvaluationLogSchema);
