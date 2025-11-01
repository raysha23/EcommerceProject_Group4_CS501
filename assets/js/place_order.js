// References
const summaryList = document.getElementById("orderSummaryList");
const totalSpan = document.getElementById("orderTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const shippingForm = document.getElementById("shippingForm");
const errorMsg = document.getElementById("formError");

// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Restrict Full Name to letters and spaces only
const fullNameInput = document.getElementById("fullName");
fullNameInput.addEventListener("input", () => {
  fullNameInput.value = fullNameInput.value.replace(/[^a-zA-Z\s]/g, '');
});

// Restrict Phone to numbers only, max 11
const phoneInput = document.getElementById("phone");
phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 11);
});

// Render order summary
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

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;
    totalQty += item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.className = "flex items-center justify-between gap-4 p-3 border border-gray-500 rounded-lg";

    itemDiv.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="/${item.image}" alt="${item.name}" class="w-16 h-16 object-contain rounded-lg" />
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

// Validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Show error
function showError(message) {
  alert(message);
}

// Checkout button
checkoutBtn.addEventListener("click", e => {
  e.preventDefault();
  errorMsg.classList.add("hidden");

  const fullName = fullNameInput.value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const postalCode = document.getElementById("postalCode").value.trim();
  const phone = phoneInput.value.trim();

  // Validations
  if (!fullName) return showError("Full Name is required.");
  if (!/^[a-zA-Z\s]+$/.test(fullName)) return showError("Full Name can contain letters and spaces only.");
  if (!email || !validateEmail(email)) return showError("Valid Email is required.");
  if (!address) return showError("Address is required.");
  if (!city) return showError("City is required.");
  if (!postalCode || !/^\d{4,10}$/.test(postalCode)) return showError("Valid Postal Code is required.");
  if (!phone || !/^\d{11}$/.test(phone)) return showError("Phone number must be exactly 11 digits.");

  if (!cart || cart.length === 0) return showError("Your cart is empty.");

  // All good
  alert("All details are filled! Proceeding to payment...");
  window.location.href = "payment.html";
});

// Render summary on load
renderOrderSummary();
