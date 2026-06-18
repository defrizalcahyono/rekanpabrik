const express = require("express");
const router = express.Router();
const perusahaanController = require("../controllers/perusahaanController");
const multer = require("../middleware/multer");
const verifyJWT = require("../middleware/verififyJWT");

router.get("/", perusahaanController.getAllPerusahaan);

router.get("/:idPerusahaan", perusahaanController.getAllPerusahaanByIDPerusahaan);

router.patch(
  "/:idPerusahaan/profile-picture",
  verifyJWT,
  multer.single("profile_pict"),
  perusahaanController.updateProfilePictPerusahaan
);

router.put(
  "/:idPerusahaan",
  verifyJWT,
  perusahaanController.updateDataPerusahaan
);

router.get(
  "/:idPerusahaan/applications",
  verifyJWT,
  perusahaanController.cekPelamar
);

router.patch(
  "/:idPerusahaan/password",
  verifyJWT,
  perusahaanController.changePassword
);

router.delete(
  "/:id_perusahaan",
  verifyJWT,
  perusahaanController.deletePerusahaanHandler
);

module.exports = router;