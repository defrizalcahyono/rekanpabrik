const express = require("express");
const router = express.Router();
const melamarController = require("../controllers/melamarPekerjaanControllers");

router.post("/applications", melamarController.melamarPekerjaan);

router.patch(
  "/applications/:id",
  melamarController.updateStatus
);

router.get(
  "/applications",
  melamarController.getDataMelamarPekerjaan
);

router.get(
  "/applications/pelamar/:idPelamar",
  melamarController.getMelamarHistoryByIDPelamar
);

router.get(
  "/applications/post/:idPostingan",
  melamarController.getMelamarHistoryByIDPostingan
);

module.exports = router;