/* =========================================================
   events-data.js — the list of Student Center events
   ---------------------------------------------------------
   Kept in its own file so both the Home page (upcoming
   preview) and the Events page can use the same data.
   In the Node.js phase this array can be replaced by a
   fetch("/api/events") request to the server.

   date format: "YYYY-MM-DD"
   ========================================================= */

const EVENTS = [
  {
    id: "welcome-mixer",
    title: "Student Center Welcome Mixer",
    category: "Social",
    date: "2026-11-20",
    time: "4:00 PM – 6:00 PM",
    location: "Student Common Area",
    summary: "Meet classmates, tour the new center and grab free snacks.",
    details:
      "Kick off the opening of the new Student Center! Take a guided tour of every space, meet student organization leaders and enter the raffle for UH Sugar Land gear. Open to all UH students."
  },
  {
    id: "finals-study-jam",
    title: "Finals Study Jam",
    category: "Academic",
    date: "2026-12-01",
    time: "6:00 PM – 10:00 PM",
    location: "Study Areas & Collaboration Rooms",
    summary: "Extended quiet study time with tutors, coffee and snacks.",
    details:
      "Peer tutors for math, writing and computer science will be available on a walk-in basis. Collaboration rooms are first come, first served for the night. Bring your Cougar Card."
  },
  {
    id: "esports-tournament",
    title: "Coogs Esports Winter Tournament",
    category: "Gaming",
    date: "2026-12-04",
    time: "5:00 PM – 9:00 PM",
    location: "Lounge & Game Room",
    summary: "Bracket-style tournament with prizes for the top three teams.",
    details:
      "Teams of up to five players. Sign up at the front desk or through the Coogs Esports Club. Spectators welcome — the matches will be streamed on the lounge screens."
  },
  {
    id: "stress-less",
    title: "Stress Less Wellness Day",
    category: "Wellness",
    date: "2026-12-07",
    time: "11:00 AM – 2:00 PM",
    location: "Student Common Area",
    summary: "Therapy dogs, chair massages and healthy snacks before finals.",
    details:
      "Take a break before finals week. Counseling staff will share quick stress-management tips, and wellness kits will be handed out while supplies last."
  },
  {
    id: "resume-review",
    title: "Resume Review Drop-In",
    category: "Career",
    date: "2026-12-09",
    time: "1:00 PM – 4:00 PM",
    location: "Collaboration Room 2",
    summary: "Get quick one-on-one feedback on your resume.",
    details:
      "Bring a printed copy or your laptop. Career advisors will review formatting, wording and how to tailor your resume for internships."
  },
  {
    id: "spring-org-fair",
    title: "Spring Student Organization Fair",
    category: "Social",
    date: "2027-01-21",
    time: "11:00 AM – 2:00 PM",
    location: "Student Common Area",
    summary: "Find clubs and organizations to join this spring.",
    details:
      "More than 20 student organizations will have tables. Learn how to get involved, run for officer positions or start your own organization."
  },
  {
    id: "study-skills",
    title: "Study Smarter Workshop",
    category: "Academic",
    date: "2027-01-27",
    time: "12:30 PM – 1:30 PM",
    location: "Media & Presentation Room",
    summary: "Time management and note-taking strategies for the new semester.",
    details:
      "A one-hour interactive workshop covering weekly planning, active recall and how to use the Student Center's study spaces effectively. Lunch provided for the first 30 students."
  },
  {
    id: "internship-panel",
    title: "Internship Panel: Fort Bend Employers",
    category: "Career",
    date: "2027-02-03",
    time: "5:30 PM – 7:00 PM",
    location: "Media & Presentation Room",
    summary: "Local employers share how to land an internship.",
    details:
      "Hear from recruiters in technology, healthcare and business, followed by a Q&A and networking time. Business casual recommended."
  },
  {
    id: "game-night",
    title: "Board Game & Trivia Night",
    category: "Gaming",
    date: "2027-02-11",
    time: "6:00 PM – 9:00 PM",
    location: "Lounge & Game Room",
    summary: "Board games, team trivia and pizza.",
    details:
      "Come solo or bring friends. Trivia rounds start at 7:00 PM, and winning teams get Student Center swag."
  },
  {
    id: "yoga-mornings",
    title: "Morning Yoga on the Patio",
    category: "Wellness",
    date: "2027-02-17",
    time: "8:00 AM – 9:00 AM",
    location: "Student Center Patio",
    summary: "Beginner-friendly yoga to start your day.",
    details:
      "Mats are provided. In case of rain, the session moves to the Media & Presentation Room."
  }
];
