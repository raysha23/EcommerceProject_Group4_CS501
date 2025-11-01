import { dresses, shoes } from "./productsData.js";

const productsContainer = document.getElementById("productsContainer");
const cartCount = document.getElementById("cartCount");
const searchInput = document.querySelector('input[aria-label="Search products"]');

// Get cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "all";
let currentSearch = "";

// Update cart count display
function updateCartCount() {
  if (cart.length > 0) {
    cartCount.classList.remove("hidden");
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
  } else {
    cartCount.classList.add("hidden");
  }
}

updateCartCount();

// Merge all products
const allProducts = [...dresses, ...shoes];

// Function to save cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to navigate to product page with query params
function goToProductPage(product) {
  const params = new URLSearchParams({
    name: product.name,
    price: product.price,
    image: product.image,
    description: product.description 
  });
  window.location.href = `html/product.html?${params.toString()}`;
}

// Function to render products
function renderProducts(filteredProducts) {
  productsContainer.innerHTML = "";

  if (filteredProducts.length === 0) {
    productsContainer.innerHTML = `
      <p class="col-span-full text-center text-gray-500 mt-4">Nothing found.</p>
    `;
    return;
  }

  filteredProducts.forEach((product) => {
    if (!product.quantity) product.quantity = 1;

    const article = document.createElement("article");
    article.className =
      "border rounded-md p-4 flex flex-col h-full hover:shadow-md transition-shadow duration-300";

    article.innerHTML = `
      <div class="relative">
        <div class="aspect-[4/3] bg-white rounded-md border overflow-hidden flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
          <img src="${product.image}" alt="${product.name}" class="object-contain h-full w-full cursor-pointer" />
        </div>
      </div>
      <div class="mt-4 flex-1 flex flex-col">
        <p class="text-lg font-semibold leading-tight line-clamp-2">${product.name}</p>
        <p class="text-lg font-extrabold mt-1">$${product.price.toFixed(2)}</p>
        <button class="addToCartSlide mt-4 bg-brand-blue text-white px-6 py-2 rounded-full font-medium transition-all duration-300 relative overflow-hidden">
          <span class="addText">Add to Cart</span>
          <span class="checkIcon absolute inset-0 flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300">✅Added</span>
        </button>
      </div>
    `;

    productsContainer.appendChild(article);

    // Cart button functionality
    const btn = article.querySelector(".addToCartSlide");
    const text = btn.querySelector(".addText");
    const check = btn.querySelector(".checkIcon");

    btn.addEventListener("click", () => {
      const existingIndex = cart.findIndex((p) => p.name === product.name);
      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      saveCart();
      updateCartCount();

      // Animation
      text.classList.add("opacity-0", "-translate-y-2");
      check.classList.remove("opacity-0", "translate-y-2");
      btn.classList.add("bg-green-500");

      setTimeout(() => {
        text.classList.remove("opacity-0", "-translate-y-2");
        check.classList.add("opacity-0", "translate-y-2");
        btn.classList.remove("bg-green-500");
      }, 1200);
    });

    // Click on product image to go to product page
    const img = article.querySelector("img");
    img.addEventListener("click", () => goToProductPage(product));
  });
}

// Apply both category and search filters
function applyFilters() {
  let filtered = allProducts;

  // Filter by category
  if (currentCategory !== "all") {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  // Filter by search term
  if (currentSearch.trim() !== "") {
    const term = currentSearch.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
  }

  renderProducts(filtered);
}

// Category buttons
document.querySelectorAll("button[data-category]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentCategory = btn.dataset.category;
    applyFilters();
  });
});

// Search input
searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  applyFilters();
});

// Initial render: show all products
applyFilters();
