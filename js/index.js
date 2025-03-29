document.addEventListener("DOMContentLoaded", () => {
  const ctaButton = document.querySelector(".cta-button");

  // גלילה רכה לקטע "מי אני?"
  if (ctaButton) {
    ctaButton.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector("#about");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});
