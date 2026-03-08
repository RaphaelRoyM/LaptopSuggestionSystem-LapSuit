// script.js
localStorage.clear();

let selectedBrands = [];

function openFilter() {
  document.getElementById("filterPanel").style.display = "block";
}

function closeFilter() {
  document.getElementById("filterPanel").style.display = "none";
}

function applyFilter() {

  const checked = document.querySelectorAll("#brandList input:checked");
  const selectedBrands = Array.from(checked).map(cb => cb.value);

  const selectedWarranties = Array.from(
    document.querySelectorAll("#warrantyList input:checked")
  ).map(cb => cb.value);

  const operatingSystems = Array.from(
    document.querySelectorAll("#osList input:checked")
  ).map(cb => cb.value);

  const weight = parseFloat(
    document.querySelector("#weightList input:checked")?.value
  );
  const selectedRam = Array.from(
    document.querySelectorAll("#ramList input:checked")
  ).map(cb => parseInt(cb.value));

  const priceLimit = parseInt(document.getElementById("priceInput").value);


  // MEMORY
  const selectedMemory = Array.from(
    document.querySelectorAll("#memoryList input:checked")
  ).map(cb => parseInt(cb.value));

  // KEYBOARD
  const selectedKeyboards = Array.from(
    document.querySelectorAll("#keyboardList input:checked")
  ).map(cb => cb.value);


  // Display resolution
  const resolutions = Array.from(
    document.querySelectorAll("#resolutionOptions input:checked")
  ).map(cb => cb.value);

  // Refresh rate
  const refreshRates = Array.from(
    document.querySelectorAll("#refreshRateOptions input:checked")
  ).map(cb => cb.value);

  // Display Size
  const displaySizes = Array.from(
    document.querySelectorAll("#displaySizeList input:checked")
  ).map(cb => parseFloat(cb.value));

  // Processor brand
  const processorBrands = Array.from(
    document.querySelectorAll(
      "#processorSection input[type='checkbox']:checked"
    )
  )
    .map(cb => cb.value)
    .filter(v => v === "intel" || v === "ryzen");

  // Processor series
  const processorSeries = Array.from(
    document.querySelectorAll(
      "#processorSeriesOptions input:checked"
    )
  ).map(cb => cb.value);

  fetch("/api/laptops", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      brands: selectedBrands,
      maxPrice: priceLimit,
      warranties: selectedWarranties,
      ram: selectedRam,
      memory: selectedMemory,
      keyboards: selectedKeyboards,
      processorBrands,
      processorSeries,
      resolutions,
      refreshRates,
      displaySizes,
      operatingSystems,
      weight
    })
  })
    .then(res => res.json())
    .then(data => {

      const resultsDiv = document.getElementById("laptopResults");
      resultsDiv.innerHTML = "";

      if (data.length === 0) {
        resultsDiv.innerHTML = "<p style='text-align:center;'>No laptops found</p>";
        closeFilter();
        return;
      }

      data.forEach(laptop => {
        const card = document.createElement("div");
        card.className = "laptop-card";
        const brand = laptop["Brand:"];

        const imageURL =
          "https://source.unsplash.com/400x300/?laptop," +
          encodeURIComponent(brand);

        card.innerHTML = `
<img 
  src="${imageURL}" 
  class="laptop-img"
  onerror="this.src='https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=60'"
>

<h3>${laptop["Product name"]}</h3>

<p><b>Brand:</b> ${laptop["Brand:"]}</p>
<p><b>Processor:</b> ${laptop["Processor"]}</p>
<p><b>RAM:</b> ${laptop["RAM"]}</p>
<p><b>Price:</b> ₹${laptop["Price"]}</p>

<button onclick='viewDetails(${JSON.stringify(laptop)})'>
View Details
</button>
`;
        resultsDiv.appendChild(card);
      });

      closeFilter();
    });
}


