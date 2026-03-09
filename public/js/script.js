// script.js

// Clear localStorage only when server starts
if (!sessionStorage.getItem("appLoaded")) {

  localStorage.clear();

  sessionStorage.setItem("appLoaded", "true");

}

// ======================================
// FUNCTION: Create laptop card HTML
// Used to display each laptop in results
// ======================================
function createLaptopCard(laptop, showScore = false, index = null) {

  // Get brand name from laptop object
  const brand = laptop["Brand:"];

  // Default laptop image
  const imageURL =
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=60";

  // Badge for top recommended laptop
  let badge = "";

  // If first result → show top recommendation badge
  if (index === 0) {
    badge = "<span class='top-badge'>🏆 Top Recommendation</span>";
  }
  // Return HTML template string
  return `
  <div class="laptop-card">

    <img src="${imageURL}" class="laptop-img">

    <h3>${laptop["Product name"]}</h3>

    ${badge}

    ${// Show match score only for recommendation results
    showScore && laptop.score ? `
      <p style="color:green;">⭐ Match Score: ${laptop.score}</p>
    ` : ""}

    <p><b>Brand:</b> ${laptop["Brand:"]}</p>
    <p><b>Processor:</b> ${laptop["Processor"]}</p>
    <p><b>RAM:</b> ${laptop["RAM"]}</p>
    <p><b>Price:</b> ₹${laptop["Price"]}</p>

    <button onclick='viewDetails(${JSON.stringify(laptop)})'>
      View Details
    </button>

  </div>
  `;
}

let selectedBrands = [];

// ======================================
// Open filter panel
// ======================================
function openFilter() {
  document.getElementById("filterPanel").style.display = "block";
}

// ======================================
// Close filter panel
// ======================================
function closeFilter() {
  document.getElementById("filterPanel").style.display = "none";
}

// ======================================
// Apply selected filters
// This collects all filter values and
// sends them to backend API
// ======================================
function applyFilter() {

  // Get checked brand checkboxes
  const checked = document.querySelectorAll("#brandList input:checked");

  // Convert NodeList to array of brand values
  const selectedBrands = Array.from(checked).map(cb => cb.value);

  // Warranty selections
  const selectedWarranties = Array.from(
    document.querySelectorAll("#warrantyList input:checked")
  ).map(cb => cb.value);

  // Operating system selections
  const operatingSystems = Array.from(
    document.querySelectorAll("#osList input:checked")
  ).map(cb => cb.value);

  // Selected weight limit
  const weight = parseFloat(
    document.querySelector("#weightList input:checked")?.value
  );

  // RAM selections
  const selectedRam = Array.from(
    document.querySelectorAll("#ramList input:checked")
  ).map(cb => parseInt(cb.value));

  // Price limit entered by user
  const priceLimit = parseInt(document.getElementById("priceInput").value);


  // MEMORY
  // Get checked memory checkboxes and convert to array of values
  const selectedMemory = Array.from(
    document.querySelectorAll("#memoryList input:checked")
  ).map(cb => parseInt(cb.value));

  // KEYBOARD
  // Get checked keyboard checkboxes and convert to array of values
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

  // Save preferences to localStorage
  localStorage.setItem("preferences", JSON.stringify({
    brands: selectedBrands,
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
    weight,
    priceLimit
  }));

  // ======================================
  // Send filter request to backend
  // ======================================
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
    // convert response to JSON
    .then(res => res.json())

    // Handle returned laptop data
    .then(data => {
      // Save results and type to localStorage for persistence
      localStorage.setItem("laptopResults", JSON.stringify(data));
      // Mark that these results came from filter (not recommendation)
      localStorage.setItem("resultType", "filter");
      // Update result count and display laptops
      const resultCount = document.getElementById("resultCount");
      // Show number of laptops found
      resultCount.innerHTML = `Showing ${data.length} laptops`;
      // Get the div where results will be displayed
      const resultsDiv = document.getElementById("laptopResults");
      // Clear any previous results
      resultsDiv.innerHTML = "";
      // If no laptops found, show message and close filter panel
      if (data.length === 0) {
        resultsDiv.innerHTML = "<p style='text-align:center;'>No laptops found</p>";
        closeFilter();
        return;
      }
      // For each laptop in returned data, create a card and add to results div
      data.forEach(laptop => {
        // createLaptopCard is a function that returns HTML for a laptop card
        resultsDiv.innerHTML += createLaptopCard(laptop);
      });
      // After displaying results,
      closeFilter();

    });
}

