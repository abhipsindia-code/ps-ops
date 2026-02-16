// src/data/mockDashboard.js

export const bookingSummary = {
  today: 26,
  residential: 824,
  commercial: 324,
  total: 1224,

  unassigned: 24,
  inProgress: 852,
  closed: 253,
};

/* -------------------------
   USERS (re-usable entities)
-------------------------- */

const supervisors = {
  rajan: {
    id: "sup-1",
    name: "Rajan S",
  },
};

const technicians = {
  raju: {
    id: "tech-1",
    name: "Raju P",
    avatar: "src/assets/avatars/raju.jpg",
  },
  manjunath: {
    id: "tech-2",
    name: "Manjunath",
    avatar: "src/assets/avatars/manjunath.jpg",
  },
  saravanan: {
    id: "tech-3",
    name: "Saravanan",
    avatar: "src/assets/avatars/saravanan.jpg",
  },
};

const jobTitles = [
  "Electrical Point Shift",
  "Termite Treatment",
  "Deep Cleaning – 3BHK",
  "AC Service & Repair",
  "Plumbing Leakage Fix",
  "Cockroach Control",
  "False Ceiling Repair",
];

const statuses = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "ESCALATED",
  "COMPLETED",
];



/* -------------------------
   JOBS
-------------------------- */

export const jobs = Array.from({ length: 20 }).map((_, i) => {
  const techList = Object.values(technicians);
  const technician =
    i % 4 === 0 ? null : techList[i % techList.length];

  return {
    id: `job-${i + 1}`,
    code: `C-BRI ${198900 + i}`,
    title: jobTitles[i % jobTitles.length],

    dueDate: `${25 + (i % 5)}-10-2025`,
    startDate: `${26 + (i % 5)}-10-2025`,

    status: statuses[i % statuses.length],

    supervisor: supervisors.rajan,

    technician,

    team: technician
      ? [technician.name]
      : [],

    requestedBy:
      i % 2 === 0
        ? "Ravi M | Brigade Group"
        : "Facility Manager | Tech Park",

    history:
      i % 3 === 0
        ? [
            {
              date: "22-10-2025",
              text: "Job created",
            },
            {
              date: "23-10-2025",
              text: "Work in progress",
            },
          ]
        : [],

    images: [],
  };
});

