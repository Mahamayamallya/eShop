document.addEventListener("DOMContentLoaded", function () {
  fetch("../JSON/products.json")
    .then((response) => response.json())
    .then((products) => {
      displayProducts(products);
      updateCartIcon(products);

      document.querySelectorAll(".dropdown-item").forEach((item) => {
        item.addEventListener("click", function () {
          let productsCopy = [...products];
          if (this.textContent.includes("Price Low to High")) {
            productsCopy.sort((a, b) => a.discountedPrice - b.discountedPrice);
          } else if (this.textContent.includes("Price High to Low")) {
            productsCopy.sort((a, b) => b.discountedPrice - a.discountedPrice);
          } else if (this.textContent.includes("On Sale")) {
            productsCopy = productsCopy.filter(
              (product) => product.price > product.discountedPrice
            );
          }
          displayProducts(productsCopy);
        });
      });

      if (window.location.pathname.includes("cart.html")) {
        loadCartItems(products); // Pass products to loadCartItems
      }
    })
    .catch((error) => console.error("Error loading products:", error));
});

function loadCartItems(products) {
  let shoppingBag = document.getElementById("display-cart-item");
  let cartItemsCopy = JSON.parse(localStorage.getItem("cartItems")) || [];
  alert("inside displayCart");

  if (shoppingBag) {
    alert("shoppingBag is true");
    shoppingBag.innerHTML = "";
    console.log("cartItemsCopy: ", cartItemsCopy);
    cartItemsCopy.forEach((item) => {
      let product = getProductById(item.id, products); // Pass products here
      console.log("product :", product);
      if (product) {
        let cartItem = document.createElement("div");
        cartItem.className = "row";
        cartItem.innerHTML = ` 
              <div class="col-5 p-0 text-center">
                <img src="${product.image1}" class="cart-img" alt="" />
                <p class="my-0">${product.name}</p>
                <p class="text-muted">&#8377 ${product.price}</p>
              </div>
              <div class="col-5 text-center pt-3">
                <p>${item.quantity}</p>
                <div
                  class="btn-group"
                  role="group"
                  aria-label="quantity-update"
                >
                <button type="button" class="btn btn-outline-dark">
                  -
                </button>
                <button type="button" class="btn btn-outline-dark">
                  <i class="bi bi-trash3-fill"></i>
                </button>
                <button type="button" class="btn btn-outline-dark">
                  +
                </button>
              </div>
              <div class="col-2 text-center pt-3"><p>&#8377 ${
                product.price * item.quantity
              }</p></div>`;
        shoppingBag.appendChild(cartItem);
      }
    });
  } else {
    console.warn("#display-cart-item not found");
  }

  alert("ok done");
}

function getProductById(productId, products) {
  return products.find((product) => product.id === productId);
}

function addToCart(productId) {
  let cartItemsCopy = JSON.parse(localStorage.getItem("cartItems")) || [];

  let productIndex = cartItemsCopy.findIndex((item) => item.id === productId);

  if (productIndex !== -1) {
    cartItemsCopy[productIndex].quantity += 1;
  } else {
    cartItemsCopy.push({ id: productId, quantity: 1 });
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItemsCopy));

  fetch("../JSON/products.json")
    .then((response) => response.json())
    .then((products) => {
      updateCartIcon(products);
    })
    .catch((error) => console.error("Error loading products:", error));
}

function updateCartIcon(products) {
  let cartItemsCopy = JSON.parse(localStorage.getItem("cartItems")) || [];

  let cartCount = document.getElementById("cart-count");
  let totalItems = cartItemsCopy.reduce(
    (total, item) => total + item.quantity,
    0
  );
  if (cartCount) {
    cartCount.innerText = totalItems;
  }
}
