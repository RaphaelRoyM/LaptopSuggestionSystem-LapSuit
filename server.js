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


function getDisplaySize(displayText) {
  if (!displayText) return null;

  const match = displayText.match(/(\d+(\.\d+)?)\s*"/);
  if (match) {
    return parseFloat(match[1]);
  }

  return null;
}

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
    refreshRates,
    warranties,
    ram,
    memory,      // ✅ ADD THIS
    keyboards,    // ✅ ADD THIS
    displaySizes,
    operatingSystems,
    weight,
  } = req.body;

  let filtered = laptops;

  // Brand filter
  if (brands && brands.length > 0) {
    filtered = filtered.filter(l =>
      brands.includes(l["Brand:"].trim())
    );
  }

  // MEMORY FILTER
  if (memory && memory.length > 0) {

    filtered = filtered.filter(l => {

      const drive = l["Hard drive"];
      if (!drive) return false;

      const match = drive.match(/\d+/);
      if (!match) return false;

      let value = parseInt(match[0]);

      if (drive.toLowerCase().includes("tb")) {
        value = value * 1024;
      }

      return memory.includes(value);

    });

  }

  // KEYBOARD FILTER
  if (keyboards && keyboards.length > 0) {

    filtered = filtered.filter(l => {

      const kb = l["Keyboard"]?.toLowerCase() || "";

      return keyboards.some(k =>
        kb.includes(k.toLowerCase())
      );

    });

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

  // Filter by display size
  if (displaySizes && displaySizes.length > 0) {
    filtered = filtered.filter(l => {
      const size = getDisplaySize(l["Display"]);
      return size && displaySizes.includes(size);
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
  //waranty filter
  if (warranties && warranties.length > 0) {
    filtered = filtered.filter(l =>
      warranties.includes(l["Warranty"]?.trim())
    );
  }

  // OPERATING SYSTEM FILTER
  if (operatingSystems && operatingSystems.length > 0) {
    filtered = filtered.filter(l =>
      operatingSystems.includes(l["Operating System"]?.trim())
    );
  }

  // WEIGHT FILTER (range)
  if (weight) {

    filtered = filtered.filter(l => {

      const w = l["Weight"];
      if (!w) return false;

      const match = w.match(/[\d.]+/);
      const value = match ? parseFloat(match[0]) : null;

      return value && value <= weight;

    });

  }

  // RAM Filter
  if (ram && ram.length > 0) {
    filtered = filtered.filter(l => {
      const ramField = l["RAM"];
      if (!ramField) return false;

      const match = ramField.match(/\d+/);
      const ramValue = match ? parseInt(match[0]) : null;

      return ram.includes(ramValue);
    });
  }

  res.json(filtered);
});

/* ==========================
 GET DISPLAY SIZES
========================== */
app.get("/api/displaySizes", (req, res) => {

  const sizes = laptops
    .map(l => getDisplaySize(l["Display"]))
    .filter(size => size !== null);

  const uniqueSizes = [...new Set(sizes)].sort((a, b) => a - b);

  res.json(uniqueSizes);
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
   GET WARRANTY + RAM OPTIONS
========================== */
app.get("/api/specOptions", (req, res) => {

  // OPERATING SYSTEM
  const operatingSystems = [
    ...new Set(
      laptops
        .map(l => l["Operating System"]?.trim())
        .filter(val => val && val !== "")
    )
  ].sort();

  // WEIGHT (extract numeric kg value)
  const weightValues = [
    ...new Set(
      laptops
        .map(l => {
          const w = l["Weight"];
          if (!w) return null;

          const match = w.match(/[\d.]+/);
          return match ? parseFloat(match[0]) : null;
        })
        .filter(Boolean)
    )
  ].sort((a, b) => a - b);

  // ✅ WARRANTY (remove blanks)
  const warranties = [
    ...new Set(
      laptops
        .map(l => l["Warranty"]?.trim())
        .filter(w => w && w !== "")
    )
  ];


  // MEMORY VALUES
  const memoryValues = [
    ...new Set(
      laptops
        .map(l => {
          const drive = l["Hard drive"] || l["1 TB HDD"];
          if (!drive) return null;

          const match = drive.match(/(\d+)\s*(TB|GB)/i);
          if (!match) return null;

          let value = parseInt(match[1]);

          if (match[2].toUpperCase() === "TB") {
            value = value * 1024;
          }

          return value;
        })
        .filter(Boolean)
    )
  ].sort((a, b) => a - b);

  // KEYBOARD
  const keyboards = [
    ...new Set(
      laptops
        .map(l => l["Keyboard"])
        .filter(val => val && val.trim() !== "")
    )
  ];


  // ✅ RAM (extract numeric value only, remove DDR, GB spacing issues)
  const ramValues = [
    ...new Set(
      laptops
        .map(l => {
          const ramField = l["RAM"];
          if (!ramField) return null;

          // Extract first number (e.g., 16 from "16GB DDR4")
          const match = ramField.match(/\d+/);
          return match ? parseInt(match[0]) : null;
        })
        .filter(Boolean)
    )
  ].sort((a, b) => a - b); // Ascending order

  res.json({
    warranties,
    ramValues,
    memoryValues,
    keyboards,
    operatingSystems,
    weightValues
  });
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

/* ==========================
   SEARCH LAPTOP BY NAME (FUZZY)
========================== */
app.get("/api/laptops/search", (req, res) => {

  const query = req.query.q?.toLowerCase() || "";

  if (!query) {
    return res.json([]);
  }

  const results = laptops.filter(l => {

    const name = l["Product name"]?.toLowerCase() || "";

    // simple fuzzy match
    return name.includes(query);

  });

  res.json(results);

});

/* ==========================
   RECOMMEND LAPTOPS
========================== */
app.post("/api/recommend", (req, res) => {

  const { purpose, budget, ram, portability, displaySize } = req.body; let filtered = laptops;

  function getRamValue(ramText) {
    if (!ramText) return 0;
    const match = ramText.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  const purposeRules = {

    student: {
      processors: ["i3", "ryzen 3"],
      minRam: 4
    },

    programming: {
      processors: ["i5", "ryzen 5"],
      minRam: 8
    },

    coding_gaming: {
      processors: ["i5", "i7", "ryzen 5", "ryzen 7"],
      minRam: 16
    },

    gaming_editing: {
      processors: ["i7", "i9", "ryzen 7", "ryzen 9"],
      minRam: 16
    },

    office: {
      processors: ["i3", "i5"],
      minRam: 8
    }

  };

  const rule = purposeRules[purpose];

  if (!rule) {
    return res.json([]);
  }

  filtered = filtered.filter(l => {

    const processor = (l["Processor"] || "").toLowerCase();
    const ramValue = getRamValue(l["RAM"]);

    const processorMatch = rule.processors.some(p =>
      processor.includes(p)
    );

    return processorMatch && ramValue >= rule.minRam;

  });
  // -------------------------
  // BUDGET FILTER
  // -------------------------

  if (budget) {

    filtered = filtered.filter(l => {

      const price = parseInt(String(l["Price"]).replace(/[^\d]/g, ""));

      return price <= budget;

    });

  }


  // -------------------------
  // RAM FILTER
  // -------------------------

  if (ram) {

    filtered = filtered.filter(l => {

      const match = l["RAM"]?.match(/\d+/);
      const value = match ? parseInt(match[0]) : 0;

      return value >= ram;

    });

  }
  if (portability === "yes") {

    filtered = filtered.filter(l => {

      const weight = parseFloat(l["Weight"]);

      return weight && weight <= 1.8;

    });

  }
  if (displaySize) {

    filtered = filtered.filter(l => {

      const match = l["Display"]?.match(/\d+(\.\d+)?/);
      const size = match ? parseFloat(match[0]) : 0;

      return Math.round(size) === parseInt(displaySize);

    });

  }
  res.json(filtered);

});