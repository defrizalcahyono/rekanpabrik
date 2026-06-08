const express = require("express");
const router = express.Router();
const postController = require("../controllers/postingPekerjaanController");

router.get("/", postController.getAllPost);

router.get("/company/:idPerusahaan", postController.getAllPostByIdPerusahaan);

router.get("/:idPostingan", postController.getPostinganByIdPostPekerjaan);

router.post("/", postController.createdPostinganPekerjaan);

router.patch("/:idPostPekerjaan/status", postController.updateStatus);

router.delete("/:idPostPekerjaan", postController.deletePostingan);

router.get("/applications/:idLamaranPekerjaan", postController.getDetailPelamar);

module.exports = router;