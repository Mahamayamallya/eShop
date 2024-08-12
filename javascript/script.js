document.addEventListener("DOMContentLoaded", function () {
  fetch("../JSON/products.json")
    .then((response) => response.json())
    .then((products) => {
      displayProducts(products);

      // const form = document.getElementById("search-form");
      // const searchQuery = document
      //   .getElementById("search-input")
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
            productsCopy.sort(
              (a, b) =>
                [a.price - (a.price * a.discountPercentage) / 100] -
                [b.price - (b.price * b.discountPercentage) / 100]
            );
          } else if (this.textContent.includes("Price High to Low")) {
            productsCopy.sort(
              (a, b) =>
                [b.price - (b.price * b.discountPercentage) / 100] -
                [a.price - (a.price * a.discountPercentage) / 100]
            );
          } else if (this.textContent.includes("On Sale")) {
            productsCopy = productsCopy.filter(
              (product) => product.discountPercentage !== 0
            );
          } else if (this.textContent.includes("Ratings")) {
            productsCopy = productsCopy.sort((a, b) => b.rating - a.rating);
          } else if (this.textContent.includes("Rating-Above 4")) {
            productsCopy = productsCopy.filter(
              (product) => product.rating >= 4
            );
          } else if (this.textContent.includes("Rating-Above 3")) {
            productsCopy = productsCopy.filter(
              (product) => product.rating >= 3
            );
          } else if (this.textContent.includes("Rating-5")) {
            productsCopy = productsCopy.filter(
              (product) => product.rating === 5
            );
          }

          displayProducts(productsCopy);
        });
      });
      if (window.location.pathname.includes("cart.html")) {
        loadCartItems(products);
        updateOrderSummary(products);
      }
      if (window.location.pathname.includes("shop.html")) {
        searchProducts();
      }
    })
    .catch((error) => console.error("Error loading products:", error));
});
// function sayhi() {
//   alert("hi");
//   let key = document.getElementById("input-search").value;
//   alert(key);
// }
function viewShop() {
  window.location.href = "shop.html";
}
function searchProducts() {
  console.log("iiiiiiiiiiiiiiiiiiii");
  let filteredProducts =
    JSON.parse(localStorage.getItem("filteredProducts")) || [];
  const searchInput = document
    .getElementById("input-search")
    .value.toLowerCase();
  console.log("hi", searchInput);
  // alert(searchInput);
  fetch("../JSON/products.json")
    .then((response) => response.json())
    .then((products) => {
      filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchInput)
      );
      localStorage.setItem(
        "filteredProducts",
        JSON.stringify(filteredProducts)
      );
      console.log(filteredProducts);
      displayProducts(filteredProducts);
    })
    .catch((error) => console.error("Error searching products:", error));
}

// document.addEventListener("DOMContentLoaded", function () {
//   const form = document.getElementById("search-form");
//   const searchQuery = document
//     .getElementById("search-input")
//     .value.toLowerCase();
//   form.addEventListener("submit", function (event) {
//     event.preventDefault();
//     console.log(searchQuery);

//     fetch("../JSON/products.json")
//       .then((response) => response.json())
//       .then((products) => {
//         const filteredProducts = products.filter((product) =>
//           product.name.toLowerCase().includes(searchInput)
//         );

//         displayProducts(filteredProducts);
//       })
//       .catch((error) => console.error("Error searching products:", error));
//   });
// });

function displayProducts(productsCopy) {
  // const searchProducts = JSON.parse(localStorage.getItem("filteredProducts"));
  // console.log("searchProducts : ", searchProducts);

  // if (searchProducts && searchProducts > 0) {
  //   alert(searchProducts[0].name);
  // }
  console.log("productsCopy", productsCopy);
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  productsCopy.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "col-md-3";
    productCard.innerHTML = `
      <div class="card pdp-card my-5" style="width: 14rem;">
        <img src="${product.images[0]}" class="card-img-top" alt="${
      product.name
    }">
        <div class="card-body text-center">
          <h5 class="card-title my-2">${product.name}</h5>
          <div class="row">
            <div class="col"><p>&#9733 ${product.rating}</p></div> 
            <div class="col"><p><small class="discountStyle text-mute">${
              product.discountPercentage > 0 ? product.price : ""
            }</small> &#8377 ${
      product.price - (product.price * product.discountPercentage) / 100
    }</p></div>
          </div>
          <button class="add-to-cart btn btn-dark" data-id="${
            product.id
          }" onclick ="addToCart(${product.id})">Add to Cart</button>
          <p class="add-to-cart-msg"></p>
        </div>
      </div>
    `; //TODO: Update ratings

    productList.appendChild(productCard);
    //console.log("hiiiiooou");
  });
}

function checkout() {
  window.location.href = "../html/checkout.html";
}

function addToCart(productId) {
  let cartItemsCopy = JSON.parse(localStorage.getItem("cartItems")) || []; //get hold of cartItems or initialize it

  let productIndex = cartItemsCopy.findIndex((item) => item.id === productId);
  const button = event.target;
  const productCard = button.closest(".card");
  const addToCartMsg = productCard.querySelector(".add-to-cart-msg");
  if (productIndex !== -1) {
    //if the item already exists, then update its quantity.
    console.log("updating +1..");
    console.log(cartItemsCopy[productIndex].quantity);
    cartItemsCopy[productIndex].quantity += 1;
    console.log("updated..");
    console.log(cartItemsCopy);
    addToCartMsg.textContent = "Added to cart!";
    setTimeout(() => {
      addToCartMsg.textContent = "";
    }, 1000);
  } else {
    //if the item does not exist, create a new array element.
    cartItemsCopy.push({ id: productId, quantity: 1 });
    addToCartMsg.textContent = "Added to cart!";
    setTimeout(() => {
      addToCartMsg.textContent = "";
    }, 1000);
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
