 const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsDiv = document.getElementById("cartItems");
    const paymentTotal = document.getElementById("paymentTotal");
    const payBtn = document.getElementById("payBtn");

    // Render cart items and total
    function renderCart() {
      cartItemsDiv.innerHTML = "";
      let totalPrice = 0;
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const div = document.createElement("div");
        div.className = "flex items-center justify-between gap-4 p-3 border rounded-lg";
        div.innerHTML = `
          <div class="flex items-center gap-4">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-contain rounded-lg border"/>
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

    // Pay button event
    payBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const cardName = document.getElementById("cardName").value.trim();
      const cardNumber = document.getElementById("cardNumber").value.trim();
      const expiry = document.getElementById("expiry").value.trim();
      const cvc = document.getElementById("cvc").value.trim();

      if (!cardName || !cardNumber || !expiry || !cvc) {
        alert("Please fill in all payment details.");
        return;
      }

      if (!cart || cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      alert(`Payment of ${paymentTotal.textContent} successful!`);
      localStorage.removeItem("cart");
      window.location.href = "order_complete.html";
    });