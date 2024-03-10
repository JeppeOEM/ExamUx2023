document.querySelector(".login").addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(this);

  const email = formData.get("login_email");
  const password = formData.get("login_password");

  log_in(email, password);
});
async function log_in(email, password) {
  const response = await fetch("http://localhost:3000/users");
  const json = await response.json();

  const user = json.find((item) => item.password === String(password) && item.email === String(email));

  sessionStorage.setItem("email", user.email);
  sessionStorage.setItem("password", user.password);
  window.location.href = "/shop.html";
}
