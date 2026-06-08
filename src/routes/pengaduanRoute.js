const express = require("express");
const router = express.Router();
const pengaduanController = require("../controllers/pengaduanController");
const verifyJWT = require("../middleware/verififyJWT");

router.post("/", pengaduanController.addPengaduan);

router.get("/", verifyJWT, pengaduanController.getAllPengaduan);

router.delete("/:id_pengaduan", verifyJWT, pengaduanController.deletePengaduan);

module.exports = router;