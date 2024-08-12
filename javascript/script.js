document.addEventListener("DOMContentLoaded", function () {
  fetch("../JSON/products.json")
    .then((response) => response.json())
    .then((products) => {
      displayProducts(products);

      // const form = document.getElementById("search-form");
      // const searchQuery = document
      //   .getElementById("search-Query")
      //   .value.toLowerCase();
      // form.addEventListener("submit", function (event) {
      //   event.preventDefault();
      //   console.log(searchQuery);
      //   const filteredProducts = products.filter((product) =>
      //     product.name.toLowerCase().includes(searchQuery)
      //   );
      //   displayProducts(filteredProducts);
      // });

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
        loadCartItems(products);
        updateOrderSummary(products);
      }
    })
    .catch((error) => console.error("Error loading products:", error));
});

// function searchProducts() {
//   console.log("searchProducts()");
//   const searchInput = document
//     .getElementById("search-input")
//     .value.toLowerCase();
//   console.log("hi", searchInput);

//   fetch("../JSON/products.json")
//     .then((response) => response.json())
//     .then((products) => {
//       const filteredProducts = products.filter((product) =>
//         product.name.toLowerCase().includes(searchInput)
//       );

//       displayProducts(filteredProducts);
//     })
//     .catch((error) => console.error("Error searching products:", error));
// }

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("search-form");
  const searchQuery = document
    .getElementById("search-input")
    .value.toLowerCase();
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log(searchQuery);

    fetch("../JSON/products.json")
      .then((response) => response.json())
      .then((products) => {
        const filteredProducts = products.filter((product) =>
          product.name.toLowerCase().includes(searchInput)
        );

        displayProducts(filteredProducts);
      })
      .catch((error) => console.error("Error searching products:", error));
  });
});

function displayProducts(productsCopy) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  productsCopy.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "col-md-3";
    productCard.innerHTML = `
      <div class="card pdp-card my-5" style="width: 14rem;">
        <img src="${product.image1}" class="card-img-top" alt="${product.name}">
        <div class="card-body text-center">
          <h5 class="card-title my-2">${product.name}</h5>
          <div class="row">
            <div class="col"><p>&#9733 ${product.rating}/5</p></div>
            <div class="col"><p>&#8377 ${product.discountedPrice}</p></div>
          </div>
          <button class="add-to-cart btn btn-dark" data-id="${product.id}" onclick ="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    `;
    productList.appendChild(productCard);
  });
}

function checkout() {
  window.location.href = "checkout.html";
}

function addToCart(productId) {
  let cartItemsCopy = JSON.parse(localStorage.getItem("cartItems")) || []; //get hold of cartItems or initialize it

  let productIndex = cartItemsCopy.findIndex((item) => item.id === productId);

  if (productIndex !== -1) {
    //if the item already exists, then update its quantity.
    console.log("updating +1..");
    console.log(cartItemsCopy[productIndex].quantity);
    cartItemsCopy[productIndex].quantity += 1;
    console.log("updated..");
    console.log(cartItemsCopy);
  } else {
    //if the item does not exist, create a new array element.
    cartItemsCopy.push({ id: productId, quantity: 1 });
  }

  //update the local storage
  localStorage.setItem("cartItems", JSON.stringify(cartItemsCopy));

  fetch("../JSON/products.json")
    .then((response) => response.json())
    .then((products) => {
      updateCartIcon(products);
      loadCartItems(products);
      updateOrderSummary(products);
    })
    .catch((error) =>
      console.error(
        "Error loading products while calling updateCartIcon(products):",
        error
      )
    );
}

function updateCartIcon(products) {
  let cartItemsCopy = JSON.parse(localStorage.getItem("cartItems")) || [];

  //find the total number of products with its quantity
  let cartCount = document.getElementById("cart-count");
  let totalItems = cartItemsCopy.reduce(
    (total, item) => total + item.quantity,
    0
  );
  if (cartCount) {
    cartCount.innerText = totalItems;
  }
}

