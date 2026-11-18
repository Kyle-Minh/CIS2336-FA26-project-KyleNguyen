/* =========================================================
   faq.js — extra features for the FAQ page
   ---------------------------------------------------------
   The basic open/close behavior for each question comes from
   setupCollapsibles() in main.js. This file adds:
     • an "Expand all / Collapse all" button
     • opening a question from the URL, e.g. faq.html#faq-3
   main.js must be loaded BEFORE this file.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll(".accordion-trigger");
  const toggleAllBtn = document.getElementById("toggle-all");

  if (toggleAllBtn) {
    toggleAllBtn.addEventListener("click", () => {
      // If any question is closed, open them all; otherwise close them all
      const anyClosed = [...triggers].some((btn) => btn.getAttribute("aria-expanded") === "false");
      triggers.forEach((btn) => setCollapsible(btn, anyClosed));
      toggleAllBtn.textContent = anyClosed ? "Collapse all" : "Expand all";
    });
  }

  // Deep link: faq.html#faq-3 opens question 3 and scrolls to it
  const hash = window.location.hash.slice(1);
  if (hash) {
    const target = document.querySelector(`.accordion-trigger[aria-controls="${hash}"]`);
    if (target) {
      setCollapsible(target, true);
      target.scrollIntoView({ block: "center" });
      target.focus();
    }
  }
});
