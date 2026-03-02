//server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

let laptops = [];

// ✅ Correct CSV path (make sure file is inside /data folder)
const csvPath = path.join(__dirname, "data", "laptops_Dataset.csv");

// Read CSV
fs.createReadStream(csvPath)
  .pipe(csv())
  .on("data", (row) => {
    laptops.push(row);
  })
  .on("end", () => {
    console.log("CSV Loaded Successfully");
  })
  .on("error", (err) => {
    console.error("Error loading CSV:", err.message);
  });

/* ==========================
   GET UNIQUE BRANDS
========================== */
app.get("/api/brands", (req, res) => {
  const brands = [...new Set(laptops.map(l => l["Brand:"].trim()))];
  res.json(brands);
});

/* ==========================
   GET LAPTOPS BY BRANDS
========================== */
app.post("/api/laptops", (req, res) => {
  const { brands } = req.body;

  if (!brands || brands.length === 0) {
    return res.json([]);
  }

  const filtered = laptops.filter(l =>
    brands.includes(l["Brand:"].trim())
  );

  res.json(filtered);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});