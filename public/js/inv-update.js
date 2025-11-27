
const form = document.querySelector("#updateForm");
const updateBtn = document.querySelector("#updateButton");

if (form && updateBtn) {
  form.addEventListener("input", () => {
    updateBtn.disabled = false;
  });
}