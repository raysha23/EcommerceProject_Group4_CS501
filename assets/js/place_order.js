// References
const summaryList = document.getElementById("orderSummaryList");
const totalSpan = document.getElementById("orderTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const shippingForm = document.getElementById("shippingForm");

// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to render order summary
function renderOrderSummary() {
  summaryList.innerHTML = "";

  if (cart.length === 0) {
    summaryList.innerHTML = `<p class="text-gray-600 text-center py-4">Your cart is empty.</p>`;
    totalSpan.textContent = "$0.00";
    checkoutBtn.textContent = "Proceed to Payment";
    return;
  }

  let totalPrice = 0;
  let totalQty = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;
    totalQty += item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.className = "flex items-center justify-between gap-4 p-3 border rounded-lg";

    itemDiv.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-contain rounded-lg border"/>
        <div>
          <p class="font-medium">${item.name}</p>
          <p class="text-gray-500 text-sm">Qty: ${item.quantity}</p>
        </div>
      </div>
      <div class="font-semibold">$${itemTotal.toFixed(2)}</div>
    `;

    summaryList.appendChild(itemDiv);
  });

  totalSpan.textContent = `$${totalPrice.toFixed(2)}`;
  checkoutBtn.textContent = `Proceed to Payment (${totalQty} items)`;
}

// Call render on page load
renderOrderSummary();

// Checkout button click event
checkoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Get shipping values
  const fullName = document.getElementById("fullName").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const postalCode = document.getElementById("postalCode").value.trim();
  const phone = document.getElementById("phone").value.trim();

  // Validate shipping fields
  if (!fullName || !address || !city || !postalCode || !phone) {
    alert("Please fill in all shipping details before proceeding to payment.");
    return;
  }

  // Validate cart
  if (!cart || cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  // All validations passed
  alert("All details are filled! Proceeding to payment...");

  // Example: redirect to payment page
  window.location.href = "../html files/payment.html";
});
