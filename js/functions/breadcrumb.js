import { get_products } from "../functions/get_products.js";

export async function breadcrumb_links(category) {
  let bread = await breadcrumb(category);
  const breadcrumb_btns = bread.querySelectorAll(".breadcrumb_btn");
  if (window.location.pathname === "/shop.html") {
    breadcrumb_btns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        sessionStorage.setItem("category", btn.dataset.filter);
        get_products(event, btn.dataset.filter);
      });
    });
  } else {
    breadcrumb_btns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        sessionStorage.setItem("category", btn.dataset.filter);
        window.location.href = "/shop.html";
      });
    });
  }
}

export async function breadcrumb(category) {
  let sub;

  if (category === "men's clothing") {
    sub = "/Men";
  } else if (category === "women's clothing") {
    sub = "/Women";
  } else if (category === "all" || category == "null") {
    category = "";
  }

  const path = document.querySelector(".breadcrumb");

  const allLink = document.createElement("button");
  allLink.classList = "breadcrumb_btn";
  allLink.innerText = "All products";
  allLink.dataset.filter = "all";

  sub ? subcategory() : no_sub_category();

  function subcategory() {
    const clothingLink = document.createElement("button");
    clothingLink.classList = "breadcrumb_btn";
    clothingLink.textContent = "/Clothing";
    clothingLink.dataset.filter = "clothing";
    const subLink = document.createElement("button");
    subLink.classList = "breadcrumb_btn";
    subLink.textContent = sub;
    subLink.dataset.filter = sub.charAt(0).toLowerCase() + category.slice(1);

    path.innerHTML = "";

    path.appendChild(allLink);
    path.appendChild(clothingLink);
    path.appendChild(subLink);
  }
  function no_sub_category() {
    path.innerHTML = "";
    path.appendChild(allLink);
    const category_link = document.createElement("button");
    category_link.dataset.filter = category.charAt(0).toLowerCase() + category.slice(1);
    category_link.classList = "breadcrumb_btn";
    category_link.textContent = ` / ${category.charAt(0).toUpperCase() + category.slice(1)}`;

    path.appendChild(category_link);
  }

  return path;
}
