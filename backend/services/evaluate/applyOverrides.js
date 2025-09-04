// services/evaluate/applyOverrides.js
const { applyOperation } = require("fast-json-patch");

/**
 * Apply overrides defined inside ruleDoc if context matches patientData
 * @param {Object} ruleDoc - rule definition (from DB or JSON)
 * @param {Object} patientData - patient + trial context
 * @returns {Object} updated ruleDoc with overrides applied
 */
function applyOverrides(ruleDoc, patientData) {
  if (!ruleDoc.overrides) return ruleDoc;

  const context = {
    trial_id: patientData.trial_id,
    trial_version: patientData.trial_version,
    jurisdiction: patientData.jurisdiction,
  };

  const workingRule = JSON.parse(JSON.stringify(ruleDoc)); // deep clone

  workingRule.overrides.forEach((override) => {
    const when = override.when || {};
    const matches = Object.entries(when).every(([k, v]) => context[k] === v);

    if (matches && Array.isArray(override.patch)) {
      override.patch.forEach((op) => {
        try {
          applyOperation(workingRule, op);
        } catch (e) {
          console.error("Failed to apply patch:", op, e.message);
        }
      });
    }
  });

  return workingRule;
}

module.exports = { applyOverrides };
