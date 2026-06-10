const express = require("express");
const router = express.Router();
const melamarController = require("../controllers/melamarPekerjaanControllers");

router.post("/", melamarController.melamarPekerjaan);

router.patch(
  "/:id",
  melamarController.updateStatus
);

router.get(
  "/",
  melamarController.getDataMelamarPekerjaan
);

router.get(
  "/pelamar/:idPelamar",
  melamarController.getMelamarHistoryByIDPelamar
);

router.get(
  "/post/:idPostingan",
  melamarController.getMelamarHistoryByIDPostingan
);

module.exports = router;