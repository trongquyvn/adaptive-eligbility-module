// routes/patient.js
const express = require("express");
const Patient = require("../models/Patient");

const router = express.Router();

// Create
router.post("/", async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findOne({ patient_id: req.params.id });
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { patient_id: req.params.id },
      req.body,
      { new: true }
    );
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const result = await Patient.findOneAndDelete({
      patient_id: req.params.id,
    });
    if (!result) return res.status(404).json({ error: "Patient not found" });
    res.json({ message: "Patient deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
