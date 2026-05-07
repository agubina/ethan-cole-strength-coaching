const forms = document.querySelectorAll("form");

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    const originalText = button ? button.textContent : "Submitted";

    if (button) {
      button.textContent = "Sent";
      button.disabled = true;
    }

    setTimeout(() => {
      if (button) {
        button.textContent = originalText;
        button.disabled = false;
      }
      form.reset();
    }, 1600);
  });
});
