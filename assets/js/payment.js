// ================================
// 🛒 CART DISPLAY
// ================================
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsDiv = document.getElementById("cartItems");
const paymentTotal = document.getElementById("paymentTotal");

function renderCart() {
  cartItemsDiv.innerHTML = "";
  let totalPrice = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `<p class="text-center text-gray-500">Your cart is empty.</p>`;
    paymentTotal.textContent = "₱0.00";
    return;
  }

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    const div = document.createElement("div");
    div.className =
      "flex items-center justify-between gap-4 p-3 border border-gray-300 rounded-lg";
    div.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="../${item.image}" alt="${
      item.name
    }" class="w-16 h-16 object-contain rounded-lg border border-gray-300"/>
        <div>
          <p class="font-medium">${item.name}</p>
          <p class="text-gray-500 text-sm">Qty: ${item.quantity}</p>
        </div>
      </div>
      <div class="font-semibold">₱${itemTotal.toFixed(2)}</div>
    `;
    cartItemsDiv.appendChild(div);
  });

  paymentTotal.textContent = `₱${totalPrice.toFixed(2)}`;
}
renderCart();

// ================================
// ✅ VALIDATION HELPERS
// ================================
function isValidPhone(phone) {
  return /^09\d{9}$/.test(phone);
}

// ================================
// ⚠️ ERROR DISPLAY HELPERS
// ================================
function showError(input, message) {
  input.classList.add("border-red-500");
  let error = input.nextElementSibling;
  if (!error || !error.classList.contains("error-text")) {
    error = document.createElement("p");
    error.className = "error-text text-red-500 text-sm mt-1";
    input.insertAdjacentElement("afterend", error);
  }
  error.textContent = message;
}

function clearError(input) {
  input.classList.remove("border-red-500");
  const error = input.nextElementSibling;
  if (error && error.classList.contains("error-text")) {
    error.remove();
  }
}

// ================================
// 📞 PHONE NUMBER RESTRICTION
// ================================
document
  .querySelectorAll("input[placeholder*='Phone'], input[placeholder*='GCash']")
  .forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, ""); // only numbers
      if (input.value.length > 11) input.value = input.value.slice(0, 11);
    });
  });

// ================================
// 💳 PAYMENT TAB SWITCH
// ================================
const codTab = document.getElementById("codTab");
const gcashTab = document.getElementById("gcashTab");
const codForm = document.getElementById("codForm");
const gcashForm = document.getElementById("gcashForm");

const tabButtons = [codTab, gcashTab];
const forms = [codForm, gcashForm];

tabButtons.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    // Reset all tabs
    tabButtons.forEach((btn) => {
      btn.classList.remove("bg-brand", "text-white");
      btn.classList.add("bg-gray-200", "text-gray-800");
    });

    // Highlight clicked tab
    tab.classList.add("bg-brand", "text-white");
    tab.classList.remove("bg-gray-200", "text-gray-800");

    // Show only the corresponding form
    forms.forEach((form) => form.classList.add("hidden"));
    forms[index].classList.remove("hidden");
  });
});

// ================================
// 🏠 DEFAULT: CASH ON DELIVERY FOCUSED
// ================================
window.addEventListener("DOMContentLoaded", () => {
  // Highlight COD tab
  codTab.classList.add("bg-brand", "text-white");
  codTab.classList.remove("bg-gray-200", "text-gray-800");

  // Hide GCash form, show COD
  codForm.classList.remove("hidden");
  gcashForm.classList.add("hidden");
});

/// ================================
// 🏠 COD & GCASH PAYMENT WITH MODAL
// ================================

const modal = document.getElementById("confirmModal");
const confirmTitle = document.getElementById("confirmTitle");
const confirmMessage = document.getElementById("confirmMessage");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");

let paymentAction = null; // function to run after confirmation

function openModal(title, message, onConfirm) {
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;
  modal.classList.remove("hidden");
  paymentAction = onConfirm;
}

function closeModal() {
  modal.classList.add("hidden");
  paymentAction = null;
}

// Handle modal buttons
cancelBtn.addEventListener("click", closeModal);
confirmBtn.addEventListener("click", () => {
  if (paymentAction) paymentAction();
  closeModal();
});

// COD Payment
payCODBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (cart.length === 0) return;

  openModal(
    "Confirm Cash on Delivery",
    "Are you sure you want to confirm Cash on Delivery?",
    () => {
      alert("✅ Cash on Delivery confirmed!");
      localStorage.removeItem("cart");
      window.location.href = "order_complete.html";
    }
  );
});

// GCash Payment
payGCashBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (cart.length === 0) return;

  openModal(
    "Confirm GCash Payment",
    `Are you sure you want to pay ${paymentTotal.textContent} with GCash?`,
    () => {
      alert(`✅ GCash payment of ${paymentTotal.textContent} successful!`);
      localStorage.removeItem("cart");
      window.location.href = "order_complete.html";
    }
  );
});
