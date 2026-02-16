const express = require("express");
const router = express.Router();
const { pool } = require("../../db");
const auth = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// GET /api/users?role=supervisor|technician
router.get("/", auth, allowRoles("admin"), async (req, res) => {
  const { role } = req.query;

  try {
    let query = `
      SELECT id, name
      FROM users
      WHERE is_active = 1
    `;
    const params = [];

    if (role) {
      query += " AND role = ?";
      params.push(role);
    }

    query += " ORDER BY name ASC";

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
