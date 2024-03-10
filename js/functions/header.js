export function header_selectors() {
  document.querySelector(".dropdown_user").addEventListener("click", () => {
    const element = document.querySelector(".dropdown_logout");
    element.classList.toggle("hide");
  });
  document.querySelector(".dropdown_logout").addEventListener("click", function () {
    this.classList.toggle("hide");
  });
  const burger_menu = document.querySelector(".hamburger_btn");
  const close_menu = document.querySelector(".fixed_top");
  const menu = document.querySelector(".hamburger_content");
  burger_menu.addEventListener("click", function () {
    menu.classList.toggle("showmenu");
  });
  close_menu.addEventListener("click", function () {
    // const menu = document.querySelector(".hamburger_content");
    menu.classList.toggle("showmenu");
  });

  const close_mobile_menu = document.querySelectorAll(".mobile_menu");
  close_mobile_menu.forEach((mobilemenu) => {
    mobilemenu.addEventListener("click", () => {
      menu.classList.toggle("showmenu");
    });
  });

  document.querySelector(".log_out_btn").addEventListener("click", () => {
    sessionStorage.clear();

    window.location.href = "/index.html";
  });
}
