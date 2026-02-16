const express = require('express');
const router = express.Router();
const { pool } = require('../../db');
const minioClient = require('../lib/minio');
const auth = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.get('/db-check', auth, allowRoles("admin"), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ db: 'connected', result: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/minio-check', auth, allowRoles("admin"), async (req, res) => {
  try {
    const bucket = process.env.MINIO_BUCKET;
    if (!bucket) {
      return res.status(500).json({ error: 'MINIO_BUCKET is not set' });
    }

    const exists = await minioClient.bucketExists(bucket);
    res.json({
      minio: 'connected',
      bucket,
      exists,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
