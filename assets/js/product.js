// Get elements
const productImage = document.querySelector("main img");
const productName = document.querySelector("h1");
const productPrice = document.querySelector("p.font-extrabold");
const productDescription = document.querySelector("main p.text-gray-600");
const addToCartBtn = document.querySelector(".addToCartSlide");
const addText = addToCartBtn.querySelector(".addText");
const checkIcon = addToCartBtn.querySelector(".checkIcon");
const buyNowBtn = document.getElementById("buyNowBtn");
const cartCount = document.getElementById("cartCount");

// Create a modal container
const modal = document.createElement("div");
modal.id = "modalMessage";
modal.className = "fixed inset-0 bg-black bg-opacity-40 hidden items-center justify-center z-[2000]";
modal.innerHTML = `
  <div class="bg-white rounded-2xl shadow-xl px-6 py-5 text-center max-w-xs mx-auto">
    <p id="modalText" class="text-gray-800 font-medium text-lg mb-4"></p>
    <button id="modalClose" class="bg-brand-blue hover:bg-blue-600 text-white px-4 py-2 rounded-full font-semibold transition-all">OK</button>
  </div>
`;
document.body.appendChild(modal);

const modalText = document.getElementById("modalText");
const modalClose = document.getElementById("modalClose");


modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

// Get product data from URL query params
const params = new URLSearchParams(window.location.search);
const product = {
  name: params.get("name") || "Product Name",
  price: parseFloat(params.get("price")) || 0,
  image: params.get("image") || "images/default.jpg",
  quantity: 1,
  description: params.get("description") || "No description available.",
};

// Populate the page
productImage.src = `../${product.image}`;
productName.textContent = product.name;
productPrice.textContent = `$${product.price.toFixed(2)}`;
productDescription.textContent = product.description;

// Cart functionality
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  if (totalItems > 0) {
    cartCount.classList.remove("hidden");
    cartCount.textContent = totalItems;
  } else {
    cartCount.classList.add("hidden");
  }
}

// Initial cart count
updateCartCount();

// Function to add product to cart with quantity check
function addProductToCart() {
  const existingIndex = cart.findIndex((p) => p.name === product.name);

  if (existingIndex > -1) {
    if (cart[existingIndex].quantity >= 5) {
      alert("You can only buy up to 5 of this item.");
      return false; // stop
    } else {
      cart[existingIndex].quantity += 1;
    }
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartCount();
  return true; // successful add
}

// Add to Cart Button Click
addToCartBtn.addEventListener("click", () => {
  const added = addProductToCart();
  if (!added) return;

  // Animation
  addText.classList.add("opacity-0", "-translate-y-2");
  checkIcon.classList.remove("opacity-0", "translate-y-2");
  addToCartBtn.classList.add("bg-green-500");

  setTimeout(() => {
    addText.classList.remove("opacity-0", "-translate-y-2");
    checkIcon.classList.add("opacity-0", "translate-y-2");
    addToCartBtn.classList.remove("bg-green-500");
  }, 1200);
});

// Buy Now Button Click
buyNowBtn.addEventListener("click", () => {
  const added = addProductToCart();
  if (added) {
    window.location.href = "cart.html"; // Redirect if successful
  }
});