// ======================================
// Update processor series options
// when Intel / Ryzen checkbox changes
// ======================================
function updateProcessorOptions() {
  // Get checked processor brand checkboxes
  const checked = document.querySelectorAll(
    "#processorSection input[type='checkbox']:checked"
  );
  // Convert to array of selected processor brands
  const selected = Array.from(checked).map(cb => cb.value);
  // Get the container div where processor series options will be displayed
  const container = document.getElementById("processorSeriesOptions");
  container.innerHTML = "";
  //intel series
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
  //ryzen series
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


// ======================================
// Show selected filter section and hide others
// Also highlights the active section in sidebar
// ======================================
function showSection(sectionId, el) {
  // List of all filter section IDs
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
  // Hide all sections
  sections.forEach(id => {
    document.getElementById(id).style.display = "none";
  });
  // Show the selected section
  document.getElementById(sectionId).style.display = "block";
  // Remove active class from all sidebar options
  document.querySelectorAll(".filter-options li").forEach(li =>
    li.classList.remove("active")
  );
  // Add active class to the clicked sidebar option
  el.classList.add("active");
}

// ======================================
// Modal functions for dynamic brand loading
// ======================================
function openModal() {
  modal.style.display = "block";
  loadBrands();
}
//=====================================
// Close modal when user clicks outside of it
//=====================================
function closeModal() {
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
};

//load Display Size
async function loadDisplaySizes() {
  // Fetch available display sizes from backend API
  const res = await fetch("/api/displaySizes");
  // Convert response to JSON array of sizes
  const sizes = await res.json();
  // Get the container div where display size options will be displayed
  const container = document.getElementById("displaySizeList");
  // Clear any existing options
  container.innerHTML = "";
  // For each size, create a checkbox option and add to container
  sizes.forEach(size => {
    // Create a label element for the checkbox and text
    const label = document.createElement("label");
    // Set the inner HTML of the label to include a checkbox input and the size text
    label.innerHTML = `
      <input type="checkbox" value="${size}" class="displaySizeCheck">
      ${size} inch
    `;
    // Append the label to the container div
    container.appendChild(label);
  });
}

// Load brands dynamically
async function loadBrands() {
  // Fetch available brands from backend API
  const res = await fetch("/api/brands");
  // Convert response to JSON array of brand names
  const brands = await res.json();
  //  Get the select element where brand options will be displayed
  brandSelect.innerHTML = "";
  // For each brand, create an option element and add to select
  brands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
}

// Search
//=====================================
// This function is called when user clicks search button
// It sends the search query to backend and displays results
//=====================================
async function searchLaptop() {
  // Get the search query entered by the user
  const query = document.getElementById("searchInput").value;
  // Send a GET request to the backend API with the search query as a parameter
  const res = await fetch(`/api/laptops/search?q=${query}`);
  // Convert the response to JSON array of laptops matching the search query
  const data = await res.json();
  // Get the div where search results will be displayed
  const resultsDiv = document.getElementById("laptopResults");
  resultsDiv.innerHTML = "";
  // Get the element where result count will be displayed and update it with the number of laptops found
  if (data.length === 0) {
    resultsDiv.innerHTML = "<p style='text-align:center;'>No laptops found</p>";
    return;
  }
  // For each laptop in the search results, create a laptop card and add it to the results div
  data.forEach(laptop => {
    resultsDiv.innerHTML += createLaptopCard(laptop);
  });

}



// Load Warranty Options
fetch("/api/specOptions")
  .then(res => res.json())
  .then(data => {

    //Operating system
    const osDiv = document.getElementById("osList");
    // For each operating system returned by the API, create a checkbox option and add it to the osList div
    data.operatingSystems.forEach(os => {
      // Create a div element to contain the checkbox and label for the operating system
      const div = document.createElement("div");
      // Set the inner HTML of the div to include a checkbox input and the operating system name
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
    // Define an array of weight ranges to create radio button options for laptop weight
    const weightRanges = [1, 2, 3, 4, 5];
    // For each weight range, create a radio button option and add it to the weightList div
    weightRanges.forEach(w => {
      // Create a div element to contain the radio button and label for the weight range
      const div = document.createElement("div");
      // Set the inner HTML of the div to include a radio button input and the weight range text
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
    // For each warranty option returned by the API, create a checkbox option and add it to the warrantyList div
    data.warranties.forEach(w => {
      // Create a div element to contain the checkbox and label for the warranty option
      const div = document.createElement("div");
      // Set the inner HTML of the div to include a checkbox input and the warranty duration text
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
    // For each memory value returned by the API, create a checkbox option and add it to the memoryList div
    data.memoryValues.forEach(m => {
      // Create a div element to contain the checkbox and label for the memory option
      const div = document.createElement("div");
      // Calculate display value in GB or TB based on the memory size and set the inner HTML of the div to include a checkbox input and the memory size text
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
    // Clear any existing keyboard options before adding new ones
    keyboardDiv.innerHTML = "";
    // For each keyboard type returned by the API, create a checkbox option and add it to the keyboardList div
    data.keyboards.forEach(k => {
      // Create a div element to contain the checkbox and label for the keyboard type
      const div = document.createElement("div");
      // Set a class name for styling the keyboard options
      div.className = "keyboard-item";
      // Set the inner HTML of the div to include a checkbox input and the keyboard type text
      div.innerHTML = `
    <input type="checkbox" value="${k}">
    <span class="keyboard-text">${k}</span>
  `;

      keyboardDiv.appendChild(div);
    });


    // RAM
    const ramDiv = document.getElementById("ramList");
    // For each RAM value returned by the API, create a checkbox option and add it to the ramList div
    data.ramValues.forEach(r => {
      // Create a div element to contain the checkbox and label for the RAM option
      const div = document.createElement("div");
      // Set the inner HTML of the div to include a checkbox input and the RAM size text
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
//=====================================
// This fetches available display options (resolutions and refresh rates) from the backend API and dynamically creates checkbox options for each in the filter panel
//=====================================
fetch("/api/displayOptions")
  // Convert response to JSON object containing arrays of resolutions and refresh rates
  .then(res => res.json())
  // Handle the returned data to create checkbox options for display resolutions and refresh rates
  .then(data => {
    // Get the div elements where resolution and refresh rate options will be displayed
    const resolutionDiv = document.getElementById("resolutionOptions");
    // Clear any existing options before adding new ones
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
      // Only add options that have a valid refresh rate value (filter out empty or null values)
      refreshDiv.innerHTML += `
        <label>
          <input type="checkbox" value="${rate}">
          ${rate}
        </label><br>
      `;
    });

  });

// Load brands dynamically
//=====================================
// This fetches available laptop brands from the backend API and dynamically creates checkbox options for each brand in the filter panel
//=====================================
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
//=====================================
// This fetches the maximum laptop price from the backend API and creates quick-select buttons for common price points up to the maximum price in the filter panel
//=====================================
fetch("/api/maxPrice")
  // Convert response to JSON object containing the maximum price value
  .then(res => res.json())
  // Handle the returned data to create quick-select buttons for price filtering
  .then(data => {
    // Get the maximum price value from the returned data
    const max = data.maxPrice;
    // Define an array of common price points to create quick-select buttons for, including the maximum price as the last option
    const quickValues = [30000, 40000, 50000, 70000, 80000, 100000, max];
    // Get the div element where the quick price buttons will be displayed
    const quickDiv = document.getElementById("quickPrices");
    // For each price point in the quickValues array, create a button element and add it to the quickPrices div
    quickValues.forEach(value => {
      // Create a button element for the quick price option
      const btn = document.createElement("button");
      // Set the class name for styling the quick price buttons
      btn.style.margin = "5px";
      // Set the button text to display the price point (e.g., "₹50000")
      btn.innerText = value;
      // Add an onclick event handler to the button that sets the value of the price input field to the selected price point when the button is clicked
      btn.onclick = () => {
        // Set the value of the price input field to the selected price point when the button is clicked
        document.getElementById("priceInput").value = value;
      };
      // Append the button to the quickPrices div
      quickDiv.appendChild(btn);
    });
  });

//view details button 
//=====================================
// This function is called when the user clicks the "View Details" button on a laptop card. It populates a modal with detailed information about the selected laptop and displays the modal to the user.
//=====================================
function viewDetails(laptop) {
  // Get the modal element and the body element where laptop details will be displayed
  const modal = document.getElementById("detailsModal");
  // Get the div element where the laptop details will be displayed in the modal
  const body = document.getElementById("detailsBody");
  // Get the brand name from the laptop object to use for fetching a relevant image from Unsplash
  const brand = laptop["Brand:"];

  const imageURL =
    "https://source.unsplash.com/600x400/?laptop," +
    encodeURIComponent(brand);
  // Set the inner HTML of the details body to display the laptop image and detailed specifications. The image URL is constructed to fetch a relevant laptop image based on the brand, and an onerror handler is included to provide a default image if the fetch fails. The laptop specifications are displayed in a structured format for easy reading.
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
  // Define minimum RAM requirements for each laptop purpose to provide user feedback if their selected RAM is below the recommended level for their intended use case
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

  localStorage.setItem("recommendAnswers", JSON.stringify({
    purpose,
    budget,
    ram,
    portability,
    displaySize
  }));

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
//=====================================
// This function takes the recommended laptop data returned from the backend API, saves it to localStorage for persistence, and updates the UI to display the recommended laptops to the user. It also handles the case where no recommended laptops are found and displays an appropriate message.
//=====================================
function displayRecommended(data) {
  // Save the recommended laptop results and the fact that these are recommendation results (not filter results) to localStorage for persistence. This allows the recommended results to be restored and displayed even after a page refresh.
  localStorage.setItem("laptopResults", JSON.stringify(data));
  localStorage.setItem("resultType", "recommend");

  const resultsDiv = document.getElementById("laptopResults");
  const resultCount = document.getElementById("resultCount");

  resultsDiv.innerHTML = "";

  resultCount.innerHTML = `Showing ${data.length} recommended laptops`;
  // If no recommended laptops are returned from the API, display a message indicating that no laptops were found and return early to avoid errors when trying to create laptop cards from an empty array.
  if (data.length === 0) {
    resultsDiv.innerHTML = "<p style='text-align:center;'>No laptops found</p>";
    return;
  }
  // For each laptop in the recommended results, create a laptop card and add it to the results div. Since these are recommendation results, we pass true for the showScore parameter to display the match score for each laptop, and we also pass the index to show the top recommendation badge for the first laptop.
  data.forEach((laptop, index) => {
    resultsDiv.innerHTML += createLaptopCard(laptop, true, index);
  });

}

//Restore Page After Reload
window.addEventListener("load", () => {
  // When the page loads, check if there are saved laptop results and a result type in localStorage. If so, parse the saved results and display them on the page. This allows the user to see their previous search or recommendation results even after refreshing the page.
  const savedResults = localStorage.getItem("laptopResults");
  const resultType = localStorage.getItem("resultType");
  // If there are no saved results in localStorage, return early and do not attempt to parse or display any results. This prevents errors that would occur if we tried to parse null or undefined values when there are no saved results.
  if (!savedResults) return;
  // If there are saved laptop results and a result type in localStorage, parse the saved results and display them on the page. This allows the user to see their previous search or recommendation results even after refreshing the page.
  const laptops = JSON.parse(savedResults);
  // Get the div where results will be displayed and the element for showing result count
  const resultsDiv = document.getElementById("laptopResults");
  // Update the result count element to show how many laptops are being displayed based on the saved results and whether they are from a recommendation or filter
  const resultCount = document.getElementById("resultCount");

  resultsDiv.innerHTML = "";

  if (resultType === "recommend") {

    resultCount.innerHTML = `Showing ${laptops.length} recommended laptops`;

    laptops.forEach((laptop, index) => {
      resultsDiv.innerHTML += createLaptopCard(laptop, true, index);
    });

  }
  else if (resultType === "filter") {

    resultCount.innerHTML = `Showing ${laptops.length} laptops`;
    // For each laptop in the saved results, create a laptop card and add it to the results div. Since these are filter results (not recommendations), we pass false for the showScore parameter and do not include the index for top recommendation badge.
    laptops.forEach(laptop => {
      // createLaptopCard is a function that returns HTML for a laptop card. We pass false for showScore since these are filter results, and we do not pass the index parameter since we do not want to show the top recommendation badge for filter results.
      resultsDiv.innerHTML += createLaptopCard(laptop);
    });

  }

});

//Restore Recommendation Answers
const savedRecommend = localStorage.getItem("recommendAnswers");
// If there are saved recommendation answers in localStorage, parse them and restore the user's previous selections in the recommendation modal when the page loads
if (savedRecommend) {
  // Parse the saved recommendation answers from localStorage into a JavaScript object
  const data = JSON.parse(savedRecommend);
  // Get the radio button element that matches the saved purpose value from the recommendation answers
  const purposeRadio =
    document.querySelector(`input[name="purpose"][value="${data.purpose}"]`);
  // If a radio button matching the saved purpose value exists, set it to checked to restore the user's previous selection in the recommendation modal
  if (purposeRadio) purposeRadio.checked = true;
  // Set the values of the budget, RAM, and display size inputs based on the saved recommendation answers
  document.getElementById("recommendBudget").value = data.budget || "";
  // Set the value of the RAM input to the saved RAM value or default to "any" if no value is saved
  document.getElementById("recommendRam").value = data.ram || "any";
  // Set the value of the display size input to the saved display size value or default to an empty string if no value is saved
  document.getElementById("recommendDisplay").value = data.displaySize || "";

  const portRadio =
    document.querySelector(`input[name="portability"][value="${data.portability}"]`);

  if (portRadio) portRadio.checked = true;

}
//Restore Filter Preferences
const savedPref = localStorage.getItem("preferences");

if (savedPref) {

  const pref = JSON.parse(savedPref);

  // restore brand
  pref.brands?.forEach(b => {
    const cb = document.querySelector(`#brandList input[value="${b}"]`);
    if (cb) cb.checked = true;
  });

  // restore RAM
  pref.ram?.forEach(r => {
    const cb = document.querySelector(`#ramList input[value="${r}"]`);
    if (cb) cb.checked = true;
  });

  // restore memory
  pref.memory?.forEach(m => {
    const cb = document.querySelector(`#memoryList input[value="${m}"]`);
    if (cb) cb.checked = true;
  });

  // restore price
  if (pref.priceLimit) {
    document.getElementById("priceInput").value = pref.priceLimit;
  }

}
// Load display sizes dynamically
loadDisplaySizes();