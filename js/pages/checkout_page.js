"use strict";
import { show_current_items } from "../functions/cart.js";
import { is_logged_in } from "../functions/is_logged_in.js";
import { focused_element } from "../functions/accesability.js";
import { header_selectors } from "../functions/header.js";
// import "../cart.js";
import { load_html_checkout } from "../html_components.js";

is_logged_in();
document.addEventListener("DOMContentLoaded", function () {
  load_html_checkout().then(() => {
    show_current_items();
    focused_element();
    header_selectors();

  });
});
