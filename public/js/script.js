// script.js
const modal = document.getElementById("modal");
const brandSelect = document.getElementById("brandSelect");

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

// Load brands dynamically
async function loadBrands() {
  const res = await fetch("/api/laptops/brands");
  const brands = await res.json();

  brandSelect.innerHTML = "";

  brands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
}

// Apply multi-brand filter
async function applyFilter() {
  const selectedBrands = Array.from(brandSelect.selectedOptions)
    .map(option => option.value);

  if (selectedBrands.length === 0) return;

  const res = await fetch(`/api/laptops/filter?brands=${selectedBrands.join(",")}`);
  const data = await res.json();

  displayResults(data);
  closeModal();
}

// Search
async function searchLaptop() {
  const query = document.getElementById("searchInput").value;
  const res = await fetch(`/api/laptops/search?q=${query}`);
  const data = await res.json();
  displayResults(data);
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