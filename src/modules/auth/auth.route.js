const express = require("express");

const router = express.Router();
const AuthController = require("./auth.controller");
const asyncErrorHandle = require("../../errors/AsyncErrorHandle");
const { registerValidator, loginValidator } = require("./auth.validator");
const validateRequest = require("../../middlewares/validation.middleware");
const authJWT = require("../../middlewares/auth.middleware");

router.post(
  "/register",
  registerValidator,
  validateRequest,
  asyncErrorHandle(AuthController.register.bind(AuthController))
);

router.post(
  "/login",
  loginValidator,
  validateRequest,
  asyncErrorHandle(AuthController.login.bind(AuthController))
);

router.get(
  "/profile",
  authJWT,
  asyncErrorHandle(AuthController.profile.bind(AuthController))
);

module.exports = router;
