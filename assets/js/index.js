import { dresses, shoes } from "../data/productsData.js";

/* -----------------------------
   ELEMENT REFERENCES
----------------------------- */
const productsContainer = document.getElementById("productsContainer");
const cartCount = document.getElementById("cartCount");
const searchInput = document.getElementById("search-input");
const categoryBtn = document.getElementById("category-button");
const dropdown = document.getElementById("dropdown-categories");
const arrow = document.getElementById("arrow-down");

/* -----------------------------
   INITIAL STATE
----------------------------- */
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "all";
let currentSearch = "";
const allProducts = [...dresses, ...shoes];

/* -----------------------------
   CART FUNCTIONS
----------------------------- */
function updateCartCount() {
  if (cart.length > 0) {
    cartCount.classList.remove("hidden");
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
  } else {
    cartCount.classList.add("hidden");
  }
}
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
updateCartCount();

/* -----------------------------
   NAVIGATION
----------------------------- */
function goToProductPage(product) {
  const params = new URLSearchParams({
    name: product.name,
    price: product.price,
    image: product.image,
    description: product.description,
  });
  window.location.href = `views/product.html?${params.toString()}`;
}

/* -----------------------------
   RENDER PRODUCTS
----------------------------- */
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

    /* --- Product Card Click (go to details) --- */
    article.addEventListener("click", (e) => {
      if (e.target.closest(".addToCartSlide")) return; // ignore button clicks
      goToProductPage(product);
    });

    /* --- Add to Cart Button --- */
    const btn = article.querySelector(".addToCartSlide");
    const text = btn.querySelector(".addText");
    const check = btn.querySelector(".checkIcon");

    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // avoid card click

      const existingIndex = cart.findIndex((p) => p.name === product.name);
      if (existingIndex > -1) {
        if (cart[existingIndex].quantity >= 5) {
          alert("Maximum quantity reached (5 per item)");
          return;
        }
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      saveCart();
      updateCartCount();

      // Feedback Animation
      text.classList.add("opacity-0", "-translate-y-2");
      check.classList.remove("opacity-0", "translate-y-2");
      btn.style.backgroundColor = "#22c55e"; // green-500
      btn.style.transition = "background-color 0.3s ease";

      setTimeout(() => {
        text.classList.remove("opacity-0", "-translate-y-2");
        check.classList.add("opacity-0", "translate-y-2");
        btn.style.backgroundColor = "";
      }, 1200);
    });
  });
}

/* -----------------------------
   FILTERING SYSTEM
----------------------------- */
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
applyFilters();

/* -----------------------------
   CATEGORY DROPDOWN
----------------------------- */
document.querySelectorAll("button[data-category]").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentCategory = btn.dataset.category;
    applyFilters();
  });
});

categoryBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  const isOpen = dropdown.classList.contains("opacity-100");

  if (isOpen) {
    dropdown.classList.remove(
      "opacity-100",
      "translate-y-0",
      "pointer-events-auto"
    );
    dropdown.classList.add("opacity-0", "translate-y-2", "pointer-events-none");
    arrow.classList.remove("rotate-180");
  } else {
    dropdown.classList.remove(
      "opacity-0",
      "translate-y-2",
      "pointer-events-none"
    );
    dropdown.classList.add(
      "opacity-100",
      "translate-y-0",
      "pointer-events-auto"
    );
    arrow.classList.add("rotate-180");
  }
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!categoryBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove(
      "opacity-100",
      "translate-y-0",
      "pointer-events-auto"
    );
    dropdown.classList.add("opacity-0", "translate-y-2", "pointer-events-none");
    arrow.classList.remove("rotate-180");
  }
});


/* -----------------------------
   SEARCH INPUT (FILTER + MOBILE EXPAND + SUPER SMOOTH EASING)
----------------------------- */

// Filtering
searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  applyFilters();
});

searchInput.addEventListener("focus", () => {
  if (window.innerWidth < 768) {
    const nav = document.querySelector("nav");
    if (nav) {
      // Add smooth fade-out with gentle delay
      nav.style.transition = "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)"; // smoother than ease-in-out
      nav.style.opacity = "0";
      nav.style.pointerEvents = "none";

      // Wait a bit before hiding (prevents abrupt disappearance)
      setTimeout(() => {
        nav.classList.add("hidden");
      }, 500);
    }

    // Expand search bar smoothly with same gentle easing
    searchInput.style.transition =
      "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    searchInput.classList.add("w-[90vw]");

    // Optional subtle grow effect (pop feel)
    searchInput.style.transform = "scale(1.03)";
    setTimeout(() => {
      searchInput.style.transform = "scale(1)";
    }, 300);
  }
});

searchInput.addEventListener("blur", () => {
  if (window.innerWidth < 768) {
    const nav = document.querySelector("nav");
    if (nav) {
      // Unhide nav first, then fade back in gently
      nav.classList.remove("hidden");
      setTimeout(() => {
        nav.style.transition = "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        nav.style.opacity = "1";
        nav.style.pointerEvents = "auto";
      }, 50);
    }

    // Shrink back search bar with smooth easing
    searchInput.style.transition =
      "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    searchInput.classList.remove("w-[90vw]");
  }
});
