const usernameField = document.getElementById("username");
const passwordField = document.getElementById("password");
const recaptchaField = document.querySelector(".g-recaptcha");
const submitBtn = document.getElementById("submit_btn");

let count = 0;

usernameField.addEventListener("input", _ => {
  if(usernameField.value != '' && usernameField.value.match(/.+@.+\..+/)){
    count++;
  }
  if(usernameField.value != '' && passwordField.value != '' && count > 1)
    recaptchaField.classList.remove("hidden");
  else
    recaptchaField.classList.add("hidden");
});

passwordField.addEventListener("input", _ => {
  if(passwordField.value != ''){
    count++;
  }
  if(usernameField.value != '' && passwordField.value != '' && count > 1)
    recaptchaField.classList.remove("hidden");
  else
    recaptchaField.classList.add("hidden");
});

console.log(usernameField);
console.log(passwordField);
console.log(recaptchaField);
console.log(submitBtn);