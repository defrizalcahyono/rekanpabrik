const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const verifyJWT = require("../middleware/verififyJWT");

router.get("/users/count", adminController.countUser);

router.get("/", adminController.getAllAdmin);

router.get("/me", verifyJWT, adminController.getMeAdmin);

router.put("/profile", adminController.updateProfileAdmin);

router.delete("/:id", adminController.deleteAdminHandler);

module.exports = router;