function updateProcessorOptions() {

  const checked = document.querySelectorAll(
    "#processorSection input[type='checkbox']:checked"
  );

  const selected = Array.from(checked).map(cb => cb.value);

  const container = document.getElementById("processorSeriesOptions");
  container.innerHTML = "";

  if (selected.includes("intel")) {
    ["i3", "i5", "i7", "i9"].forEach(series => {
      container.innerHTML += `
        <label>
          <input type="checkbox" value="${series}">
          ${series}
        </label><br>
      `;
    });
  }

  if (selected.includes("ryzen")) {
    ["ryzen 3", "ryzen 5", "ryzen 7", "ryzen 9"].forEach(series => {
      container.innerHTML += `
        <label>
          <input type="checkbox" value="${series}">
          ${series}
        </label><br>
      `;
    });
  }
}



function showSection(sectionId, el) {

  const sections = [
    "brandSection",
    "priceSection",
    "processorSection",
    "displaySection",
    "warrantySection",
    "ramSection",
    "memorySection",
    "keyboardSection",
    "osSection",
    "weightSection"
  ];

  sections.forEach(id => {
    document.getElementById(id).style.display = "none";
  });

  document.getElementById(sectionId).style.display = "block";

  document.querySelectorAll(".filter-options li").forEach(li =>
    li.classList.remove("active")
  );

  el.classList.add("active");
}


function openModal() {
  modal.style.display = "block";
  loadBrands();
}

function closeModal() {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
};

//load Display Size
async function loadDisplaySizes() {

  const res = await fetch("/api/displaySizes");
  const sizes = await res.json();

  const container = document.getElementById("displaySizeList");
  container.innerHTML = "";

  sizes.forEach(size => {

    const label = document.createElement("label");

    label.innerHTML = `
      <input type="checkbox" value="${size}" class="displaySizeCheck">
      ${size} inch
    `;

    container.appendChild(label);
  });
}

// Load brands dynamically
async function loadBrands() {
  const res = await fetch("/api/brands");
  const brands = await res.json();

  brandSelect.innerHTML = "";

  brands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
}

// Search
async function searchLaptop() {

  const query = document.getElementById("searchInput").value.trim();

  if (query.length < 2) {
    document.getElementById("laptopResults").innerHTML = "";
    return;
  }

  const res = await fetch(`/api/laptops/search?q=${query}`);
  const data = await res.json();

  const resultsDiv = document.getElementById("laptopResults");
  resultsDiv.innerHTML = "";

  if (data.length === 0) {
    resultsDiv.innerHTML = "<p style='text-align:center;'>No laptops found</p>";
    return;
  }

  data.slice(0, 10).forEach(laptop => {

    const card = document.createElement("div");
    card.className = "laptop-card";

    card.innerHTML = `
      <h3>${laptop["Product name"]}</h3>
      <p><b>Brand:</b> ${laptop["Brand:"]}</p>
      <p><b>Processor:</b> ${laptop["Processor"]}</p>
      <p><b>RAM:</b> ${laptop["RAM"]}</p>
      <p><b>Price:</b> ${laptop["Price"]}</p>
    `;

    resultsDiv.appendChild(card);

  });

}

// Display laptops
function displayResults(laptops) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  laptops.slice(0, 10).forEach(laptop => {
    const div = document.createElement("div");
    div.className = "laptop-card";
    div.innerHTML = `
      <h3>${laptop["Product name"]}</h3>
      <p><strong>Brand:</strong> ${laptop["Brand:"]}</p>
      <p><strong>Processor:</strong> ${laptop["Processor"]}</p>
      <p><strong>RAM:</strong> ${laptop["RAM"]}</p>
      <p><strong>Price:</strong> ${laptop["Price"]}</p>
    `;
    resultsDiv.appendChild(div);
  });
}

