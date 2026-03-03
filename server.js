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
  const {
    brands,
    maxPrice,
    processorBrands,
    processorSeries,
    resolutions,
    refreshRates
  } = req.body;

  let filtered = laptops;

  // Brand filter
  if (brands && brands.length > 0) {
    filtered = filtered.filter(l =>
      brands.includes(l["Brand:"].trim())
    );
  }

  // Price filter
  if (maxPrice) {
    filtered = filtered.filter(l => {
      const price = parseInt(
        String(l["Price"]).replace(/[^\d]/g, "")
      );
      return price <= maxPrice;
    });
  }

  // Processor Brand Filter (Intel / Ryzen)
  if (processorBrands && processorBrands.length > 0) {
    filtered = filtered.filter(l => {
      const proc = l["Processor"]?.toLowerCase() || "";
      return processorBrands.some(p =>
        proc.includes(p.toLowerCase())
      );
    });
  }

  // Processor Series Filter (i3, i5 etc)
  if (processorSeries && processorSeries.length > 0) {
    filtered = filtered.filter(l => {
      const proc = l["Processor"]?.toLowerCase() || "";
      return processorSeries.some(series =>
        proc.includes(series.toLowerCase())
      );
    });
  }

  // Display Resolution Filter
  if (resolutions && resolutions.length > 0) {
    filtered = filtered.filter(l =>
      resolutions.includes(l["Display Resolution"]?.trim())
    );
  }

  // Display Refresh Rate Filter
  if (refreshRates && refreshRates.length > 0) {
    filtered = filtered.filter(l =>
      refreshRates.includes(l["Display Refresh Rate"]?.trim())
    );
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

/* ==========================
   GET DISPLAY OPTIONS
========================== */
app.get("/api/displayOptions", (req, res) => {

  const resolutions = [
    ...new Set(
      laptops
        .map(l => l["Display Resolution"]?.trim())
        .filter(Boolean)
    )
  ];

  // 🔥 Correct refresh rate sorting (ascending numeric)
  const refreshRates = [
    ...new Set(
      laptops
        .map(l => l["Display Refresh Rate"]?.trim())
        .filter(Boolean)
    )
  ].sort((a, b) => {
    const numA = parseInt(a.replace(/[^\d]/g, ""));
    const numB = parseInt(b.replace(/[^\d]/g, ""));
    return numA - numB;
  });

  res.json({ resolutions, refreshRates });
});