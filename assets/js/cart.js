// Get elements
const cartContainer = document.getElementById("productsContainer");
const orderSummary = document.querySelector("div.bg-white.p-6.rounded-lg.shadow.h-fit");
const checkoutBtn = orderSummary.querySelector("button span");

// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
cart = cart.map(p => ({ ...p, quantity: Number(p.quantity) || 1 }));

// Render cart items
function renderCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="text-gray-600 text-center py-8">Your cart is empty.</p>`;
    updateSummary();
    return;
  }

  cart.forEach((product, index) => {
    const section = document.createElement("section");
    section.className = "bg-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-start gap-4 relative";

    section.innerHTML = `
      <div class="w-full flex justify-center items-center h-full md:w-auto md:pr-4">
        <input type="checkbox" class="cartCheckbox h-5 w-5 border-gray-300 rounded focus:ring-blue-500 cursor-pointer bg-white/80 backdrop-blur-sm" checked data-index="${index}"/>
      </div>

      <div class="flex flex-col md:flex-row gap-6 w-full">
        <div class="bg-gray-100 h-48 w-full md:w-1/2 rounded-xl overflow-hidden flex items-center justify-center">
          <img src="../${product.image}" alt="${product.name}" class="w-full h-full object-contain"/>
        </div>

        <div class="flex-1 flex flex-col justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-2">${product.name}</h2>
            <p class="text-gray-600">${product.description || ""}</p>
          </div>

          <div class="mt-6 flex items-center justify-between border-t border-gray-300 pt-4">
            <div class="text-2xl font-bold text-brand">$${product.price}</div>

            <div class="flex items-center gap-4 relative">
              <!-- Quantity Dropdown -->
              <div class="relative z-[9999]">
                <button class="qtyButton flex items-center gap-1 sm:gap-2 border border-gray-300 rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-xs sm:text-sm md:text-sm">
                  <span class="qtySelected font-medium text-xs sm:text-sm md:text-sm">Qty: ${product.quantity}</span>
                  <svg class="arrowIcon w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 text-gray-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                <div class="qtyMenu absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 scale-95 transform transition-all duration-200 origin-top hidden z-[9999]">
                  <ul class="py-1">
                    <li><button class="w-full text-left px-3 py-1 hover:bg-gray-100" data-value="1">1</button></li>
                    <li><button class="w-full text-left px-3 py-1 hover:bg-gray-100" data-value="2">2</button></li>
                    <li><button class="w-full text-left px-3 py-1 hover:bg-gray-100" data-value="3">3</button></li>
                    <li><button class="w-full text-left px-3 py-1 hover:bg-gray-100" data-value="4">4</button></li>
                    <li><button class="w-full text-left px-3 py-1 hover:bg-gray-100" data-value="5">5</button></li>
                  </ul>
                </div>
              </div>

              <!-- Delete -->
              <button class="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 deleteBtn" data-index="${index}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12M9 7V4h6v3m2 0v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    cartContainer.appendChild(section);
  });

  setupQuantityButtons();
  setupDeleteButtons();
  setupCheckboxes();
  updateSummary();
}

// Update summary totals
function updateSummary() {
  let totalQty = 0;
  let totalPrice = 0;

  document.querySelectorAll(".cartCheckbox").forEach(cb => {
    const idx = parseInt(cb.dataset.index, 10);
    if (!isNaN(idx) && cb.checked && cart[idx]) {
      const qty = Number(cart[idx].quantity) || 0;
      const price = Number(cart[idx].price) || 0;
      totalQty += qty;
      totalPrice += price * qty;
    }
  });

  checkoutBtn.textContent = totalQty;
  orderSummary.querySelector("h3 span").textContent = `$${totalPrice.toFixed(2)}`;
}

// Setup quantity dropdown buttons
function setupQuantityButtons() {
  document.querySelectorAll(".qtyButton").forEach(button => {
    const parent = button.closest(".relative");
    const menu = parent.querySelector(".qtyMenu");
    const arrow = parent.querySelector(".arrowIcon");
    const qtyText = parent.querySelector(".qtySelected");

    button.addEventListener("click", e => {
      e.stopPropagation();
      menu.classList.toggle("hidden");
      menu.classList.toggle("opacity-0");
      menu.classList.toggle("scale-95");
      arrow.classList.toggle("rotate-180");
    });

    menu.querySelectorAll("button").forEach(item => {
      item.addEventListener("click", () => {
        const newQty = parseInt(item.dataset.value, 10) || 1;
        qtyText.textContent = "Qty: " + newQty;
        menu.classList.add("hidden", "opacity-0", "scale-95");
        arrow.classList.remove("rotate-180");

        const section = button.closest("section");
        const deleteBtn = section ? section.querySelector(".deleteBtn") : null;
        const productIndex = deleteBtn ? parseInt(deleteBtn.dataset.index, 10) : NaN;

        if (!isNaN(productIndex) && cart[productIndex]) {
          cart[productIndex].quantity = newQty;
          localStorage.setItem("cart", JSON.stringify(cart));
          updateSummary();
        }
      });
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".qtyMenu").forEach(menu => menu.classList.add("hidden", "opacity-0", "scale-95"));
    document.querySelectorAll(".arrowIcon").forEach(icon => icon.classList.remove("rotate-180"));
  });
}

// Setup delete buttons
function setupDeleteButtons() {
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index, 10);
      if (!isNaN(idx)) {
        cart.splice(idx, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    });
  });
}

// Setup checkboxes
function setupCheckboxes() {
  document.querySelectorAll(".cartCheckbox").forEach(cb => {
    cb.addEventListener("change", updateSummary);
  });
}

// Initial render
renderCart();
