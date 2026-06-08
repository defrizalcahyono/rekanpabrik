const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/users/count", adminController.countUser);

router.get("/", adminController.getAllAdmin);

router.put("/profile", adminController.updateProfileAdmin);

router.delete("/:id", adminController.deleteAdminHandler);

module.exports = router;