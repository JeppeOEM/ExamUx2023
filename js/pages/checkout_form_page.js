import { load_html_checkout } from "../html_components.js";

document.addEventListener("DOMContentLoaded", () => {
  is_logged_in();
  load_html_checkout().then(() => {
    let address_confirmed;
    let billing_active;
    sum_price();
    restore_form("address_form");
    // show_html();

    const change_data = document.querySelector("#change_data");
    const saved = document.querySelector("#saved");
    const confirm_btn = document.querySelector("#confirm_btn");
    const payment_btn = document.querySelector("#payment_btn");

    change_data.addEventListener("click", (event) => {
      address_form.classList.remove("hide");
      change_data.classList.add("hide");
      document.querySelector(".btn_border").classList.add("hide");
      saved.classList.add("hide");
      confirm_btn.classList.remove("hide");
      confirm_btn.classList.add("showblock");
      payment_btn.classList.add("hide");
      address_confirmed = false;
      show_html();
    });

    address_form.addEventListener("submit", function (event) {
      const checkbox = document.querySelector(".billing_check");
      event.preventDefault();

      if (checkbox.checked) {
        const html = "<h5>Billing Address</h5><p>Same as delivery</p>";
        document.querySelector(".billing_address").innerHTML = html;
        console.log("Checkbox is checked");
      } else {
        console.log("Checkbox is not checked");
      }
      // credit_modal();
      try {
        const change_data = document.querySelector("#change_data");
        change_data.classList.toggle("showblock");
        document.querySelector(".btn_border").classList.add("showflex");
      } catch {
        console.log("could not toggle showblock on #change_data");
      }
      document.querySelector("#address_form").classList.add("hide");
      const saved = document.querySelector("#saved");
      saved.classList.remove("hide");
      address_confirmed = true;
      show_html();
      restore_radio_btn();
      get_form_data("address_form", "saved");
      //hide the confirm button and put in pay button
      document.querySelector("#confirm_btn").classList.add("hide");
      document.querySelector("#payment_btn").classList.remove("hide");
    });
    document.querySelector("#enter_payment_info").addEventListener("click", () => {
      let error = "no error";
      const credit = document.querySelector("#credit");
      const mobile_pay = document.querySelector("#mobile_pay");
      const dhl = document.querySelector("#dhl");
      const post_nord = document.querySelector("#post_nord");
      const bring = document.querySelector("#bring");

      if (dhl.checked === false && post_nord.checked === false && bring.checked === false) {
        error = "delivery provider";
      } else if (credit.checked === false && mobile_pay.checked === false) {
        error = "payment solution";
      }

      if (credit.checked && error === "no error") {
        credit_modal();
      } else if (mobile_pay.checked && error === "no error") {
        mobile_pay_modal();
      } else {
        modal_error(error);
      }

      const close_btn = document.querySelector("#close");
      console.log(close_btn);
      close_btn.addEventListener("click", (event) => {
        closeModal();
      });
    });

    console.log(localStorage.getItem("checkout"));
    document.querySelector(".checkout_price").innerText = localStorage.getItem("checkout");

    listeners();

    function restore_form(form, billing = "") {
      console.log(form);
      console.log(form.id);

      const target_form = document.querySelector(`#${form}`);
      target_form.querySelector(".email").value = sessionStorage.getItem(`email${billing}`) || "";
      target_form.querySelector(".first_name").value = sessionStorage.getItem("first_name") || "";
      target_form.querySelector(".last_name").value = sessionStorage.getItem("last_name") || "";
      target_form.querySelector(".address").value = sessionStorage.getItem("address") || "";
      target_form.querySelector(".zip").value = sessionStorage.getItem("zip") || "";
      target_form.querySelector(".city").value = sessionStorage.getItem("city") || "";
      target_form.querySelector(".mobile").value = sessionStorage.getItem("mobile") || "";
    }

    // function restore_form() {
    //   document.querySelector(".email").value = sessionStorage.getItem(`email`) || "";
    //   document.querySelector(".first_name").value = sessionStorage.getItem("first_name") || "";
    //   document.querySelector(".last_name").value = sessionStorage.getItem("last_name") || "";
    //   document.querySelector(".address").value = sessionStorage.getItem("address") || "";
    //   document.querySelector(".zip").value = sessionStorage.getItem("zip") || "";
    //   document.querySelector(".city").value = sessionStorage.getItem("city") || "";
    //   document.querySelector(".mobile").value = sessionStorage.getItem("mobile") || "";
    // }

    function show_html() {
      const show_html = document.querySelectorAll(".address_confirmed");
      const hide_html = document.querySelectorAll(".no_address");
      show_html.forEach((html) => {
        if (address_confirmed) {
          html.style.display = "block";
        } else {
          html.style.display = "none";
        }
      });

      hide_html.forEach((html) => {
        if (address_confirmed) {
          html.style.display = "none";
        } else {
          html.style.display = "block";
        }
      });
    }

    document.querySelector("#post").addEventListener("click", function (event) {
      if (event.target.type === "radio" && String(event.target.classList) === "post_form") {
        document.querySelectorAll(".post_form").forEach(function (radio) {
          radio.checked = false;
        });
        localStorage.setItem("delivery", event.target.value);
        document.querySelector(".delivery_price").innerText = event.target.value;
        sum_price();
        event.target.checked = true;
      }
    });

    document.querySelector("#pay").addEventListener("click", function (event) {
      if (event.target.type === "radio") {
        document.querySelectorAll(".pay_form").forEach(function (radio) {
          radio.checked = false;
        });

        event.target.checked = true;
      }
    });

    function sum_price() {
      let sum = parseFloat(localStorage.getItem("checkout")) + parseFloat(localStorage.getItem("delivery"));
      if (isNaN(sum)) {
        sum = 0;
      }
      document.querySelector(".sum_price").innerText = sum;
    }

    function restore_radio_btn() {
      try {
        const id = sessionStorage.getItem("radio");
        document.querySelector(`#${id}`).checked = true;
      } catch {}
    }

    function load_billing() {
      billing_active = true;
      const billing = document.querySelector(".billing");
      const form = document.createElement("form");
      const fieldset = document.querySelector(".fieldset");
      form.method = "post";
      form.id = "billing";
      let clone = fieldset.cloneNode(true);
      form.appendChild(clone);
      //remove extra cloned checkbox
      const clean = form.querySelectorAll(".billing_check");
      clean.forEach((ele) => {
        ele.remove();
      });
      clone.querySelector("legend").innerText = "Billing address";
      // sessionStorage.getItem("billing") ? form.reset() : restore_form(form, "_billing");
      billing.appendChild(form);
    }

    function hide_billing() {
      billing_active = false;
      document.querySelector("#billing").remove();
    }

    function listeners() {
      const inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        input.addEventListener("input", (event) => {
          if (event.target.type === "radio") {
            sessionStorage.setItem("radio", event.target.className);
          } else if (event.target.type === "checkbox") {
            event.target.checked ? hide_billing() : load_billing();
            sessionStorage.setItem("radio", event.target.className);
          } else if (event.target.type !== "radio" && event.target.type !== "checkbox") {
            sessionStorage.setItem(event.target.className, event.target.value);
          }
        });
      });
    }

    function get_form_data(the_form, saved_data) {
      let form = document.querySelector(`#${the_form}`);
      const email = form.querySelector(".email");
      const first_name = form.querySelector(".first_name");
      const last_name = form.querySelector(".last_name");
      const address = form.querySelector(".address");
      const zip = form.querySelector(".zip");
      const city = form.querySelector(".city");
      const mobile = form.querySelector(".mobile");

      let saved = document.querySelector(`#${saved_data}`);
      const email_saved = saved.querySelector(".email");
      const first_name_saved = saved.querySelector(".first_name");
      const last_name_saved = saved.querySelector(".last_name");
      const address_saved = saved.querySelector(".address");
      const zip_saved = saved.querySelector(".zip");
      const city_saved = saved.querySelector(".city");
      const mobile_saved = saved.querySelector(".mobile");

      email_saved.innerText = email.value;
      first_name_saved.innerText = first_name.value;
      last_name_saved.innerText = last_name.value;
      first_name_saved.innerText = first_name.value;
      address_saved.innerText = address.value;
      zip_saved.innerText = zip.value;
      city_saved.innerText = city.value;
      mobile_saved.innerText = mobile.value;
    }
  });

  function credit_modal() {
    const credit_html = `
    <form class="payment_form" method="post" id="credit_form">
      <span tabindex="0" class="h4-font" id="close">X</span>
      <legend class="h4-font">Credit card details</legend>
      <fieldset class="flex_column">
        <label for="card_number">Card Number:</label>
        <input
          type="text"
          id="card_number"
          name="card_number"
          pattern="[0-9]{16}"
          title="Enter a 16-digit card number"
          required />
        <span class="flex_horizontal">
          <span class="flex_column pad">
            <label for="expiration">Expiration Date </label>
            <input
              type="text"
              id="expiration"
              name="expiration"
              pattern="(0[1-9]|1[0-2])\/[0-9]{4}"
              title="Enter a valid expiration date in MM/YYYY format"
              placeholder="MM/YYYY"
              required />
          </span>

          <span class="flex_column">
            <label class="cvv_label" for="cvv">CVV:</label>
            <input type="text" id="cvv" name="cvv" pattern="[0-9]{3,4}" title="Enter a 3 or 4-digit CVV" required />
          </span>
        </span>
        <div class="button">
          <button id="final" class="button pay" type="submit" value="Submit">Pay</button>
        </div>
      </fieldset>
    </form>`;

    document.getElementById("modal_overlay").style.display = "flex";
    document.querySelector(".modal").innerHTML = credit_html;

    const credit_form = document.querySelector("#credit_form");
    credit_form.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log("submitted");
      success_modal();
      localStorage.clear();
    });
  }
  function mobile_pay_modal() {
    const mobile_pay_html = `
    <form class='payment_form mobilepay' method='post' id='mobile_form'>
      <span tabindex="0" class='h4-font' id='close'>
        X
      </span>
      <legend class='h4-font'>Enter mobile number</legend>
      <fieldset class='flex_column'>
        <label for='number'>Phone number:</label>
        <input type='text' id='number' name='number' pattern='[0-9]{8}' title='Enter an 8-digit phone number' required />
        <div class='button'>
          <button id="final" class='button pay' type='submit' value='Submit'>
            Pay
          </button>
        </div>
      </fieldset>
    </form>
  `;

    document.getElementById("modal_overlay").style.display = "flex";
    document.querySelector(".modal").innerHTML = mobile_pay_html;

    const mobile_form = document.querySelector("#mobile_form");
    mobile_form.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log("submitted");
      success_modal();
      localStorage.clear();
    });
  }

  function success_modal() {
    const success = ` <span tabindex="0" class="h4-font" id="close">X</span>
  <h4>Payment accepted</h4>
  <div class="return button">
    <button>Return to shop</button>
  </div>
  `;

    document.querySelector(".modal").innerHTML = success;
    document.querySelector(".return").addEventListener("click", return_to_shop);
  }

  function modal_error(error) {
    const error_modal = ` <span tabindex="0" class="h4-font" id="close">X</span>
  <h4>You must choose a ${error}</h4>
  <div class="close_modal button">
    <button>Ok</button>
  </div>
  `;
    document.getElementById("modal_overlay").style.display = "flex";
    document.querySelector(".modal").innerHTML = error_modal;
    document.querySelector(".close_modal").addEventListener("click", closeModal);
  }

  function return_to_shop() {
    localStorage.clear();
    window.location.href = "/shop.html";
  }

  function closeModal() {
    document.getElementById("modal_overlay").style.display = "none";
  }

  function submitForm(event) {
    event.preventDefault();
    alert("Form submitted!");
    closeModal();
  }
  function is_logged_in() {
    const email = sessionStorage.getItem("email");
    if (email !== null) {
      return true;
    } else {
      window.location.href = "/index.html";
    }
  }
});

//not implemented code
function remove_billing() {
  const billing = document.querySelector("#billing");
  const inputs = billing.querySelectorAll("input");
  inputs.forEach((input) => {
    input.removeEventListener("input", (event) => {
      sessionStorage.setItem(event.target.className + "_billing", event.target.value);
    });
  });
}

function billing_listeners() {
  const billing = document.querySelector("#billing");
  const inputs = billing.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("input", (event) => {
      sessionStorage.setItem(event.target.className + "_billing", event.target.value);
      sessionStorage.getItem(event.target.className + "_billing");
    });
  });
}
