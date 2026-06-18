const express = require("express");
const router = express.Router();
const pelamarController = require("../controllers/pelamarController");
const multer = require("../middleware/multer");

router.get("/", pelamarController.getAllPelamar);

router.put("/:idPelamar", pelamarController.updateDataPelamr);

router.patch(
  "/:idPelamar/profile-picture",
  multer.single("profile_pict"),
  pelamarController.updateProfilePictPelamar
);

router.patch(
  "/:idPelamar/cv",
  multer.single("CV"),
  pelamarController.updateCVPelamar
);

router.patch("/:idPelamar/password", pelamarController.changePassword);

router.delete(
  "/:id_pelamar",
  pelamarController.deletePelamarHandler
);

module.exports = router;