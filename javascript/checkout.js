document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("checkout-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const contact = document.getElementById("contact").value.trim();

    const nameError = document.getElementById("name-error");
    const addressError = document.getElementById("address-error");
    const contactError = document.getElementById("contact-error");

    nameError.textContent = "";
    addressError.textContent = "";
    contactError.textContent = "";

    if (name === "") {
      nameError.textContent = "Please enter name";
      isValid = false;
    }

    if (address.length <= 10) {
      //TODO: postal code- India format.
      isValid = false;
      addressError.textContent = "Enter complete address";
    }
    const contactPattern = /^[0-9]{10}$/;
    if (!contactPattern.test(contact)) {
      isValid = false;
      contactError.textContent = "Enter exact 10digit contact number";
    }

    if (isValid) {
      alert("ORDER PLACED"); //TODO: payment COD checkbox, new popup window for "ORDER PLACED"
      window.location.href = "index.html";
    }
  });
});
