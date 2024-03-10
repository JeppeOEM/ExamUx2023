document.querySelector(".register").addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(this);
  let get_email = formData.get("email");
  let get_password = formData.get("password");
  let retype_password = formData.get("retype_password");

  // let is_email_registered = email_check(email);
  // (is_email_registered);
  let is_validated = validate_credentials(get_password, get_email, retype_password);
  if (is_validated === "log_in") {
    window.location.href = "/login.html";
  } else {
    alert(is_validated);
  }
  // save_user(email, password);
});

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
    return (message = "Not valid email");
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
