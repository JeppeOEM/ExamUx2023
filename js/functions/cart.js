//***** DUPLICATE CODE FROM card_and_header() ****** //
// need to be removed but cant be done yet
export let count = {};

export async function show_current_items() {
  const cart = localStorage.getItem("cart");
  let items = JSON.parse(cart);

  count = count_items(items);
  const aside = document.querySelector("#cart");
  const filtered_list = remove_duplicates(items);

  await clone_items(filtered_list);
  update_count_html();

  const minus = document.querySelectorAll(".minus");
  const plus = document.querySelectorAll(".plus");
  minus.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const selected = event.target.closest("[id]");
      let id = selected.id;
      //remove letter that was added before the numeric id
      id = id.substring(1);
      items = decrease_item(id, "cart", count);
      count = count_items(items);
      update_count_html();
    });
  });
  plus.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const selected = event.target.closest("[id]");
      let id = selected.id;
      id = id.substring(1);
      items = increase_item(id, "cart", count);
      count = count_items(items);
      update_count_html();
    });
  });

  async function update_count_html() {
    const checkout_price = [];
    for (let key in count) {
      const { id, price } = await total_item_price(key);
      const total = count[key] * price;
      const amount = document.querySelector(`#c${key} .amount`);
      amount.innerText = count[key];
      const total_price = document.querySelector(`#c${id} .price`);
      total_price.innerText = total.toFixed(2);
      checkout_price.push(parseFloat(total));
    }
    let sum = 0;
    for (let i = 0; i < checkout_price.length; i++) {
      sum += checkout_price[i];
    }
    //toFixed = remove decimals and convert to string
    sum = sum.toFixed(2);
    document.querySelector(".checkout_price").innerText = sum;
    localStorage.setItem("checkout", sum);
  }

  async function total_item_price(item_id) {
    const response = await fetch(`https://fakestoreapi.com/products/${item_id}`);
    const item = await response.json();
    return { id: item.id, price: item.price };
  }

  async function clone_items(json) {
    const product_grid = document.querySelector("#cart");
    const template = document.querySelector(".cart_template");
    remove_elements("cart_item");

    json.forEach((obj) => {
      const clone = template.content.cloneNode(true);

      //id's must start with a letter
      clone.querySelector(".cart_item").id = "c" + obj.id;
      clone.querySelector(".cart_item").setAttribute("data-category", obj.category);
      clone.querySelector(".name").textContent = obj.title;
      clone.querySelector(".product_image").src = obj.img;
      clone.querySelector(".product_image").alt = obj.title;
      // clone.querySelector(".price").textContent = obj.price;
      clone.querySelector(".delete_item").addEventListener("click", (event) => {
        const selected = event.target.closest("[id]");
        let id = selected.id;
        id = id.substring(1);
        delete_item(id, "cart");
      });
      // clone.querySelector(".description").textContent = obj.description;
      product_grid.appendChild(clone);
    });
  }
  function remove_elements(class_name) {
    let elements = document.querySelectorAll(`.${String(class_name)}`);

    try {
      elements.forEach(function (ele) {
        ele.parentNode.removeChild(ele);
      });
    } catch {
      console.log("nothing to remove");
    }
  }
}

export function init_cart(key) {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify([]));
    "created cart", localStorage.getItem(key);
  }
}

// export function items_total(key) {
//   const items = get_cart(key);
//   const len = items.length;
//   const total = document.querySelector(".total");
//   total.innerText = len;
// }

export function add_to_cart(key, item) {
  const item_list = get_cart(key);
  item_list.push(item);
  localStorage.setItem(key, JSON.stringify(item_list));
}
export function get_cart(key) {
  const items = localStorage.getItem(key);
  return JSON.parse(items);
}

export function decrease_item(id, key, counted) {
  // the items id is is used as an key in the count object

  let items = localStorage.getItem(key);
  items = JSON.parse(items);

  let index = items.findIndex((item) => {
    item.id = parseInt(item.id);
    id = parseInt(id);

    if (item.id === id) {
      return true;
    }
    return false;
  });

  if (index !== -1) {
    if (counted[id] === 1) {
      // if one item left remove product from cart
      const product = document.querySelector(`#c${id}`);
      product.remove();
    }

    // splice(starting index, number of indexes)
    items.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(items));

    return items;
  }
}

export function increase_item(id, key) {
  let items = localStorage.getItem(key);
  items = JSON.parse(items);

  //Implicit return/statement evaluated and returned
  const item = items.find((item) => item.id === parseInt(id));

  //creates a independent/deep copy of the object
  const deep_copy = JSON.parse(JSON.stringify(item));
  //inserts copy at the start of the array
  items.unshift(deep_copy);
  items.length;
  localStorage.setItem(key, JSON.stringify(items));
  return items;
}

export function delete_item(id, key) {
  let items = localStorage.getItem(key);

  items = JSON.parse(items);

  const filtered = items.filter((item) => {
    return item.id !== parseInt(id);
  });

  const product = document.querySelector(`#c${id}`);
  product.remove();
  localStorage.setItem(key, JSON.stringify(filtered));
}

export function clear_cart() {
  localStorage.clear();
}

export function count_items(items) {
  let counts = {};
  items.forEach((item) => {
    let key = item.id;

    //if falsy, right side of ?? is returned: counts['key'] = 0+1
    //if truthy left-side of ?? is returned: counts[key] = counts[key]+1
    counts[key] = (counts[key] ?? 0) + 1;
  });

  return counts;
}
export function remove_duplicates(items) {
  let newArray = [];

  let unique = {};

  for (let i in items) {
    let title = items[i]["id"];

    // use the title as the index
    unique[title] = items[i];
  }

  for (let i in unique) {
    newArray.push(unique[i]);
  }

  return newArray;
}
