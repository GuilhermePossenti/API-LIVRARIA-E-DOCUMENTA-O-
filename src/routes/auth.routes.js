const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const authController = new AuthController();

router.post("/register", (req, res, next) => authController.register(req, res, next));
router.post("/login", (req, res, next) => authController.login(req, res, next));
router.post("/logout", (req, res, next) => authController.logout(req, res, next));

module.exports = router;