// Load Warranty Options
fetch("/api/specOptions")
  .then(res => res.json())
  .then(data => {

    //Operating system
    const osDiv = document.getElementById("osList");

    data.operatingSystems.forEach(os => {

      const div = document.createElement("div");

      div.innerHTML = `
    <label>
      <input type="checkbox" value="${os}">
      ${os}
    </label>
  `;

      osDiv.appendChild(div);

    });

    //weight
    const weightDiv = document.getElementById("weightList");

    const weightRanges = [1, 2, 3, 4, 5];

    weightRanges.forEach(w => {

      const div = document.createElement("div");

      div.innerHTML = `
    <label>
      <input type="radio" name="weightRange" value="${w}">
      Upto ${w} Kg
    </label>
  `;

      weightDiv.appendChild(div);

    });
    // Warranty
    const warrantyDiv = document.getElementById("warrantyList");
    data.warranties.forEach(w => {
      const div = document.createElement("div");
      div.innerHTML = `
        <label>
          <input type="checkbox" value="${w}">
          ${w}
        </label>
      `;
      warrantyDiv.appendChild(div);
    });

    // MEMORY (ROM)
    const memoryDiv = document.getElementById("memoryList");

    data.memoryValues.forEach(m => {

      const div = document.createElement("div");

      const displayValue = m >= 1024 ? (m / 1024) + " TB" : m + " GB";

      div.innerHTML = `
    <label>
      <input type="checkbox" value="${m}">
      ${displayValue}
    </label>
  `;

      memoryDiv.appendChild(div);

    });

    // KEYBOARD (Scrollable)
    const keyboardDiv = document.getElementById("keyboardList");
    keyboardDiv.innerHTML = "";

    data.keyboards.forEach(k => {
      const div = document.createElement("div");
      div.className = "keyboard-item";

      div.innerHTML = `
    <input type="checkbox" value="${k}">
    <span class="keyboard-text">${k}</span>
  `;

      keyboardDiv.appendChild(div);
    });


    // RAM
    const ramDiv = document.getElementById("ramList");
    data.ramValues.forEach(r => {
      const div = document.createElement("div");
      div.innerHTML = `
        <label>
          <input type="checkbox" value="${r}">
          ${r} GB
        </label>
      `;
      ramDiv.appendChild(div);
    });

  });

// Load Display Options
fetch("/api/displayOptions")
  .then(res => res.json())
  .then(data => {

    const resolutionDiv = document.getElementById("resolutionOptions");
    const refreshDiv = document.getElementById("refreshRateOptions");

    // Resolution
    data.resolutions.forEach(resolution => {
      resolutionDiv.innerHTML += `
        <label>
          <input type="checkbox" value="${resolution}">
          ${resolution}
        </label><br>
      `;
    });


    // Refresh Rate (ignore empty handled in backend)
    data.refreshRates.forEach(rate => {
      refreshDiv.innerHTML += `
        <label>
          <input type="checkbox" value="${rate}">
          ${rate}
        </label><br>
      `;
    });

  });

// Load brands dynamically
fetch("/api/brands")
  .then(res => res.json())
  .then(data => {
    const brandList = document.getElementById("brandList");

    data.forEach(brand => {
      const div = document.createElement("div");
      div.className = "brand-item";
      div.innerHTML = `
            <label>
              <input type="checkbox" value="${brand}">
              ${brand}
            </label>
          `;
      brandList.appendChild(div);
    });
  });

//price fetch
fetch("/api/maxPrice")
  .then(res => res.json())
  .then(data => {

    const max = data.maxPrice;

    const quickValues = [30000, 40000, 50000, 70000, 80000, 100000, max];

    const quickDiv = document.getElementById("quickPrices");

    quickValues.forEach(value => {
      const btn = document.createElement("button");
      btn.style.margin = "5px";
      btn.innerText = value;
      btn.onclick = () => {
        document.getElementById("priceInput").value = value;
      };
      quickDiv.appendChild(btn);
    });
  });

