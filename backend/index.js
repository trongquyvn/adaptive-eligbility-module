const express = require("express");
const bodyParser = require("body-parser");

const connectDB = require("./db");

// Import routes
const eligibilityRoutes = require("./routes/eligibility");
const RulesRoutes = require("./routes/rules");

const app = express();
app.use(bodyParser.json());

// Connect DB
connectDB();

// ✅ Mount routes
app.use("/eligibility", eligibilityRoutes);
app.use("/rules", RulesRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Adaptive Eligibility POC running 🚀");
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
