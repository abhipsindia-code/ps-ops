const jobs = Array.from({ length: 20 }).map((_, i) => ({
  id: `job-${i + 1}`,
  code: `C-BRI ${198900 + i}`,
  title: "Electrical Point Shift",
  dueDate: "25-10-2025",
  startDate: "26-10-2025",
  status: "NOT_STARTED",

  supervisor: null,   
  team: [],

  technician: null,      
  requestedBy: "Facility Manager",
  history: [],
  images: [],
}));

module.exports = { jobs };
