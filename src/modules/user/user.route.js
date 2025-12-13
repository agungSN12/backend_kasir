const express = require("express");
const router = express.Router();

const UserController = require("./user.controller");
const asyncErrorHandle = require("../../errors/AsyncErrorHandle");
const {
  IdParamValidator,
  CreateUserValidator,
  UpdateUserValidator,
} = require("./user.validator");
const validateRequest = require("../../middlewares/validation.middleware");
const authJWT = require("../../middlewares/auth.middleware");
const authorizedRole = require("../../middlewares/authorizedRole.middleware");

router.use(authJWT);

router.get(
  "/",
  authorizedRole("admin"),
  asyncErrorHandle(UserController.getAll.bind(UserController))
);

router.get(
  "/:id",
  IdParamValidator,
  validateRequest,
  asyncErrorHandle(UserController.getById.bind(UserController))
);

router.post(
  "/",
  authorizedRole("admin"),
  CreateUserValidator,
  validateRequest,
  asyncErrorHandle(UserController.create.bind(UserController))
);

router.put(
  "/:id",
  authorizedRole("admin"),
  IdParamValidator,
  UpdateUserValidator,
  validateRequest,
  asyncErrorHandle(UserController.update.bind(UserController))
);

router.delete(
  "/:id",
  authorizedRole("admin"),
  asyncErrorHandle(UserController.delete.bind(UserController))
);

module.exports = router;
