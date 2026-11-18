/* =========================================================
   booking.js — Room Booking form (5 rooms) with validation
   ---------------------------------------------------------
   main.js must be loaded first (CENTER_HOURS, DAY_NAMES, formatHour).

   How it works
   1. ROOMS lists the 5 bookable rooms. The room dropdown and the
      sidebar room cards are built from this array.
   2. Every field has a validator function that returns an error
      message, or "" when the value is valid.
   3. Fields are checked when the user leaves them (blur), re-checked
      as they type once they have an error, and all checked on submit.
   4. checkAvailability() checks the room against existing bookings.
      For now the bookings live in this file. In the Node.js phase,
      only the inside of checkAvailability() changes: it will send a
      fetch() request to the server instead.
   ========================================================= */

/* ---------- 1. ROOM DATA ---------- */

const ROOMS = [
  { id: "study-a", name: "Study Room A", capacity: 4, features: "Whiteboard · Wall display" },
  { id: "study-b", name: "Study Room B", capacity: 4, features: "Whiteboard · Quiet zone" },
  { id: "collab-1", name: "Collaboration Room 1", capacity: 8, features: "75\" display · Video calls" },
  { id: "collab-2", name: "Collaboration Room 2", capacity: 8, features: "Writable walls · Video calls" },
  { id: "media", name: "Media & Presentation Room", capacity: 12, features: "Projector · Mic · Recording kit" }
];

const MAX_DAYS_AHEAD = 30; // bookings can be made up to 30 days in advance
const DURATIONS = [1, 1.5, 2, 3]; // hours

/* ---------- 2. SAMPLE EXISTING BOOKINGS ---------- */

// Fake bookings so the availability check has something to find.
// They are created relative to today so the demo always works.
const bookings = createSampleBookings();

function createSampleBookings() {
  const samples = [];
  const pattern = [
    { roomId: "study-a", start: 10, end: 12 },
    { roomId: "collab-1", start: 13, end: 15 },
    { roomId: "media", start: 9, end: 11 },
    { roomId: "study-b", start: 15, end: 17 },
    { roomId: "collab-2", start: 11, end: 13 }
  ];

  let added = 0;
  for (let offset = 1; offset <= 10 && added < pattern.length; offset++) {
    const day = addDays(startOfDay(new Date()), offset);
    const hours = CENTER_HOURS[day.getDay()];
    if (!hours) continue; // skip days the center is closed

    const p = pattern[added];
    // Only keep sample bookings that fit inside that day's hours
    if (p.start >= hours.open && p.end <= hours.close) {
      samples.push({ roomId: p.roomId, date: toISODate(day), start: p.start, end: p.end });
    }
    added++;
  }
  return samples;
}

/* ---------- 3. AVAILABILITY CHECK (backend later) ---------- */

/**
 * Checks if a room is free for a time range.
 * Returns a Promise so the code that calls it will NOT need to change
 * when this becomes a real server request in the Node.js phase:
 *
 *   const res = await fetch(`/api/availability?room=${roomId}&date=${date}&start=${start}&end=${end}`);
 *   return res.json();
 */
async function checkAvailability(roomId, date, start, end) {
  const conflict = bookings.find(
    (b) => b.roomId === roomId && b.date === date && start < b.end && end > b.start // time ranges overlap
  );
  return { available: !conflict, conflict: conflict || null };
}

/* ---------- 4. DATE HELPERS ---------- */

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