//view details button 
function viewDetails(laptop) {

  const modal = document.getElementById("detailsModal");
  const body = document.getElementById("detailsBody");

  const brand = laptop["Brand:"];

  const imageURL =
    "https://source.unsplash.com/600x400/?laptop," +
    encodeURIComponent(brand);

  body.innerHTML = `

    <img 
      src="${imageURL}" 
      class="details-img"
      onerror="this.src='https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60'"
    >

    <h2>${laptop["Product name"]}</h2>

    <p><b>Brand:</b> ${laptop["Brand:"]}</p>
    <p><b>Processor:</b> ${laptop["Processor"]}</p>
    <p><b>RAM:</b> ${laptop["RAM"]}</p>
    <p><b>Storage:</b> ${laptop["Hard drive"]}</p>
    <p><b>Display:</b> ${laptop["Display"]}</p>
    <p><b>Operating System:</b> ${laptop["Operating System"]}</p>
    <p><b>Weight:</b> ${laptop["Weight"]}</p>
    <p><b>Price:</b> ₹${laptop["Price"]}</p>

  `;

  modal.style.display = "flex";
}

//close button details modal
function closeDetails() {
  document.getElementById("detailsModal").style.display = "none";
}

//close view details modal
window.addEventListener("click", function (event) {

  const modal = document.getElementById("detailsModal");

  if (event.target === modal) {
    modal.style.display = "none";
  }

});

//recommendation modal function
function openRecommendModal() {

  document.getElementById("recommendModal").style.display = "flex";
}

function closeRecommendModal() {

  document.getElementById("recommendModal").style.display = "none";

}

//save user answer
function submitPurpose() {

  const selected = document.querySelector("input[name='purpose']:checked");

  if (!selected) {
    alert("Please select laptop purpose");
    return;
  }

  const purpose = selected.value;

  const portability =
    document.querySelector("input[name='portability']:checked")?.value;

  const displaySize =
    document.getElementById("recommendDisplay").value;

  const budget = document.getElementById("recommendBudget").value;

  const ram = parseInt(document.getElementById("recommendRam").value);

  const purposeRules = {

    student: { minRam: 4 },
    programming: { minRam: 8 },
    coding_gaming: { minRam: 16 },
    gaming_editing: { minRam: 16 },
    office: { minRam: 8 }

  };

  const minRequired = purposeRules[purpose].minRam;

  if (ram < minRequired) {

    alert(
      "⚠ It is not recommended to use " +
      ram +
      "GB RAM for '" +
      purpose.replace("_", " ") +
      "'. Minimum recommended RAM is " +
      minRequired +
      "GB."
    );

    return;
  }

  localStorage.setItem("laptopPurpose", purpose);
  localStorage.setItem("budget", budget);
  localStorage.setItem("ram", ram);

  fetch("/api/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      purpose,
      budget,
      ram,
      portability,
      displaySize
    })
  })
    .then(res => res.json())
    .then(displayRecommended);

  closeRecommendModal();
}

//display recommended laptops
function displayRecommended(data) {

  const resultsDiv = document.getElementById("laptopResults");
  resultsDiv.innerHTML = "";

  if (data.length === 0) {
    resultsDiv.innerHTML = "<p style='text-align:center;'>No laptops found</p>";
    return;
  }

  data.forEach(laptop => {

    const card = document.createElement("div");
    card.className = "laptop-card";

    const brand = laptop["Brand:"];

    const imageURL =
      "https://source.unsplash.com/400x300/?laptop," +
      encodeURIComponent(brand);

    card.innerHTML = `
<img 
  src="${imageURL}" 
  class="laptop-img"
  onerror="this.src='https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=60'"
>

<h3>${laptop["Product name"]}</h3>

<p><b>Brand:</b> ${laptop["Brand:"]}</p>
<p><b>Processor:</b> ${laptop["Processor"]}</p>
<p><b>RAM:</b> ${laptop["RAM"]}</p>
<p><b>Price:</b> ₹${laptop["Price"]}</p>

<button onclick='viewDetails(${JSON.stringify(laptop)})'>
View Details
</button>
`;

    resultsDiv.appendChild(card);

  });

}

loadDisplaySizes();