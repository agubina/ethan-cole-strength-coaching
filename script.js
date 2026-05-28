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

// Photo galleries: prev/next buttons scroll one slide (native swipe still works).
document.querySelectorAll(".gallery").forEach((gallery) => {
  const track = gallery.querySelector(".gallery-track");
  if (!track) return;
  const prev = gallery.querySelector(".gallery-prev");
  const next = gallery.querySelector(".gallery-next");
  const step = () => {
    const slide = track.querySelector(".gallery-slide");
    return slide ? slide.getBoundingClientRect().width + 16 : track.clientWidth;
  };
  const atStart = () => track.scrollLeft <= 2;
  const atEnd = () => track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  if (prev)
    prev.addEventListener("click", () => {
      // loop: from the first slide, jump to the last
      if (atStart()) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
      else track.scrollBy({ left: -step(), behavior: "smooth" });
    });
  if (next)
    next.addEventListener("click", () => {
      // loop: from the last slide, jump back to the first
      if (atEnd()) track.scrollTo({ left: 0, behavior: "smooth" });
      else track.scrollBy({ left: step(), behavior: "smooth" });
    });
});
