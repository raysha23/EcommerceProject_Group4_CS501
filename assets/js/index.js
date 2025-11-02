import { dresses, shoes } from "../data/productsData.js";

const productsContainer = document.getElementById("productsContainer");
const cartCount = document.getElementById("cartCount");
const searchInput = document.querySelector(
  'input[aria-label="Search products"]'
);

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

// Save cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Navigate to product page
function goToProductPage(product) {
  const params = new URLSearchParams({
    name: product.name,
    price: product.price,
    image: `../${product.image}`,
    description: product.description,
  });
  window.location.href = `../views/product.html?${params.toString()}`;
}

// Render products
function renderProducts(filteredProducts) {
  productsContainer.innerHTML = "";

  if (filteredProducts.length === 0) {
    productsContainer.innerHTML = `<p class="col-span-full text-center text-gray-500 mt-4">Nothing found.</p>`;
    return;
  }

  filteredProducts.forEach((product) => {
    if (!product.quantity) product.quantity = 1;

    const article = document.createElement("article");
    article.className = `
      rounded-md p-4 flex flex-col h-full border border-gray-300
      hover:border-brand cursor-pointer hover:-translate-y-1 hover:shadow-md
      transition-all duration-300 transform
    `;

    article.innerHTML = `
      <div class="relative">
        <div class="aspect-[4/3] bg-white rounded-md border border-gray-300 overflow-hidden flex items-center justify-center">
          <img src="${product.image}" alt="${
      product.name
    }" class="object-contain h-full w-full pointer-events-none" />
        </div>
      </div>
      <div class="mt-4 flex-1 flex flex-col">
        <p class="text-lg font-semibold leading-tight lg:line-clamp-1 line-clamp-2">${
          product.name
        }</p>
        <p class="text-lg font-extrabold text-brand mt-1">$${product.price.toFixed(
          2
        )}</p>
        <button
          class="addToCartSlide mt-4 text-white px-6 py-2 rounded-full cursor-pointer font-medium 
          bg-brand transition-all duration-300 relative overflow-hidden
          hover:bg-brand/90 hover:-translate-y-0.5 hover:shadow-[0_0_10px_rgba(59,130,246,0.4)] active:scale-95">
          <span class="addText">Add to Cart</span>
          <span class="checkIcon absolute inset-0 flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300">
            ✅Added
          </span>
        </button>
      </div>
    `;

    productsContainer.appendChild(article);

    // --- Click entire card to go to product page ---
    article.addEventListener("click", (e) => {
      // Prevent navigation if the Add to Cart button was clicked
      if (e.target.closest(".addToCartSlide")) return;
      goToProductPage(product);
    });

    // --- Add to cart functionality ---
    const btn = article.querySelector(".addToCartSlide");
    const text = btn.querySelector(".addText");
    const check = btn.querySelector(".checkIcon");

    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering article click

      const existingIndex = cart.findIndex((p) => p.name === product.name);
      if (existingIndex > -1) {
        // If item already exists in cart
        if (cart[existingIndex].quantity >= 5) {
          alert("Maximum quantity reached (5 per item)");
          return;
        } else {
          cart[existingIndex].quantity += 1;
        }
      } else {
        // If item is new
        cart.push({ ...product, quantity: 1 });
      }

      saveCart();
      updateCartCount();

      // Animation for button feedback
      text.classList.add("opacity-0", "-translate-y-2");
      check.classList.remove("opacity-0", "translate-y-2");
      btn.style.backgroundColor = "#22c55e"; // Tailwind green-500
      btn.style.transition = "background-color 0.3s ease";

      setTimeout(() => {
        text.classList.remove("opacity-0", "-translate-y-2");
        check.classList.add("opacity-0", "translate-y-2");
        btn.style.backgroundColor = ""; // reset
      }, 1200);
    });
  });
}

// Filters
function applyFilters() {
  let filtered = allProducts;

  if (currentCategory !== "all") {
    filtered = filtered.filter((p) => p.category === currentCategory);
  }

  if (currentSearch.trim() !== "") {
    const term = currentSearch.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(term));
  }

  renderProducts(filtered);
}

// Category buttons
document.querySelectorAll("button[data-category]").forEach((btn) => {
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

// Initial render
applyFilters();
