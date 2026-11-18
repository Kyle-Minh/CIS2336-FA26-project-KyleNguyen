# UH Sugar Land Student Center — Front-End (Phase 2)

A front-end website for the new UH Sugar Land Student Center, built with **HTML, CSS and plain JavaScript** (no frameworks).
CIS 2336 Web Application Development · Front-End Deliverable.

> **Developer:** Kyle Nguyen · KDNGUY60@cougarnet.uh.edu

## How to run

1. Open the `uhsl-student-center` folder in **VS Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**.

An internet connection is required for the remotely hosted photos, the YouTube video, the Google Map and Google Fonts.

## Pages

| File | Page | Key features |
|---|---|---|
| `index.html` | Home | JavaScript-generated navigation menu, hero, quick links, embedded YouTube video, upcoming events, **Developer Contact** |
| `about.html` | About | About the center, staff, contact info, hours table, embedded Google Map |
| `facilities.html` | Facilities | Study areas, lounge, collaboration rooms, amenities, hours (today highlighted) |
| `events.html` | Events | Search, category and month filters, "Load More", expandable event details |
| `services.html` | Services | Student services, student organizations with collapsible "Learn More" |
| `faq.html` | FAQ | **5 collapsible FAQ items**, "Expand all / Collapse all", deep links (`faq.html#faq-3`) |
| `booking.html` | Book a Room | **5 rooms**, field validation, live availability check (placeholder for backend) |
| `references.html` | References | **AI prompt log**, media credits, sources |

## File structure

```
uhsl-student-center/
├── index.html, about.html, facilities.html, events.html,
│   services.html, faq.html, booking.html, references.html
├── css/
│   └── styles.css        # all styles (design tokens, layout, components, responsive)
├── js/
│   ├── main.js           # every page: dynamic menu, mobile menu, open/closed badge, footer, collapsibles
│   ├── events-data.js    # event data (shared by Home + Events)
│   ├── events.js         # Events page search/filter + Home preview
│   ├── faq.js            # FAQ expand-all + deep links
│   └── booking.js        # room booking validation + availability
├── README.md
└── STEP-BY-STEP.md       # implementation guide
```

## Requirement checklist

- [x] Homepage with navigation menu, displayed dynamically with JavaScript (`NAV_ITEMS` in `main.js`)
- [x] "Developer Contact" section with name and UH email (home page)
- [x] FAQ page with 5 collapsible items
- [x] Room booking form with 5 rooms and validation (availability check ready for the Node.js backend)
- [x] Reference page with AI prompts
- [x] Multimedia: remotely hosted images, embedded YouTube video and Google Map
- [x] Responsive design (desktop, tablet, phone) with hamburger menu
- [x] Accessibility: skip link, labels, `aria-expanded`, `aria-current`, focus styles, alt text, reduced-motion support

## Design

- **Colors:** UH-inspired red `#c8102e`, dark red `#960c22`, white, dark gray text, light gray sections
- **Fonts:** Montserrat (headings), Open Sans (body), both from Google Fonts
- **Components:** rounded cards, large section headings, pill buttons, card-based event listings, icons for services

## Next phase (Node.js)

- `booking.js → checkAvailability()` becomes a `fetch()` to a server route such as `GET /api/availability`.
- The form submits to `POST /api/bookings`.
- `events-data.js` can be replaced by `GET /api/events`.
