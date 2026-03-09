const express = require("express");
const router = express.Router();
const {
  createVisitController,
  getJobVisits,
  startVisit,
  submitVisit,
  approveVisit,
  updateVisitTechnicians,
  rescheduleVisit,
  cancelVisit,
  getMyVisits,   
} = require("../controllers/visits.controller");

router.post("/jobs/:jobId/visits", createVisitController);
router.get("/jobs/:jobId/visits", getJobVisits);

//visit status flow routes
router.patch("/:visitId/start", startVisit);
router.patch("/:visitId/submit", submitVisit);
router.patch("/:visitId/approve", approveVisit);

router.patch("/:visitId/technicians", updateVisitTechnicians);
router.patch("/:visitId/reschedule", rescheduleVisit);
router.patch("/:visitId/cancel", cancelVisit);


router.get("/my", getMyVisits);

module.exports = router;