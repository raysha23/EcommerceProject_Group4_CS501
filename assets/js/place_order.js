// References
const summaryList = document.getElementById("orderSummaryList");
const totalSpan = document.getElementById("orderTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const shippingForm = document.getElementById("shippingForm");
const errorMsg = document.getElementById("formError");

// Modal references
const confirmModal = document.getElementById("confirmModal");
const confirmFullName = document.getElementById("confirmFullName");
const confirmEmail = document.getElementById("confirmEmail");
const confirmBarangay = document.getElementById("confirmBarangay");
const confirmCity = document.getElementById("confirmCity");
const confirmPhone = document.getElementById("confirmPhone");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Restrict Full Name to letters and spaces only
const fullNameInput = document.getElementById("fullName");
fullNameInput.addEventListener("input", () => {
  fullNameInput.value = fullNameInput.value.replace(/[^a-zA-Z\s]/g, "");
});

// Restrict Phone to numbers only, max 11 digits
const phoneInput = document.getElementById("phone");
phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 11);
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

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;
    totalQty += item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.className =
      "flex items-center justify-between gap-4 p-3 border border-gray-300 rounded-lg";

    itemDiv.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="${item.image}" alt="${
      item.name
    }" class="w-16 h-16 object-contain rounded-lg" />
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

// Show input error with red border
function showError(input, message) {
  input.classList.add("border-red-500", "focus:ring-red-500");
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
}

// Clear previous errors
function clearErrors() {
  errorMsg.classList.add("hidden");
  errorMsg.textContent = "";
  shippingForm.querySelectorAll("input").forEach((input) => {
    input.classList.remove("border-red-500", "focus:ring-red-500");
  });
}

// Checkout button click
checkoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clearErrors();

  const fullName = fullNameInput.value.trim();
  const emailInput = document.getElementById("email");
  const barangayInput = document.getElementById("barangay");
  const cityInput = document.getElementById("city");
  const phone = phoneInput.value.trim();

  // Validation
  if (!fullName) return showError(fullNameInput, "Full Name is required.");
  if (!/^[a-zA-Z\s]+$/.test(fullName))
    return showError(
      fullNameInput,
      "Full Name must contain letters and spaces only."
    );
  if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim()))
    return showError(emailInput, "Valid Email is required.");
  if (!barangayInput.value.trim())
    return showError(barangayInput, "Barangay is required.");
  if (!cityInput.value.trim()) return showError(cityInput, "City is required.");
  if (!phone) return showError(phoneInput, "Phone number is required.");
  if (!/^09\d{9}$/.test(phone))
    return showError(
      phoneInput,
      "Phone number must start with 09 and be exactly 11 digits."
    );
  if (!cart || cart.length === 0)
    return showError(checkoutBtn, "Your cart is empty.");

  // Fill modal with user info
  confirmFullName.textContent = fullName;
  confirmEmail.textContent = emailInput.value.trim();
  confirmBarangay.textContent = barangayInput.value.trim();
  confirmCity.textContent = cityInput.value.trim();
  confirmPhone.textContent = phone;

  // Show confirmation modal
  confirmModal.classList.remove("hidden");

  // Save shipping info (optional)
  localStorage.setItem(
    "shippingInfo",
    JSON.stringify({
      fullName,
      email: emailInput.value.trim(),
      barangay: barangayInput.value.trim(),
      city: cityInput.value.trim(),
      phone,
    })
  );
});

// Cancel button hides modal
cancelBtn.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
});

// Confirm button proceeds to payment
confirmBtn.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
  window.location.href = "payment.html";
});

// Render order summary on load
renderOrderSummary();