window.addEventListener("DOMContentLoaded", function () {
  fetch("../JSON/products.json")
    .then((response) => response.json())
    .then((products) => {
      updateCartIcon(products);
      loadCartItems(products);
      updateOrderSummary(products);
    })
    .catch((error) =>
      console.error(
        "Error loading products while calling updateCartIcon(products):",
        error
      )
    );
});

function loadCartItems(products) {
  let shoppingBag = document.getElementById("display-cart-item");
  let cartItemsCopy = JSON.parse(localStorage.getItem("cartItems")) || [];

  if (shoppingBag) {
    shoppingBag.innerHTML = "";
    console.log("cartItemsCopy: ", cartItemsCopy);
    cartItemsCopy.forEach((item) => {
      let product = getProductByID(item.id, products);
      console.log("product :", product);
      let quantity = item.quantity;
      let itemTotal = product.price * quantity;
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
              <p>${quantity}</p>
              <div
                class="btn-group"
                role="group"
                aria-label="quantity-update"
              >
              <button type="button" class="btn btn-outline-dark" onclick="updateCartItem(${product.id}, -1)">
                -
              </button>
              <button type="button" class="btn btn-outline-dark" onclick="updateCartItem(${product.id}, 0)">
                <i class="bi bi-trash3-fill"></i>
              </button>
              <button type="button" class="btn btn-outline-dark" onclick="updateCartItem(${product.id}, 1)">
                +
              </button>
            </div>
            </div>
            <div class="col-2 text-center pt-3"><p>&#8377 ${itemTotal}</p></div>`;
        shoppingBag.appendChild(cartItem);
      }
    });
  } else {
    console.warn("#display-cart-item not found");
  }
}
function updateCartItem(productId, action) {
  let cartItemsCopy = JSON.parse(localStorage.getItem("cartItems")) || [];
  let productIndex = cartItemsCopy.findIndex(
    (cartItem) => cartItem.id === productId
  );

  if (productIndex !== -1 && action === 1) {
    cartItemsCopy[productIndex].quantity += 1;
  }
  if (productIndex !== -1 && action === -1) {
    cartItemsCopy[productIndex].quantity -= 1;
    if (cartItemsCopy[productIndex].quantity === 0) {
      cartItemsCopy.splice(productIndex, 1);
    }
  }
  if (productIndex !== -1 && action === 0) {
    cartItemsCopy.splice(productIndex, 1);
    updateCartIcon();
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItemsCopy));

  fetch("../JSON/products.json")
    .then((response) => response.json())
    .then((products) => {
      updateCartIcon(products);
      loadCartItems(products);
      updateOrderSummary(products);
    })
    .catch((error) =>
      console.error(
        "Error loading products while calling updateCartItem(products):",
        error
      )
    );
}
function displayCart() {
  window.location.href = "../html/cart.html";
}

function getProductByID(productId, products) {
  return products.find((product) => product.id === productId);
}
function updateOrderSummary(products) {
  let cartItemsCopy = JSON.parse(localStorage.getItem("cartItems")) || [];

  let subTotal = document.getElementById("sub-total");
  let shippingCharge = document.getElementById("shipping-charge");
  let tax = document.getElementById("tax");
  let grandTotal = document.getElementById("grand-total");

  let subtotal = 0;
  let shippingcharge = 100;
  let tax_;

  // cartItemsCopy.map((item) => {
  //   for (let i = 0; i < products.length; i++) {
  //     if (item.id === products[i]["id"]) {
  //       subtotal = subtotal + products[i]["price"];
  //     }
  //   }
  // });
  cartItemsCopy.forEach((item) => {
    const product = products.find((product) => product.id === item.id);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });

  tax_ = subtotal * 0.1;
  const grandtotal = subtotal + shippingcharge + tax_;
  if (subTotal) subTotal.innerText = `₹${subtotal.toFixed(2)}`;
  if (shippingCharge)
    shippingCharge.innerText = `₹${shippingcharge.toFixed(2)}`;
  if (tax) tax.innerText = `₹${tax_.toFixed(2)}`;
  if (grandTotal) grandTotal.innerText = `₹${grandtotal.toFixed(2)}`;
}
