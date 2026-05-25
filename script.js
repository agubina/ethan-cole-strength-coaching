(function() {
  var h = document.querySelector('.site-header');
  if (!h) return;
  var s = h.style;
  s.position = 'fixed';
  s.top = '0';
  s.left = '0';
  s.right = '0';
  s.width = '100%';
  s.zIndex = '9999';
  document.body.style.paddingTop = h.offsetHeight + 'px';
})();

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

const burgerBtn = document.querySelector(".burger-btn");
const mobileNav = document.getElementById("mobile-nav");

if (burgerBtn && mobileNav) {
  burgerBtn.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    burgerBtn.setAttribute("aria-expanded", isOpen);
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      burgerBtn.setAttribute("aria-expanded", "false");
    });
  });
}
