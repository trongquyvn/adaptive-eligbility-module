const express = require("express");
const router = express.Router();
const Rule = require("../models/Rule");

// ✅ CREATE Rule
router.post("/", async (req, res) => {
  try {
    const rule = new Rule(req.body);
    await rule.save();
    res.status(201).json(rule);
  } catch (err) {
    console.error("Error creating rule:", err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ READ ALL Rules (filter trial_id, version)
router.get("/", async (req, res) => {
  try {
    const { trial_id, trial_version } = req.query;
    let query = {};
    if (trial_id) query["trial.id"] = trial_id;
    if (trial_version) query["trial.version"] = trial_version;

    const rules = await Rule.find(query).sort({ "trial.version": -1 });
    res.json(rules);
  } catch (err) {
    console.error("Error fetching rules:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ READ Rule by ID (Mongo _id)
router.get("/:id", async (req, res) => {
  try {
    const rule = await Rule.findById(req.params.id);
    if (!rule) return res.status(404).json({ error: "Rule not found" });
    res.json(rule);
  } catch (err) {
    console.error("Error fetching rule:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE Rule by ID
router.put("/:id", async (req, res) => {
  try {
    const rule = await Rule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!rule) return res.status(404).json({ error: "Rule not found" });
    res.json(rule);
  } catch (err) {
    console.error("Error updating rule:", err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE Rule by ID
router.delete("/:id", async (req, res) => {
  try {
    const rule = await Rule.findByIdAndDelete(req.params.id);
    if (!rule) return res.status(404).json({ error: "Rule not found" });
    res.json({ message: "Rule deleted successfully" });
  } catch (err) {
    console.error("Error deleting rule:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
