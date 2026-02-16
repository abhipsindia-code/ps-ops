const express = require("express");
const router = express.Router();
const { pool } = require("../../db");
const auth = require("../middleware/auth.middleware");

router.get("/summary", auth, async (req, res) => {
  try {
    let where = "WHERE 1=1";
    let params = [];

    console.log("User role for summary:", req.user.role);

    if (req.user.role === "supervisor") {
      where += " AND j.supervisor_id = ?";
      params.push(req.user.id);
    }

    if (req.user.role === "technician") {
      where += " AND JSON_CONTAINS(j.team, JSON_QUOTE(?))";
      params.push(String(req.user.id));
    }

    const [rows] = await pool.query(`
      SELECT
        COUNT(*) AS total,

        SUM(j.status = 'CREATED')      AS created,
        SUM(j.status = 'ASSIGNED')     AS assigned,
        SUM(j.status = 'IN_PROGRESS')  AS in_progress,
        SUM(j.status = 'PAUSED')       AS paused,
        SUM(j.status = 'COMPLETED')    AS completed,
        SUM(j.status = 'CANCELLED')    AS cancelled,

        SUM(DATE(j.due_date) = CURDATE()) AS due_today,

        SUM(
          DATE(j.due_date) < CURDATE()
          AND j.status NOT IN ('COMPLETED','CANCELLED')
        ) AS overdue,

        SUM(DATE(j.due_date) > CURDATE()) AS upcoming,

        SUM(j.company_id IS NULL)     AS residential,
        SUM(j.company_id IS NOT NULL) AS corporate

      FROM jobs j
      ${where}
    `, params);

    const s = rows[0];

    const [[bookingCount]] = await pool.query(
      `SELECT COUNT(*) AS total_bookings FROM bookings`
    );

    res.json({
      total: s.total,

      status: {
        created: s.created,
        assigned: s.assigned,
        inProgress: s.in_progress,
        paused: s.paused,
        completed: s.completed,
        cancelled: s.cancelled
      },

      calendar: {
        today: s.due_today,
        overdue: s.overdue,
        upcoming: s.upcoming
      },

      customerType: {
        residential: s.residential,
        corporate: s.corporate
      },

      totalBookings: bookingCount.total_bookings
    });

  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
});




module.exports = router;
