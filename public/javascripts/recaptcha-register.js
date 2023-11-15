const nameField = document.getElementById("name");
const emailField = document.getElementById("newemail");
const passwordField = document.getElementById("newpassword");
const recaptchaField = document.querySelector(".g-recaptcha");
let count = 0;

console.log(nameField);
console.log(emailField);
console.log(passwordField);

nameField.addEventListener("input", _ => {
  if(nameField.value != '')
    count++;
  if(nameField.value != ''
    && emailField.value != ''
    && emailField.value.match(/.+@.+\..+/)
    && passwordField.value != '' && count > 2)
      recaptchaField.classList.remove("hidden");
  else
    recaptchaField.classList.add("hidden");
});

emailField.addEventListener("input", _ => {
  if(emailField.value != '' && emailField.value.match(/.+@.+\..+/))
    count++;
  if(nameField.value != ''
    && emailField.value != ''
    && emailField.value.match(/.+@.+\..+/)
    && passwordField.value != '' && count > 2)
      recaptchaField.classList.remove("hidden");
  else
    recaptchaField.classList.add("hidden");
});

passwordField.addEventListener("input", _ => {
  if(passwordField.value != '')
    count++;
  if(nameField.value != ''
    && emailField.value != ''
    && emailField.value.match(/.+@.+\..+/)
    && passwordField.value != '' && count > 2)
      recaptchaField.classList.remove("hidden");
  else
    recaptchaField.classList.add("hidden");
});