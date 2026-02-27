const express = require("express");
const router = express.Router();
const { pool } = require("../../db");
const auth = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { v4: uuid } = require("uuid");

// GET all companies
router.get("/", auth, allowRoles("admin", "supervisor"), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        code,
        type,
        site,
        address,
        city,
        state,
        gst_number,
        is_active
      FROM companies
      ORDER BY name ASC, site ASC, code ASC
    `);

    res.json(rows);
  } catch (err) {
    if (err?.code === "ER_BAD_FIELD_ERROR" && `${err.message || ""}`.includes("name")) {
      try {
        const [rows] = await pool.query(`
          SELECT
            id,
            code,
            type,
            site,
            address,
            city,
            state,
            gst_number,
            is_active
          FROM companies
          ORDER BY code ASC, site ASC
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


// CREATE company
router.post("/", auth, allowRoles("admin"), async (req, res) => {
  try {
    const {
      name,
      code,
      type,
      site,
      address,
      city,
      state,
      gst_number
    } = req.body;

    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedCode = typeof code === "string" ? code.trim().toUpperCase() : "";
    const trimmedSite = typeof site === "string" ? site.trim() : "";
    const trimmedAddress = typeof address === "string" ? address.trim() : "";
    const trimmedCity = typeof city === "string" ? city.trim() : "";
    const trimmedState = typeof state === "string" ? state.trim() : "";
    const trimmedGst = typeof gst_number === "string" ? gst_number.trim() : "";

    if (!trimmedName || !trimmedCode || !trimmedSite || !trimmedAddress) {
      return res.status(400).json({ error: "Name, code, site, and address are required" });
    }

    // prevent duplicate code + site
    const [existing] = await pool.query(
      "SELECT id FROM companies WHERE code = ? AND site = ?",
      [trimmedCode, trimmedSite]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Company site already exists for this code" });
    }

    const normalizedType = typeof type === "string" ? type.trim().toUpperCase() : "";
    const typeMap = {
      CLIENT: "CORPORATE",
      COMPANY: "CORPORATE",
      CORP: "CORPORATE",
      INDIVIDUAL: "INDIVIDUAL",
      RWA: "RWA",
    };
    const resolvedType = typeMap[normalizedType] || normalizedType || "CORPORATE";
    const allowedTypes = new Set(["INDIVIDUAL", "CORPORATE", "RWA"]);

    if (!allowedTypes.has(resolvedType)) {
      return res.status(400).json({ error: "Invalid company type" });
    }

    const id = uuid();

    try {
      await pool.query(
        `INSERT INTO companies (
          id,
          name,
          code,
          type,
          site,
          address,
          city,
          state,
          gst_number
        )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          trimmedName,
          trimmedCode,
          resolvedType,
          trimmedSite,
          trimmedAddress,
          trimmedCity || null,
          trimmedState || null,
          trimmedGst || null
        ]
      );
    } catch (insertErr) {
      if (
        insertErr?.code === "ER_BAD_FIELD_ERROR" &&
        `${insertErr.message || ""}`.toLowerCase().includes("name")
      ) {
        await pool.query(
          `INSERT INTO companies (
            id,
            code,
            type,
            site,
            address,
            city,
            state,
            gst_number
          )
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            trimmedCode,
            resolvedType,
            trimmedSite,
            trimmedAddress,
            trimmedCity || null,
            trimmedState || null,
            trimmedGst || null
          ]
        );
      } else if (insertErr?.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Company code already exists" });
      } else {
        throw insertErr;
      }
    }

    try {
      const [created] = await pool.query(
        `SELECT
          id,
          name,
          code,
          type,
          site,
          address,
          city,
          state,
          gst_number,
          is_active
        FROM companies
        WHERE id = ?`,
        [id]
      );
      res.status(201).json(created[0]);
      return;
    } catch (selectErr) {
      if (
        selectErr?.code === "ER_BAD_FIELD_ERROR" &&
        `${selectErr.message || ""}`.toLowerCase().includes("name")
      ) {
        const [created] = await pool.query(
          `SELECT
            id,
            code,
            type,
            site,
            address,
            city,
            state,
            gst_number,
            is_active
          FROM companies
          WHERE id = ?`,
          [id]
        );
        res.status(201).json({ ...created[0], name: null });
        return;
      }

      throw selectErr;
    }
  } catch (err) {
    console.error("Error creating company:", err);
    res.status(500).json({ error: "Failed to create company" });
  }
});

module.exports = router;
