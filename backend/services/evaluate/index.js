const { applyOverrides } = require("./applyOverrides");
const { patientExists } = require("../database");

function getValueByPath(obj, path) {
  if (!path) return undefined;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

function resolveVariable(varDef, patientData) {
  if (!varDef || !varDef.var) {
    return { value: null, id: null };
  }

  const rawValue = getValueByPath(patientData.data, varDef.var);

  if (rawValue === undefined || rawValue === null) {
    return { value: null, id: varDef.var };
  }

  switch (varDef.type) {
    case "number":
      return { value: Number(rawValue), id: varDef.var };
    case "datetime":
      return { value: new Date(rawValue), id: varDef.var };
    case "boolean":
      return { value: Boolean(rawValue), id: varDef.var };
    case "code":
      if (varDef.codes && rawValue in varDef.codes) {
        return { value: varDef.codes[rawValue], id: varDef.var };
      }
      return { value: rawValue, id: varDef.var };
    default:
      return { value: rawValue, id: varDef.var };
  }
}

// ------------------ EVALUATE NODE ------------------
function evaluateNode(node, patientData, ruleDoc, ctx) {
  if (!node) return true;
  const t = node.type;

  const fail = (reason) => {
    if (reason) ctx.key_reasons.push(reason);
    return false;
  };
  const pending = (id) => {
    ctx.hasPending = true;
    ctx.data_needed.push(id);
    return true;
  };

  if (t === "CONST_BOOL") {
    return node.value ? true : fail(node.reason_on_fail);
  }

  if (t === "COMPARE") {
    const { value: left, id } = resolveVariable(node.left, patientData);
    if (left === null) {
      return node.allow_unknown ? pending(id) : fail(node.reason_on_fail);
    }
    const right = node.right.const;
    let result = false;
    switch (node.operator) {
      case "<":
        result = left < right;
        break;
      case ">":
        result = left > right;
        break;
      case "<=":
        result = left <= right;
        break;
      case ">=":
        result = left >= right;
        break;
      case "==":
        result = left == right;
        break;
      case "!=":
        result = left != right;
        break;
    }
    return result ? true : fail(node.reason_on_fail);
  }

  if (t === "BOOLEAN" || t === "DATABASE") {
    const { value, id } = resolveVariable(node.input, patientData);
    if (value === null) {
      return node.allow_unknown ? pending(id) : fail(node.reason_on_fail);
    }
    return value ? true : fail(node.reason_on_fail);
  }

  if (t === "NOT") {
    const { value, id } = resolveVariable(node.input, patientData);
    if (value === null) {
      return node.allow_unknown ? pending(id) : fail(node.reason_on_fail);
    }
    return !value ? true : fail(node.reason_on_fail);
  }

  if (t === "ALL") {
    let allPass = true;
    for (const child of node.children) {
      const res =
        typeof child === "string"
          ? evaluateNode(ruleDoc.logic.nodes[child], patientData, ruleDoc, ctx)
          : evaluateNode(child, patientData, ruleDoc, ctx);
      if (!res) allPass = false;
    }
    return allPass ? true : fail(node.reason_on_fail);
  }

  if (t === "ANY") {
    let anyPass = false;
    for (const child of node.children) {
      const res =
        typeof child === "string"
          ? evaluateNode(ruleDoc.logic.nodes[child], patientData, ruleDoc, ctx)
          : evaluateNode(child, patientData, ruleDoc, ctx);
      if (res) anyPass = true;
    }
    return anyPass ? true : fail(node.reason_on_fail);
  }

  if (t === "TIME_WINDOW") {
    const now = new Date(patientData.now || Date.now());
    const { value: left, id } = resolveVariable(node.left, patientData);

    if (left === null) {
      return node.allow_unknown ? pending(id) : fail(node.reason_on_fail);
    }
    const diffHours = Math.abs((now - left) / (1000 * 60 * 60));
    let ok = true;

    if (node.window.max_hours_since !== undefined) {
      ok = ok && diffHours >= node.window.max_hours_since;
    }
    if (node.window.min_hours_since !== undefined) {
      ok = ok && diffHours <= node.window.min_hours_since;
    }

    return ok ? true : fail(node.reason_on_fail);
  }

  if (t === "IF") {
    const cond = evaluateNode(node.cond, patientData, ruleDoc, ctx);
    return cond
      ? evaluateNode(node.then, patientData, ruleDoc, ctx)
      : evaluateNode(node.else, patientData, ruleDoc, ctx);
  }

  if (t === "MAP") {
    if (!ctx.eligible_domains) ctx.eligible_domains = [];
    console.log("ctx.eligible_domains: ", ctx.eligible_domains);

    for (const item of node.items) {
      const res = evaluateNode(item.rule, patientData, ruleDoc, ctx);
      if (res) {
        ctx.eligible_domains.push(item.domain_id);
      }
    }

    return true;
  }

  if (t === "REGIMEN_RESOLVE") {
    if (!ctx.eligible_regimens) ctx.eligible_regimens = [];

    // Step 1: collect previously resolved eligible domains
    const eligibleDomains = ctx.eligible_domains || [];

    // Step 2: get all regimens that belong to eligible domains
    let regimens = (ruleDoc.regimen_catalog || []).filter((r) =>
      eligibleDomains.includes(r.domain_id)
    );

    // Step 3: apply constraints
    if (node.constraints) {
      for (const constraint of node.constraints) {
        regimens = regimens.filter((reg) => {
          if (reg.id !== constraint.regimen_id) return true;

          const excluded = evaluateNode(
            constraint.exclude_if,
            patientData,
            ruleDoc,
            ctx
          );

          if (excluded) {
            // add reason if specified
            if (constraint.reason_on_exclude) {
              ctx.key_reasons.push(constraint.reason_on_exclude);
            }
            return false; // remove this regimen
          }
          return true;
        });
      }
    }

    // Step 4: check if minimum required regimens are available
    if (regimens.length >= (node.require_min_regimens || 1)) {
      ctx.eligible_regimens = regimens.map((r) => r.id);
      return true;
    }

    return fail(node.reason_on_fail);
  }

  return false;
}

// ------------------ ROOT MODE ------------------
function evaluateByRoot(patientData, ruleDoc) {
  const ctx = { key_reasons: [], data_needed: [], hasPending: false };
  const result = evaluateNode(
    ruleDoc.logic.nodes[ruleDoc.logic.root],
    patientData,
    ruleDoc,
    ctx
  );

  return {
    status: ctx.hasPending ? "Pending" : result ? "Eligible" : "Not Eligible",
    key_reasons: ctx.key_reasons,
    eligible_domains: ctx.eligible_domains || [],
    eligible_regimens: ctx.eligible_regimens || [],
    data_needed: ctx.hasPending ? ctx.data_needed : [],
  };
}

// ------------------ FLOW MODE ------------------
function evaluateByFlow(patientData, ruleDoc) {
  const ctx = { key_reasons: [], data_needed: [], hasPending: false };

  let currentStep = ruleDoc.logic.flow[0];
  let finalOutcome = null;
  let finalCode = null;

  while (currentStep && !finalOutcome) {
    const node = ruleDoc.logic.nodes[currentStep.id];
    const result = evaluateNode(node, patientData, ruleDoc, ctx);

    if (result) {
      // pass
      if (currentStep.next) {
        currentStep = ruleDoc.logic.flow.find((f) => f.id === currentStep.next);
      } else if (currentStep.on_pass && currentStep.on_pass.outcome) {
        finalOutcome = currentStep.on_pass.outcome;
        finalCode = currentStep.on_pass.code || null;
      } else {
        break;
      }
    } else {
      // fail
      if (currentStep.on_fail && currentStep.on_fail.outcome) {
        finalOutcome = currentStep.on_fail.outcome;
        finalCode = currentStep.on_fail.code || null;
      } else {
        break;
      }
    }
  }

  return {
    status: ctx.hasPending ? "Pending" : finalOutcome || "Unknown",
    registry_code: finalCode,
    eligible_domains: ctx.eligible_domains || [],
    eligible_regimens: ctx.eligible_regimens || [],
    key_reasons: ctx.key_reasons,
    data_needed: ctx.hasPending ? ctx.data_needed : [],
  };
}

// ------------------ ENTRY POINT ------------------
async function evaluate(patientData, ruleDoc, mode = "flow") {
  const workingRule = applyOverrides(ruleDoc, patientData);

  const hasDatabaseNode = Object.values(workingRule.logic.nodes).some(
    (node) => node.type === "DATABASE"
  );

  if (hasDatabaseNode) {
    const exists = await patientExists(patientData.patient_id);

    if (!patientData.data.database) {
      patientData.data.database = {};
    }
    patientData.data.database.status = exists;
  }

  const coreResult =
    mode === "flow"
      ? evaluateByFlow(patientData, workingRule)
      : evaluateByRoot(patientData, workingRule);

  return {
    ...coreResult,
    evaluated_at: new Date().toISOString(),
    rules_version: ruleDoc.trial.version,
  };
}

module.exports = { evaluate, applyOverrides };