/** Date -> "YYYY-MM-DD" using local time (not UTC). */
function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** "YYYY-MM-DD" -> Date at local midnight. */
function fromISODate(value) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function prettyDate(value) {
  return fromISODate(value).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function getRoom(id) {
  return ROOMS.find((room) => room.id === id);
}

/* ---------- 5. VALIDATION RULES ---------- */
// Each validator gets the field's value and returns an error message,
// or an empty string when the value is valid.

const validators = {
  fullName(value) {
    const name = value.trim();
    if (name === "") return "Please enter your full name.";
    if (name.length < 2) return "Name must be at least 2 characters.";
    if (!/^[A-Za-z][A-Za-z .'-]*$/.test(name)) return "Use letters, spaces, apostrophes or hyphens only.";
    if (!name.includes(" ")) return "Please enter your first and last name.";
    return "";
  },

  email(value) {
    const email = value.trim();
    if (email === "") return "Please enter your UH email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address, like jdoe@cougarnet.uh.edu.";
    if (!/@(cougarnet\.)?uh\.edu$/i.test(email)) return "Use your UH email (ending in @cougarnet.uh.edu or @uh.edu).";
    return "";
  },

  uhId(value) {
    const id = value.trim();
    if (id === "") return "Please enter your 7-digit UH ID.";
    if (!/^\d{7}$/.test(id)) return "Your UH ID must be exactly 7 digits (numbers only).";
    return "";
  },

  room(value) {
    return value === "" ? "Please choose a room." : "";
  },

  date(value) {
    if (value === "") return "Please choose a date.";
    const chosen = fromISODate(value);
    const today = startOfDay(new Date());
    if (chosen < today) return "The date cannot be in the past.";
    if (chosen > addDays(today, MAX_DAYS_AHEAD)) return `You can book up to ${MAX_DAYS_AHEAD} days in advance.`;
    if (!CENTER_HOURS[chosen.getDay()]) return `The center is closed on ${DAY_NAMES[chosen.getDay()]}s. Please pick another day.`;
    return "";
  },

  startTime(value) {
    if (value === "") return "Please choose a start time.";
    const dateValue = form.date.value;
    if (dateValue === toISODate(new Date())) {
      const now = new Date();
      if (Number(value) <= now.getHours() + now.getMinutes() / 60) return "That time has already passed today.";
    }
    return "";
  },

  duration(value) {
    if (value === "") return "Please choose how long you need the room.";
    const start = Number(form.startTime.value);
    const dateValue = form.date.value;
    if (form.startTime.value !== "" && dateValue !== "") {
      const hours = CENTER_HOURS[fromISODate(dateValue).getDay()];
      if (hours && start + Number(value) > hours.close) {
        return `This booking would end after closing time (${formatHour(hours.close)}). Choose a shorter time or earlier start.`;
      }
    }
    return "";
  },

  groupSize(value) {
    if (value.trim() === "") return "Please enter how many people will attend.";
    const size = Number(value);
    if (!Number.isInteger(size) || size < 1) return "Group size must be a whole number of at least 1.";
    const room = getRoom(form.room.value);
    if (room && size > room.capacity) return `${room.name} holds up to ${room.capacity} people. Choose a larger room or a smaller group.`;
    return "";
  },

  purpose(value) {
    if (value.length > 200) return "Please keep the purpose under 200 characters.";
    return "";
  },

  agree(_value, field) {
    return field.checked ? "" : "Please agree to the booking policies.";
  }
};

/* ---------- 6. SHOWING / CLEARING ERRORS ---------- */

let form; // set when the page loads

/** Validates one field, shows/hides its error and returns true if valid. */
function validateField(field) {
  const validator = validators[field.name];
  if (!validator) return true;

  const message = validator(field.value, field);
  const group = field.closest(".form-group");
  const errorEl = document.getElementById(`${field.name}-error`);

  if (errorEl) errorEl.textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");

  if (group) {
    group.classList.toggle("has-error", Boolean(message));
    // Only show the green "valid" border on fields that have a value
    group.classList.toggle("is-valid", !message && field.type !== "checkbox" && field.value.trim() !== "");
  }
  return message === "";
}

/** Shows a list of all errors at the top of the form with links to each field. */
function showErrorSummary(invalidFields) {
  const summary = document.getElementById("error-summary");
  const list = summary.querySelector("ul");

  list.innerHTML = invalidFields
    .map((field) => {
      const message = document.getElementById(`${field.name}-error`).textContent;
      return `<li><a href="#${field.id}">${message}</a></li>`;
    })
    .join("");

  summary.hidden = false;
  summary.focus();
}

function hideErrorSummary() {
  document.getElementById("error-summary").hidden = true;
}

/* ---------- 7. BUILDING DYNAMIC PARTS OF THE FORM ---------- */

function buildRoomOptions() {
  ROOMS.forEach((room) => {
    form.room.add(new Option(`${room.name} (up to ${room.capacity})`, room.id));
  });
}

function buildRoomCards() {
  const list = document.getElementById("room-list");
  list.innerHTML = ROOMS.map(
    (room) => `
      <div class="room-card" data-room="${room.id}">
        <h3>${room.name}</h3>
        <p>👥 Up to ${room.capacity} people</p>
        <p>${room.features}</p>
      </div>`
  ).join("");
}

function highlightSelectedRoom() {
  document.querySelectorAll(".room-card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.room === form.room.value);
  });
}

function buildDurationOptions() {
  DURATIONS.forEach((hours) => {
    const label = hours === 1 ? "1 hour" : `${hours} hours`;
    form.duration.add(new Option(label, hours));
  });
}

/** Rebuilds the start-time list based on the open hours of the chosen date. */
function buildStartTimes() {
  const select = form.startTime;
  const previous = select.value;
  select.innerHTML = "";

  const dateValue = form.date.value;
  const hours = dateValue ? CENTER_HOURS[fromISODate(dateValue).getDay()] : null;

  if (!dateValue) {
    select.add(new Option("Choose a date first", ""));
    select.disabled = true;
    return;
  }

  if (!hours) {
    select.add(new Option("Closed on this day", ""));
    select.disabled = true;
    return;
  }

  select.disabled = false;
  select.add(new Option("Select a start time", ""));

  // Every 30 minutes, ending at least 1 hour before closing
  for (let time = hours.open; time <= hours.close - 1; time += 0.5) {
    select.add(new Option(formatHour(time), time));
  }

  // Keep the old choice if it still exists for the new date
  if ([...select.options].some((o) => o.value === previous)) {
    select.value = previous;
  }
}

/* ---------- 8. LIVE AVAILABILITY MESSAGE ---------- */

async function updateAvailability() {
  const box = document.getElementById("availability");
  const roomId = form.room.value;
  const date = form.date.value;
  const start = form.startTime.value;
  const duration = form.duration.value;

  box.classList.remove("is-available", "is-unavailable");

  // Need all four values (and a valid date) before we can check
  if (!roomId || !date || start === "" || !duration || validators.date(date)) {
    box.textContent = "Choose a room, date, start time and length to check availability.";
    return null;
  }

  const startNum = Number(start);
  const endNum = startNum + Number(duration);
  const room = getRoom(roomId);
  const result = await checkAvailability(roomId, date, startNum, endNum);
  const range = `${formatHour(startNum)} – ${formatHour(endNum)}`;

  if (result.available) {
    box.textContent = `✓ ${room.name} is available on ${prettyDate(date)}, ${range}.`;
    box.classList.add("is-available");
  } else {
    const c = result.conflict;
    // Suggest other rooms that are free at the same time and big enough
    const alternatives = [];
    for (const other of ROOMS) {
      if (other.id === roomId) continue;
      const check = await checkAvailability(other.id, date, startNum, endNum);
      if (check.available) alternatives.push(other.name);
    }
    box.textContent =
      `✗ ${room.name} is already booked on ${prettyDate(date)} from ${formatHour(c.start)} – ${formatHour(c.end)}.` +
      (alternatives.length ? ` Available at that time: ${alternatives.join(", ")}.` : " Please try a different time.");
    box.classList.add("is-unavailable");
  }
  return result;
}

/* ---------- 9. SUBMITTING THE FORM ---------- */

async function handleSubmit(event) {
  event.preventDefault(); // stop the browser from reloading the page

  document.getElementById("booking-success").hidden = true;

  // Validate every field and collect the ones with errors
  const fields = [...form.elements].filter((el) => validators[el.name]);
  const invalid = fields.filter((field) => !validateField(field));

  if (invalid.length > 0) {
    showErrorSummary(invalid);
    return;
  }

  // All fields are valid — now make sure the room is actually free
  const result = await updateAvailability();
  if (result && !result.available) {
    const errorEl = document.getElementById("startTime-error");
    errorEl.textContent = "This room is already booked at that time. Choose another time or room.";
    form.startTime.closest(".form-group").classList.add("has-error");
    form.startTime.setAttribute("aria-invalid", "true");
    showErrorSummary([form.startTime]);
    return;
  }

  hideErrorSummary();

  // "Save" the booking (in memory for now — the server will store it later)
  const start = Number(form.startTime.value);
  const end = start + Number(form.duration.value);
  const booking = {
    roomId: form.room.value,
    date: form.date.value,
    start,
    end
  };
  bookings.push(booking);

  showSuccess(booking);
  form.reset(); // clears the fields; the "reset" listener tidies up the rest
}

function showSuccess(booking) {
  const success = document.getElementById("booking-success");
  const room = getRoom(booking.roomId);
  const confirmation = `SL-${Math.floor(10000 + Math.random() * 90000)}`;

  success.innerHTML = `
    <h2>Booking request received!</h2>
    <p>A confirmation will be sent to <strong>${escapeHTML(form.email.value.trim())}</strong>.</p>
    <dl>
      <dt>Confirmation #</dt><dd>${confirmation}</dd>
      <dt>Name</dt><dd>${escapeHTML(form.fullName.value.trim())}</dd>
      <dt>Room</dt><dd>${room.name}</dd>
      <dt>Date</dt><dd>${prettyDate(booking.date)}</dd>
      <dt>Time</dt><dd>${formatHour(booking.start)} – ${formatHour(booking.end)}</dd>
      <dt>Group size</dt><dd>${Number(form.groupSize.value)}</dd>
    </dl>`;
  success.hidden = false;
  success.focus();
}

/** Prevents user text from being treated as HTML when we display it. */
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/** Removes error/valid styling and rebuilds the dynamic parts after a reset. */
function clearFormState() {
  form.querySelectorAll(".form-group").forEach((g) => g.classList.remove("has-error", "is-valid"));
  form.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""));
  form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
  buildStartTimes();
  highlightSelectedRoom();
  updateCharCount();
  updateAvailability();
}

