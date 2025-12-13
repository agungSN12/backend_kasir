const express = require("express");
const router = express.Router();

const ProductController = require("./product.controller");
const asyncErrorHandle = require("../../errors/AsyncErrorHandle");
const {
  IdParamValidator,
  CreateProductValidator,
  UpdateProductValidator,
} = require("./product.validator");
const validateRequest = require("../../middlewares/validation.middleware");
const upload = require("../../middlewares/upload.middleware");
const authorizedRole = require("../../middlewares/authorizedRole.middleware");
const authJWT = require("../../middlewares/auth.middleware");

router.use(authJWT);

router.get(
  "/",
  asyncErrorHandle(ProductController.getAll.bind(ProductController))
);

router.get(
  "/:id",
  IdParamValidator,
  validateRequest,
  asyncErrorHandle(ProductController.getById.bind(ProductController))
);

router.post(
  "/",
  authorizedRole("admin"),
  upload.single("gambar"),
  CreateProductValidator,
  validateRequest,
  asyncErrorHandle(ProductController.create.bind(ProductController))
);

router.put(
  "/:id",
  authorizedRole("admin"),
  upload.single("gambar"),
  IdParamValidator,
  UpdateProductValidator,
  validateRequest,
  asyncErrorHandle(ProductController.update.bind(ProductController))
);

router.delete(
  "/:id",
  authorizedRole("admin"),
  asyncErrorHandle(ProductController.delete.bind(ProductController))
);

module.exports = router;
