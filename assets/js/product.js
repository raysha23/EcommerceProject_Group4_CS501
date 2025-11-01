// Get elements
const productImage = document.querySelector("main img");
const productName = document.querySelector("h1");
const productPrice = document.querySelector("p.font-extrabold");
const productDescription = document.querySelector("main p.text-gray-600");
const addToCartBtn = document.querySelector(".addToCartSlide");
const addText = addToCartBtn.querySelector(".addText");
const checkIcon = addToCartBtn.querySelector(".checkIcon");
const cartCount = document.getElementById("cartCount");

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
productImage.src = product.image;
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

// Add to cart button
addToCartBtn.addEventListener("click", () => {
  // Check if product already in cart
  const existingIndex = cart.findIndex((p) => p.name === product.name);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  // Save cart and update count
  saveCart();
  updateCartCount();

  // Show animation
  addText.classList.add("opacity-0", "-translate-y-2");
  checkIcon.classList.remove("opacity-0", "translate-y-2");
  addToCartBtn.classList.add("bg-green-500");

  setTimeout(() => {
    addText.classList.remove("opacity-0", "-translate-y-2");
    checkIcon.classList.add("opacity-0", "translate-y-2");
    addToCartBtn.classList.remove("bg-green-500");
  }, 1200);
});
