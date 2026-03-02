const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const router = express.Router();

let laptops = [];

const filePath = path.join(__dirname, "../data/laptops_Dataset.csv");

// Load CSV once
fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    laptops.push(row);
  })
  .on("end", () => {
    console.log("CSV loaded successfully");
  });

// Get all laptops
router.get("/", (req, res) => {
  res.json(laptops);
});

// Get unique brands dynamically
router.get("/brands", (req, res) => {
  const brands = [...new Set(laptops.map(l => l["Brand:"]?.trim()))];
  res.json(brands.filter(Boolean));
});

// Filter by multiple brands
router.get("/filter", (req, res) => {
  const brands = req.query.brands?.split(",") || [];

  const filtered = laptops.filter(l =>
    brands.includes(l["Brand:"]?.trim())
  );

  res.json(filtered);
});

// Search by product name
router.get("/search", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  const filtered = laptops.filter(l =>
    l["Product name"]?.toLowerCase().includes(query)
  );

  res.json(filtered);
});

module.exports = router;