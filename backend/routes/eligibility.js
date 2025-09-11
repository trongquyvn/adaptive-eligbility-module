const express = require("express");
const { evaluate } = require("../services/evaluate");
const EvaluationLog = require("../models/EvaluationLog");
const Rule = require("../models/Rule");
const router = express.Router();
const testRule = require("../mockData/rule1.json");

/**
 * POST /check
 * Body:
 * {
 *   "trial_id": "remap-cap",
 *   "trial_version": "v2.4",   // optional
 *   "jurisdiction": "UK",
 *   "patient_id": "P-0004",
 *   "now": "2025-06-26T10:30:00Z",
 *   "data": { ... },
 *   "mode": "root" | "flow"
 * }
 */
router.post("/check", async (req, res) => {
  try {
    const {
      trial_id,
      trial_version,
      jurisdiction,
      patient_id,
      now,
      data,
      mode,
    } = req.body;

    if (!trial_id || !jurisdiction || !patient_id) {
      return res
        .status(400)
        .json({ error: "trial_id, jurisdiction and patient_id are required" });
    }

    // Query rule by trial.id and trial.version
    let query = { "trial.id": trial_id };
    if (trial_version) query["trial.version"] = trial_version;

    let rule = await Rule.findOne(query).sort({ createdAt: -1 });
    if (!rule) {
      return res.status(404).json({ error: "Rule not found" });
    }

    // Validate jurisdiction
    if (!rule.trial.jurisdiction.includes(jurisdiction)) {
      return res.status(400).json({
        error: `Jurisdiction ${jurisdiction} is not valid for trial ${trial_id} (allowed: ${rule.trial.jurisdiction.join(
          ", "
        )})`,
      });
    }

    // Build patient object
    const patient = {
      trial_id,
      trial_version: rule.trial.version,
      jurisdiction,
      patient_id,
      now,
      data,
    };

    // Run evaluate (overrides handled inside)
    // const result = await evaluate(patient, testRule, mode || "flow");
    const result = await evaluate(patient, rule.toObject(), mode || "flow");
    res.json(result);
  } catch (err) {
    console.error("Error in /check:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ API: Get logs (all, newest first)
router.get("/logs", async (req, res) => {
  const logs = await EvaluationLog.find().sort({ timestamp: -1 }).limit(20);
  res.json(logs);
});

// ✅ API: Get logs by patientId
router.get("/logs/:patientId", async (req, res) => {
  const { patientId } = req.params;
  const logs = await EvaluationLog.find({ patientId }).sort({ timestamp: -1 });
  if (logs.length === 0) {
    return res
      .status(404)
      .json({ message: "No logs found for patientId " + patientId });
  }
  res.json(logs);
});

module.exports = router;
