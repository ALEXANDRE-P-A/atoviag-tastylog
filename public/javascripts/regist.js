var btnSubmit_onclick = function (event) {
  var $submit = $(this);
  var $form = $submit.parents("form");
  $form.attr("method", $submit.data("method"));
  $form.attr("action", $submit.data("action"));
  $form.submit();
  $submit.off().prop("disabled", true);
  $form.on("submit", false);
};

var document_onready = function (event) {
  $("input[type='submit']").on("click", btnSubmit_onclick);
};

$(document).ready(document_onready);


// const backBtn = document.getElementById("back_btn");
// const executeBtn = document.getElementById("execute_btn");
// const form = document.querySelector("form");

// backBtn.addEventListener("click", event => {
//   form.setAttribute("method", backBtn.getAttribute("data-method"));
//   form.setAttribute("action", backBtn.getAttribute("data-action"));
//   form.submit();
//   backBtn.disabled = true;
// });

// executeBtn.addEventListener("click", event => {
//   form.setAttribute("method", executeBtn.getAttribute("data-method"));
//   form.setAttribute("action", executeBtn.getAttribute("data-action"));
//   form.submit();
//   executeBtn.disabled = true;
// });