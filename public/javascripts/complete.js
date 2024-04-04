let window_onpopstate = event => {
  history.pushState(null, null, null);
};

let document_onready = event => {
  history.pushState(null, null, null);
  window.addEventListener("popstate", window_onpopstate);
};

document.addEventListener("DOMContentLoaded", document_onready);    