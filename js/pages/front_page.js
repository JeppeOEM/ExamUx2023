

document.addEventListener("DOMContentLoaded", () => {
  //clear session category when logging in again
  sessionStorage.setItem("category", "all");
  document.querySelector("#register_form").addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    let get_email = formData.get("email");
    let get_password = formData.get("password");
    let retype_password = formData.get("retype_password");

    let is_validated = validate_credentials(get_password, get_email, retype_password);
    if (is_validated === "log_in") {
      alert("Successfully registered");
      save_user(get_email, get_password);
    } else {
      alert(is_validated);
    }

  });
  const register = document.querySelector(".register_btn");
  register.addEventListener("click", (event) => {
    document.querySelector("#login").classList.add("hide");
    document.querySelector("#register").classList.remove("hide");
  });

  const login = document.querySelector(".login_btn");
  login.addEventListener("click", (event) => {
    document.querySelector("#register").classList.add("hide");
    document.querySelector("#login").classList.remove("hide");
  });

  document.querySelector("#login_form").addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    console.log(formData);

    const email = formData.get("login_email");
    const password = formData.get("login_password");

    log_in(email, password);
  });
  async function log_in(email, password) {
    const response = await fetch("http://localhost:3000/users");
    const json = await response.json();
    const user = json.find((item) => item.password === String(password) && item.email === String(email));
    if (user) {
      sessionStorage.setItem("email", user.email);
      sessionStorage.setItem("password", user.password);
      window.location.href = "/shop.html";
    } else {
      alert("wrong password");
    }
  }
});

function register_btns() {
  document.querySelector("#login").classList.add("hide");
  document.querySelector(".login_text").classList.add("hide");
  document.querySelector("#register").classList.remove("hide");
  document.querySelector(".register_text").classList.remove("hide");
}

async function email_check(mail) {
  let response = await fetch(`http://localhost:3000/users?email=${mail}`);
  let json = await response.json();
}

function validate_credentials(password, email, retyped_password) {
  // search executes reges and returns first match in the string.
  const re_special_chars = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/;
  const re_lower_case = /[a-z]/;
  const re_upper_case = /[A-Z]/;
  const re_digit = /[0-9]/;
  const re_email =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let message;
  if (!re_email.test(email)) {
    return (message = "Not a valid email");
  }
  if (password != retyped_password) {
    return (message = "Passwords are not the same");
  }
  if (password.length < 8) {
    return (message = "Password is too short");
  } else if (!re_lower_case.test(password)) {
    return (message = "Password must contain at least one lowercase letter");
  } else if (!re_upper_case.test(password)) {
    return (message = "Password must contain at least one uppercase letter");
  } else if (!re_digit.test(password)) {
    return (message = "Password must contain at least one number");
  } else if (!re_special_chars.test(password)) {
    return (message = "Password must contain at least one special character");
  } else {
    return (message = "log_in");
  }
}
async function save_user(email, password) {
  const data = {
    email: email,
    password: password,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  try {
    const response = await fetch("http://localhost:3000/users", options);
    response = await response.status();
  } catch (error) {
    console.log(error);
  }
}

async function login(email, password) {
  const response = await fetch("http://localhost:3000/users");
  const login = await response.json();
}

function log_out() {
  sessionStorage.clear();
}
