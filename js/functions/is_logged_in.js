export function is_logged_in() {
  const email = sessionStorage.getItem("email");
  if (email !== null) {
    return true;
  } else {
    // window.location.href = "/index.html";
  }
}
