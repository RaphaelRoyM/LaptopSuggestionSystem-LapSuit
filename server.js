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
   GET LAPTOPS BY BRANDS + PRICE
========================== */
app.post("/api/laptops", (req, res) => {
  const { brands, maxPrice } = req.body;

  let filtered = laptops;

  // Filter by brands
  if (brands && brands.length > 0) {
    filtered = filtered.filter(l =>
      brands.includes(l["Brand:"].trim())
    );
  }

  // Filter by price
  if (maxPrice) {
    filtered = filtered.filter(l => {
      const price = parseInt(
        String(l["Price"]).replace(/[^\d]/g, "")
      );
      return price <= maxPrice;
    });
  }

  res.json(filtered);
});


/* ==========================
   GET MAX PRICE FROM CSV
========================== */
app.get("/api/maxPrice", (req, res) => {
  const prices = laptops.map(l =>
    parseInt(String(l["Price"]).replace(/[^\d]/g, ""))
  ).filter(p => !isNaN(p));

  const maxPrice = Math.max(...prices);

  res.json({ maxPrice });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});