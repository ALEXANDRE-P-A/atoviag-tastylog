const backBtn = document.getElementById("back_btn");
const executeBtn = document.getElementById("execute_btn");
const form = document.querySelector("form");

backBtn.addEventListener("click", event => {
  event.preventDefault();
  form.setAttribute("action", backBtn.getAttribute("data-action"));
  form.setAttribute("method", backBtn.getAttribute("data-method"));
  form.submit();
  backBtn.disabled = true;
});

executeBtn.addEventListener("click", event => {
  event.preventDefault();
  form.setAttribute("action", executeBtn.getAttribute("data-action"));
  form.setAttribute("method", executeBtn.getAttribute("data-method"));
  form.submit();
  executeBtn.disabled = true;
});