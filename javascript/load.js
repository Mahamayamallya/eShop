// function loadHTML(elementId, filePath) {
//   console.log(`Element with ID "${elementId}" not found.`);
//   fetch(filePath)
//     .then((response) => response.text())
//     .then((data) => {
//       document.getElementById(elementId).innerHTML = data;
//     })
//     .catch((error) => console.error("Error loading the HTML file:", error));
// }

// document.addEventListener("DOMContentLoaded", function () {
//   loadHTML("header", "../html/header.html");
//   loadHTML("footer", "../html/footer.html");
//   loadHTML("topSellingProducts", "../html/topSellingProducts.html");
//   loadHTML("skincare", "../skincare.html");
//   loadHTML("shoppingBag", "../html/shoppingBag.html");
//   loadHTML("order-summary", "../html/order-summary.html");
// });
function loadHTML(elementId, filePath) {
  fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = data;
      } else {
        console.warn(`Element with ID "${elementId}" not found.`);
      }
    })
    .catch((error) => console.error("Error loading the HTML file:", error));
}

document.addEventListener("DOMContentLoaded", function () {
  loadHTML("header", "../html/header.html");
  loadHTML("footer", "../html/footer.html");
  loadHTML("topSellingProducts", "../html/topSellingProducts.html");
  loadHTML("skincare", "../skincare.html");
  loadHTML("shoppingBag", "../html/shoppingBag.html");
  loadHTML("order-summary", "../html/order-summary.html");
});
