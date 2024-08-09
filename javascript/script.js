document.addEventListener("DOMContentLoaded", function () {
  fetch("../JSON/products.json")
    .then((response) => response.json())
    .then((products) => {
      displayProducts(products);

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
    })
    .catch((error) => console.error("Error loading products:", error));
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
    cartItemsCopy[productIndex].quantity += 1;
    console.log("updated..");
  } else {
    //if the item does not exist, create a new array element.
    cartItemsCopy.push({ id: productId, quantity: 1 });
  }

  //update the local storage
  localStorage.setItem("cartItems", JSON.stringify(cartItemsCopy));

  updateCartIcon();
}

function updateCartIcon() {
  let cartItemsCopy = JSON.parse(localStorage.getItem("cartItems")) || [];

  //find the total number of products with its quantity
  // let count = cartItemsCopy.reduce((total, item) => total + item.quantity, 0);
  // document.getElementById("cart-count").innerText = count;

  let cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.innerText = cartItemsCopy.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }
}

window.addEventListener("DOMContentLoaded", updateCartIcon);

function displayCart() {
  alert("cart button clicked");
  window.location.href = "../html/cart.html";
  document.addEventListener("DOMContentLoaded", function () {
    let shoppingBag = document.getElementById("display-cart-item");
    alert("inside displayCart");
    if (shoppingBag) {
      alert("shoppingBag is true");
      let shoppingBag = document.getElementById("display-cart-item");
      let cartItemsCopy =
        JSON.stringify(localStorage.getItem("cartItems")) || [];
      console.log("hereoo");

      if (cartItemsCopy.length !== 0) {
        let cartItem = document.createElement("div");
        cartItem.className = "row";
        cartItem.innerHTML = ` 
          <div class="col-5 p-0 text-center">
            <img src="../images/dandruf-1.avif" class="cart-img" alt="" />
            <p class="my-0">Anti Dandruff Serum</p>
            <p class="text-muted">&#8377 1000</p>
          </div>
          <div class="col-5 text-center pt-3">
            <p>1</p>
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
          <div class="col-2 text-center pt-3"><p>&#8377 1000</p></div>`;

        shoppingBag.appendChild(cartItem);
      }
    } else {
      alert("false");
      console.warn("#display-cart-item not found");
    }
  });
  alert("ok done");
}
