const { evaluate } = require("../services/evaluate");

// Sample rule with overrides
const ruleDoc = {
  trial: {
    id: "remap-cap",
    version: "v2.4",
    jurisdiction: ["AU", "UK"],
    effective_from: "2025-06-01T00:00:00Z",
  },
  logic: {
    nodes: {
      age_gate: {
        type: "COMPARE",
        operator: ">=",
        left: { var: "age_years" },
        right: { const: 18 },
        reason_on_fail: "Age must be >= 18",
      },
    },
  },
  overrides: [
    {
      when: { jurisdiction: "UK" },
      patch: [
        {
          op: "replace",
          path: "/logic/nodes/age_gate/right/const",
          value: 16,
        },
      ],
    },
  ],
};

// Sample patient (UK jurisdiction)
const patientData = {
  trial_id: "remap-cap",
  trial_version: "v2.4",
  jurisdiction: "UK",
  patient_id: "P-0001",
  now: "2025-06-26T10:30:00Z",
  data: {
    screening: { demographics: { age: 17 } },
  },
};

// Apply overrides
const patchedRule = evaluate(patientData, ruleDoc);
console.log('patchedRule: ', patchedRule);
