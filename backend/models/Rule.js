const mongoose = require("mongoose");

const VariableSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    type: String,
    cate: String,
    path: String,
    unit: String,
    nullable: Boolean,
    codes: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const DomainSchema = new mongoose.Schema(
  {
    id: String,
    active: Boolean,
  },
  { _id: false }
);

const RegimenSchema = new mongoose.Schema(
  {
    id: String,
    domain_id: String,
    label: String,
  },
  { _id: false }
);

// const LogicNodeSchema = new mongoose.Schema({}, { strict: false, _id: false });

const FlowSchema = new mongoose.Schema(
  {
    id: String,
    on_fail: { outcome: String, code: String, next: String },
    on_pass: { outcome: String, code: String, next: String },
  },
  { _id: false }
);

const RuleSchema = new mongoose.Schema(
  {
    schema_version: { type: String, required: true },
    trial: {
      id: String,
      version: String,
      jurisdiction: [String],
      effective_from: Date,
    },
    metadata: {
      title: String,
      description: String,
      author: String,
      created_at: Date,
    },
    variables: [VariableSchema],
    domain_catalog: [DomainSchema],
    regimen_catalog: [RegimenSchema],
    logic: {
      root: String,
      nodes: mongoose.Schema.Types.Mixed,
      flow: [FlowSchema],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rule", RuleSchema);
