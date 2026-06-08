const express = require("express");
const router = express.Router();
const savedJobsController = require("../controllers/savedJobsControllers");

router.post("/", savedJobsController.savedJobs);

router.get(
  "/pelamar/:idPelamar",
  savedJobsController.getSavedJobsByIdPelamar
);

module.exports = router;