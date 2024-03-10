export async function load_html() {
  return Promise.all([
    fetch("header.html").then((response) => response.text()),
    fetch("footer.html").then((response) => response.text()),
    fetch("cart.html").then((response) => response.text()),
  ]).then(([header_html, footer_html, cart_html]) => {
    document.getElementById("header").innerHTML = header_html;
    document.getElementById("footer").innerHTML = footer_html;
    document.getElementById("cart").innerHTML = cart_html;
  });
}

export async function load_html_checkout() {
  return Promise.all([
    fetch("header.html").then((response) => response.text()),
    fetch("footer.html").then((response) => response.text()),
  ]).then(([header_html, footer_html]) => {
    document.getElementById("header").innerHTML = header_html;
    document.getElementById("footer").innerHTML = footer_html;
  });
}
