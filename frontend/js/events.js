/* =========================================================
   events.js — Events page + Home page "Upcoming Events"
   ---------------------------------------------------------
   Needs events-data.js to be loaded first (it defines EVENTS).
   Features:
     • Search by event name, description, location or category
     • Filter by category and by month
     • "Load More" button (shows events 4 at a time)
     • "View Event" button that expands each card's details
     • Home page preview of the next 3 upcoming events
   ========================================================= */

const PAGE_SIZE = 4;          // how many events to show per "page"
let visibleCount = PAGE_SIZE; // how many are currently showing

/* ---------- Date helpers ---------- */

/** "2026-12-04" -> Date object at local midnight (avoids time-zone shifts). */
function parseDate(isoString) {
  const [year, month, day] = isoString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Today's date at midnight, used to decide if an event is in the past. */
function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function isPast(event) {
  return parseDate(event.date) < startOfToday();
}

/** Builds the red date "badge" shown on each event card. */
function dateBadge(event) {
  const date = parseDate(event.date);
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  return `
    <div class="event-date" aria-hidden="true">
      <span class="month">${month}</span>
      <span class="day">${date.getDate()}</span>
      <span class="weekday">${weekday}</span>
    </div>`;
}

function fullDate(event) {
  return parseDate(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

/** Upcoming events first (soonest first), then past events (most recent first). */
function sortEvents(list) {
  const upcoming = list.filter((e) => !isPast(e)).sort((a, b) => parseDate(a.date) - parseDate(b.date));
  const past = list.filter(isPast).sort((a, b) => parseDate(b.date) - parseDate(a.date));
  return [...upcoming, ...past];
}

/* =========================================================
   EVENTS PAGE
   ========================================================= */

function setupEventsPage() {
  const listEl = document.getElementById("event-list");
  if (!listEl) return; // not on the Events page

  const searchInput = document.getElementById("event-search");
  const categorySelect = document.getElementById("event-category");
  const monthSelect = document.getElementById("event-month");
  const countEl = document.getElementById("results-count");
  const loadMoreBtn = document.getElementById("load-more");
  const emptyEl = document.getElementById("events-empty");
  const resetBtn = document.getElementById("reset-filters");

  fillFilterOptions(categorySelect, monthSelect);

  /** Returns only the events that match the search box and both dropdowns. */
  function getFilteredEvents() {
    const term = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const month = monthSelect.value; // e.g. "2026-12"

    const matches = EVENTS.filter((event) => {
      const searchable = `${event.title} ${event.summary} ${event.location} ${event.category}`.toLowerCase();
      const matchesTerm = term === "" || searchable.includes(term);
      const matchesCategory = category === "all" || event.category === category;
      const matchesMonth = month === "all" || event.date.startsWith(month);
      return matchesTerm && matchesCategory && matchesMonth;
    });

    return sortEvents(matches);
  }

  /** Draws the event cards on the page. */
  function render() {
    const filtered = getFilteredEvents();
    const toShow = filtered.slice(0, visibleCount);

    listEl.innerHTML = toShow.map(eventCardHTML).join("");

    // Result count (announced to screen readers through aria-live)
    countEl.textContent =
      filtered.length === 0
        ? "No events found."
        : `Showing ${toShow.length} of ${filtered.length} event${filtered.length === 1 ? "" : "s"}`;

    emptyEl.hidden = filtered.length !== 0;
    loadMoreBtn.hidden = visibleCount >= filtered.length;
  }

  // Whenever a filter changes, start back at the first "page"
  function onFilterChange() {
    visibleCount = PAGE_SIZE;
    render();
  }

  searchInput.addEventListener("input", onFilterChange);
  categorySelect.addEventListener("change", onFilterChange);
  monthSelect.addEventListener("change", onFilterChange);

  // Stop the Enter key from reloading the page inside the search form
  document.getElementById("event-filters").addEventListener("submit", (e) => e.preventDefault());

  loadMoreBtn.addEventListener("click", () => {
    visibleCount += PAGE_SIZE;
    render();
  });

  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    categorySelect.value = "all";
    monthSelect.value = "all";
    onFilterChange();
    searchInput.focus();
  });

  // "View Event" buttons are created dynamically, so we listen on the
  // parent list instead of on each button ("event delegation").
  listEl.addEventListener("click", (e) => {
    const button = e.target.closest(".view-event");
    if (!button) return;

    const details = document.getElementById(button.getAttribute("aria-controls"));
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.textContent = isOpen ? "View Event" : "Hide Details";
    details.hidden = isOpen;
  });

  render();
}

/** Builds the category and month <option>s from the event data. */
function fillFilterOptions(categorySelect, monthSelect) {
  const categories = [...new Set(EVENTS.map((e) => e.category))].sort();
  categories.forEach((category) => {
    categorySelect.add(new Option(category, category));
  });

  const months = [...new Set(EVENTS.map((e) => e.date.slice(0, 7)))].sort();
  months.forEach((month) => {
    const label = parseDate(`${month}-01`).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    monthSelect.add(new Option(label, month));
  });
}

function eventCardHTML(event) {
  const past = isPast(event);
  const detailsId = `details-${event.id}`;
  return `
    <article class="event-card ${past ? "is-past" : ""}">
      ${dateBadge(event)}
      <div class="event-info">
        <span class="tag ${past ? "tag--gray" : ""}">${past ? "Past event" : event.category}</span>
        <h3>${event.title}</h3>
        <div class="event-meta">
          <span>📅 ${fullDate(event)}</span>
          <span>🕒 ${event.time}</span>
          <span>📍 ${event.location}</span>
        </div>
        <p>${event.summary}</p>
        <div class="event-details" id="${detailsId}" hidden>
          <p>${event.details}</p>
          <p><strong>Category:</strong> ${event.category}</p>
        </div>
      </div>
      <div class="event-actions">
        <button type="button" class="btn btn--outline btn--small view-event"
                aria-expanded="false" aria-controls="${detailsId}">View Event</button>
      </div>
    </article>`;
}

/* =========================================================
   HOME PAGE — next 3 upcoming events
   ========================================================= */

function setupHomeEvents() {
  const container = document.getElementById("home-events");
  if (!container) return; // not on the Home page

  let upcoming = sortEvents(EVENTS).filter((e) => !isPast(e)).slice(0, 3);

  // If every event is in the past, show the most recent ones instead
  if (upcoming.length === 0) upcoming = sortEvents(EVENTS).slice(0, 3);

  container.innerHTML = upcoming
    .map(
      (event) => `
      <article class="card mini-event">
        ${dateBadge(event)}
        <div>
          <span class="tag">${event.category}</span>
          <h3>${event.title}</h3>
          <p>${event.time} · ${event.location}</p>
        </div>
      </article>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  setupEventsPage();
  setupHomeEvents();
});
