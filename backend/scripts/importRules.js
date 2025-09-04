// scripts/importRule.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Rule = require("../models/Rule");
const { MONGO_URI } = require("../constants");

const filePath = process.argv[2];
if (!filePath) {
  console.error(
    "❌ Please provide JSON file path: node scripts/importRule.js ./ruleTest.json"
  );
  process.exit(1);
}

async function importRule() {
  try {
    // Connect DB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const rawData = fs.readFileSync(path.resolve(filePath), "utf-8");
    const data = JSON.parse(rawData);

    let result;
    if (Array.isArray(data)) {
      result = await Rule.insertMany(data);
      console.log(`✅ Imported ${result.length} rules`);
    } else {
      const rule = new Rule(data);
      result = await rule.save();
      console.log(`✅ Imported rule: ${result._id}`);
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Import error:", err);
    process.exit(1);
  }
}

importRule();
