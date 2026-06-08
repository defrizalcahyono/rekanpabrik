const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyJWT = require("../middleware/verififyJWT");

router.post("/login", authController.login);

router.post("/register/pelamar", authController.createAccountPelamar);

router.post(
  "/register/admin",
  verifyJWT,
  authController.createAccountAdmin
);

router.post(
  "/register/perusahaan",
  authController.createAccountPerusahaan
);

router.get("/me", verifyJWT, authController.getUserLoggedIn);

router.post("/password/forgot", authController.forgetPassword);

router.post(
  "/password/reset",
  verifyJWT,
  authController.resetPassword
);

module.exports = router;