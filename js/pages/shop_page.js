"use strict";
import { add_to_cart, show_current_items, init_cart } from "../functions/cart_and_header.js";

import { breadcrumb_links } from "../functions/breadcrumb.js";
import { is_logged_in } from "../functions/is_logged_in.js";
import { load_html } from "../html_components.js";
import { get_products, sorted_list, insert_items, get_previous_sorting } from "../functions/get_products.js";

is_logged_in();

addEventListener("DOMContentLoaded", (event) => {
  // init_cart();
  const category = sessionStorage.getItem("category");
  get_products(event, category, "load_category");
  get_previous_sorting();

  let selects = document.querySelectorAll(".select");
  selects.forEach(function (select) {
    select.addEventListener("change", function () {
      console.log(this);
      deselect(this);
      const items = JSON.parse(sessionStorage.getItem("current_items"));
      let sorted_items = sorted_list(items, select.name, parseInt(select.value));
      insert_items(sorted_items);
    });
  });
});

function deselect(current_select) {
  if (current_select.id === "price") {
    document.querySelector("#alphabetic").selectedIndex = 0;
  } else {
    document.querySelector("#price").selectedIndex = 0;
  }
}
