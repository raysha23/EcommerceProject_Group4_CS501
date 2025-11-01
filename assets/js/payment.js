const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsDiv = document.getElementById("cartItems");
const paymentTotal = document.getElementById("paymentTotal");
const payBtn = document.getElementById("payBtn");

// Render cart items
function renderCart() {
  cartItemsDiv.innerHTML = "";
  let totalPrice = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    const div = document.createElement("div");
    div.className = "flex items-center justify-between gap-4 p-3 border border-gray-300 rounded-lg";
    div.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="/${item.image}" alt="${item.name}" class="w-16 h-16 object-contain rounded-lg border border-gray-500"/>
        <div>
          <p class="font-medium">${item.name}</p>
          <p class="text-gray-500 text-sm">Qty: ${item.quantity}</p>
        </div>
      </div>
      <div class="font-semibold">$${itemTotal.toFixed(2)}</div>
    `;
    cartItemsDiv.appendChild(div);
  });

  paymentTotal.textContent = `$${totalPrice.toFixed(2)}`;
}

renderCart();

// Utility functions
function isValidCardNumber(number) {
  return /^\d{16}$/.test(number);
}

function isValidCVC(cvc) {
  return /^\d{3,4}$/.test(cvc);
}

function isValidExpiry(expiry) {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  const [month, year] = expiry.split("/").map(Number);
  if (month < 1 || month > 12) return false;

  const currentYear = new Date().getFullYear() % 100; // get last 2 digits
  const currentMonth = new Date().getMonth() + 1;

  return year > currentYear || (year === currentYear && month >= currentMonth);
}

// Cardholder Name: letters + spaces only
const cardNameInput = document.getElementById("cardName");
cardNameInput.addEventListener("input", () => {
  cardNameInput.value = cardNameInput.value.replace(/[^a-zA-Z\s]/g, '');
});

// Card Number: digits only, max 16
const cardNumberInput = document.getElementById("cardNumber");
cardNumberInput.addEventListener("input", () => {
  cardNumberInput.value = cardNumberInput.value.replace(/\D/g, '').slice(0, 16);
});

// CVC: digits only, max 4
const cvcInput = document.getElementById("cvc");
cvcInput.addEventListener("input", () => {
  cvcInput.value = cvcInput.value.replace(/\D/g, '').slice(0, 4);
});

// Expiry: MM/YY format
const expiryInput = document.getElementById("expiry");
expiryInput.addEventListener("input", () => {
  expiryInput.value = expiryInput.value.replace(/[^\d\/]/g, '');
  if (expiryInput.value.length === 2 && !expiryInput.value.includes('/')) {
    expiryInput.value += '/';
  }
});

// Pay button event
payBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const cardName = cardNameInput.value.trim();
  const cardNumber = cardNumberInput.value.trim();
  const expiry = expiryInput.value.trim();
  const cvc = cvcInput.value.trim();

  // Validations
  if (!cardName) return alert("Cardholder Name is required.");
  if (!cardNumber || !isValidCardNumber(cardNumber)) return alert("Card Number must be 16 digits.");
  if (!expiry || !isValidExpiry(expiry)) return alert("Expiry must be valid MM/YY.");
  if (!cvc || !isValidCVC(cvc)) return alert("CVC must be 3 or 4 digits.");
  if (!cart || cart.length === 0) return alert("Your cart is empty.");

  alert(`Payment of ${paymentTotal.textContent} successful!`);
  localStorage.removeItem("cart");
  window.location.href = "order_complete.html";
});