function updateCharCount() {
  document.getElementById("purpose-count").textContent = `${form.purpose.value.length} / 200`;
}

/* ---------- 10. SETUP ---------- */

document.addEventListener("DOMContentLoaded", () => {
  form = document.getElementById("booking-form");
  if (!form) return;

  // Limit the date picker to today ... 30 days from now
  const today = startOfDay(new Date());
  form.date.min = toISODate(today);
  form.date.max = toISODate(addDays(today, MAX_DAYS_AHEAD));

  buildRoomOptions();
  buildRoomCards();
  buildDurationOptions();
  buildStartTimes();
  updateAvailability();

  // Check a field when the user leaves it...
  form.addEventListener("focusout", (e) => {
    if (validators[e.target.name]) validateField(e.target);
  });

  // ...and re-check while typing if it already shows an error
  form.addEventListener("input", (e) => {
    const group = e.target.closest(".form-group");
    if (group && group.classList.contains("has-error")) validateField(e.target);
    if (e.target.name === "purpose") updateCharCount();
  });

  form.addEventListener("change", (e) => {
    const name = e.target.name;

    if (name === "date") {
      buildStartTimes();
      if (form.startTime.value !== "") validateField(form.startTime);
    }
    if (name === "room") {
      highlightSelectedRoom();
      if (form.groupSize.value) validateField(form.groupSize); // capacity depends on room
    }
    if ((name === "startTime" || name === "date") && form.duration.value) {
      validateField(form.duration); // closing-time check depends on start time
    }
    if (["room", "date", "startTime", "duration"].includes(name)) {
      updateAvailability();
    }
    if (e.target.type === "checkbox") validateField(e.target);
  });

  // Clicking a room card selects that room in the dropdown
  document.getElementById("room-list").addEventListener("click", (e) => {
    const card = e.target.closest(".room-card");
    if (!card) return;
    form.room.value = card.dataset.room;
    form.room.dispatchEvent(new Event("change", { bubbles: true }));
    validateField(form.room);
  });

  form.addEventListener("submit", handleSubmit);

  form.addEventListener("reset", () => {
    // Wait until the browser has cleared the fields, then tidy up
    setTimeout(() => {
      hideErrorSummary();
      clearFormState();
    }, 0);
  });
});
