const express = require("express");
const router = express.Router();
const { pool } = require("../../db");
const auth = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// GET all companies
router.get("/", auth, allowRoles("admin", "supervisor"), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        code,
        type
      FROM companies
      ORDER BY name ASC, code ASC
    `);

    res.json(rows);
  } catch (err) {
    if (err?.code === "ER_BAD_FIELD_ERROR" && `${err.message || ""}`.includes("name")) {
      try {
        const [rows] = await pool.query(`
          SELECT
            id,
            name,
            code,
            type
          FROM companies
          ORDER BY code ASC
        `);

        res.json(rows.map(row => ({ ...row, name: null })));
        return;
      } catch (fallbackErr) {
        console.error("Error fetching companies (fallback):", fallbackErr);
        res.status(500).json({ error: "Failed to fetch companies" });
        return;
      }
    }

    console.error("Error fetching companies:", err);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

module.exports = router;
