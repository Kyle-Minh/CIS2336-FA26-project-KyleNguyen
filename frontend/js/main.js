/* =========================================================
   main.js — shared JavaScript loaded on EVERY page
   ---------------------------------------------------------
   1. Site data (menu items + center hours)
   2. Dynamic navigation menu (built from an array)
   3. Mobile menu toggle (hamburger)
   4. "Open now / Closed" status in the top bar
   5. Dynamic footer (links + hours)
   6. Hours table (Facilities & About pages)
   7. Reusable collapsible ("disclosure") buttons
   ========================================================= */

/* ---------- 1. SITE DATA ---------- */

// Every page in the menu lives here. Add or rename a page in ONE place
// and the menu updates on every page automatically.
const NAV_ITEMS = [
  { label: "Home", href: "index.html" },
  { label: "About", href: "about.html" },
  { label: "Facilities", href: "facilities.html" },
  { label: "Events", href: "events.html" },
  { label: "Services", href: "services.html" },
  { label: "FAQ", href: "faq.html" },
  { label: "References", href: "references.html" },
  { label: "Book a Room", href: "booking.html", cta: true } // shown as a button
];

// Center hours, indexed by day of the week (0 = Sunday ... 6 = Saturday).
// open/close use 24-hour time. null means closed all day.
// booking.js also uses this so room bookings stay inside open hours.
const CENTER_HOURS = [
  null,                      // Sunday — closed
  { open: 7, close: 22 },    // Monday
  { open: 7, close: 22 },    // Tuesday
  { open: 7, close: 22 },    // Wednesday
  { open: 7, close: 22 },    // Thursday
  { open: 7, close: 18 },    // Friday
  { open: 9, close: 17 }     // Saturday
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Turns 13 into "1:00 PM", 9.5 into "9:30 AM". */
function formatHour(hour) {
  const h = Math.floor(hour);
  const minutes = Math.round((hour - h) * 60);
  const suffix = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** Returns "7:00 AM – 10:00 PM" or "Closed" for a given day index. */
function hoursText(dayIndex) {
  const hours = CENTER_HOURS[dayIndex];
  return hours ? `${formatHour(hours.open)} – ${formatHour(hours.close)}` : "Closed";
}

/* ---------- 2. DYNAMIC NAVIGATION MENU ---------- */

function buildNavigation() {
  const nav = document.getElementById("site-nav");
  if (!nav) return;

  // Which file are we on? e.g. "/site/faq.html" -> "faq.html"
  // An empty value (a folder URL like "/site/") means the home page.
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  const list = document.createElement("ul");

  NAV_ITEMS.forEach((item) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.label;

    if (item.cta) link.classList.add("nav-cta");

    // Highlight the current page (styled in CSS and announced by screen readers)
    if (item.href === currentPage) {
      link.setAttribute("aria-current", "page");
    }

    li.appendChild(link);
    list.appendChild(li);
  });

  nav.innerHTML = ""; // removes the <noscript> fallback links
  nav.appendChild(list);
}

/* ---------- 3. MOBILE MENU TOGGLE ---------- */

function setupMenuToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    nav.classList.remove("is-open");
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    nav.classList.toggle("is-open", !isOpen);
  });

  // Close the menu with the Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
      toggle.focus();
    }
  });

  // Close the menu when the window grows back to desktop size
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeMenu();
  });
}

/* ---------- 4. OPEN NOW / CLOSED STATUS ---------- */

function updateOpenStatus() {
  const statusEl = document.getElementById("open-status");
  if (!statusEl) return;

  const now = new Date();
  const today = CENTER_HOURS[now.getDay()];
  const currentHour = now.getHours() + now.getMinutes() / 60;

  statusEl.classList.remove("is-open", "is-closed");

  if (today && currentHour >= today.open && currentHour < today.close) {
    statusEl.textContent = `Open now · until ${formatHour(today.close)}`;
    statusEl.classList.add("is-open");
  } else {
    statusEl.textContent = `Closed now · ${nextOpeningText(now)}`;
    statusEl.classList.add("is-closed");
  }
}

/** Finds the next time the center opens, e.g. "opens Monday 7:00 AM". */
function nextOpeningText(now) {
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const today = CENTER_HOURS[now.getDay()];

  if (today && currentHour < today.open) {
    return `opens today ${formatHour(today.open)}`;
  }

  for (let offset = 1; offset <= 7; offset++) {
    const dayIndex = (now.getDay() + offset) % 7;
    const hours = CENTER_HOURS[dayIndex];
    if (hours) {
      const dayLabel = offset === 1 ? "tomorrow" : DAY_NAMES[dayIndex];
      return `opens ${dayLabel} ${formatHour(hours.open)}`;
    }
  }
  return "see hours below";
}

/* ---------- 5. DYNAMIC FOOTER ---------- */

function buildFooter() {
  const linksEl = document.getElementById("footer-links");
  const hoursEl = document.getElementById("footer-hours");
  const yearEl = document.getElementById("footer-year");

  if (linksEl) {
    linksEl.innerHTML = NAV_ITEMS
      .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
      .join("");
  }

  if (hoursEl) {
    // Show Monday first, Sunday last
    const order = [1, 2, 3, 4, 5, 6, 0];
    hoursEl.innerHTML = order
      .map((day) => `<li><span>${DAY_NAMES[day]}</span><span>${hoursText(day)}</span></li>`)
      .join("");
  }

  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- 6. HOURS TABLE ---------- */

// Any page with <tbody id="hours-table"> gets a full hours table,
// with today's row highlighted.
function buildHoursTable() {
  const tbody = document.getElementById("hours-table");
  if (!tbody) return;

  const todayIndex = new Date().getDay();
  const order = [1, 2, 3, 4, 5, 6, 0];

  tbody.innerHTML = order
    .map((day) => {
      const isToday = day === todayIndex;
      return `
        <tr class="${isToday ? "is-today" : ""}">
          <td>${DAY_NAMES[day]}${isToday ? " (Today)" : ""}</td>
          <td>${hoursText(day)}</td>
        </tr>`;
    })
    .join("");
}

/* ---------- 7. REUSABLE COLLAPSIBLES ---------- */

// Any <button data-collapsible aria-controls="panel-id"> toggles the
// element with that id. Used by the FAQ page and the organization list.
// Panels start visible in the HTML (so content still works without
// JavaScript) and are hidden here when the page loads.
function setupCollapsibles() {
  const buttons = document.querySelectorAll("[data-collapsible]");

  buttons.forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return;

    // Start collapsed
    button.setAttribute("aria-expanded", "false");
    panel.hidden = true;

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      setCollapsible(button, !isOpen);
    });
  });
}

/** Opens (true) or closes (false) one collapsible button + its panel. */
function setCollapsible(button, open) {
  const panel = document.getElementById(button.getAttribute("aria-controls"));
  button.setAttribute("aria-expanded", String(open));
  if (panel) panel.hidden = !open;

  // Optional: swap the button text, e.g. "Learn More" <-> "Show Less"
  const openText = button.dataset.openText;
  const closedText = button.dataset.closedText;
  if (openText && closedText) {
    button.textContent = open ? openText : closedText;
  }
}

/* ---------- RUN EVERYTHING WHEN THE PAGE IS READY ---------- */

document.addEventListener("DOMContentLoaded", () => {
  buildNavigation();
  setupMenuToggle();
  updateOpenStatus();
  buildFooter();
  buildHoursTable();
  setupCollapsibles();

  // Refresh the open/closed badge every minute
  setInterval(updateOpenStatus, 60 * 1000);
});
