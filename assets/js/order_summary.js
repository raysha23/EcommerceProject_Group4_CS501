// Get references
const orderItemsDiv = document.getElementById("orderItems");
const subtotalSpan = document.getElementById("subtotal");
const shippingSpan = document.getElementById("shipping");
const grandTotalSpan = document.getElementById("grandTotal");
const continueBtn = document.getElementById("continueBtn");

// Get cart from localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const shippingCost = 20;

// Render the order summary
function renderOrderSummary() {
  orderItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    orderItemsDiv.innerHTML = `<p class="text-center text-gray-500 py-4">Your cart is empty.</p>`;
    subtotalSpan.textContent = "$0.00";
    shippingSpan.textContent = `$${shippingCost.toFixed(2)}`;
    grandTotalSpan.textContent = `$${shippingCost.toFixed(2)}`;
    return;
  }

  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const div = document.createElement("div");
    div.className =
      "bg-white/90 backdrop-blur-sm border border-gray-100 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center gap-4";

    div.innerHTML = `
      <div class="bg-gray-100 h-32 w-full md:w-1/4 rounded-xl overflow-hidden flex items-center justify-center">
        <img src="${item.image}" alt="${
      item.name
    }" class="w-full h-full object-contain"/>
      </div>
      <div class="flex-1 flex flex-col justify-between">
        <h2 class="text-xl font-semibold text-gray-900">${item.name}</h2>
        <p class="text-gray-600 text-sm">${item.description || ""}</p>
        <div class="mt-2 flex justify-between items-center">
          <span class="text-gray-700">Qty: ${item.quantity}</span>
          <span class="text-gray-900 font-semibold">$${itemTotal.toFixed(
            2
          )}</span>
        </div>
      </div>
    `;
    orderItemsDiv.appendChild(div);
  });

  subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
  shippingSpan.textContent = `$${shippingCost.toFixed(2)}`;
  grandTotalSpan.textContent = `$${(subtotal + shippingCost).toFixed(2)}`;
}

// Initial render
renderOrderSummary();

// Optional: clear cart after payment so user sees empty cart next time
localStorage.removeItem("cart");

// Continue button goes back to homepage
continueBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});
