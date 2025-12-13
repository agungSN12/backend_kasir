const { body, param } = require("express-validator");

const CreateProductValidator = [
  body("name_product")
    .notEmpty()
    .withMessage("nama produk harus di isi")
    .isLength({ max: 100 })
    .withMessage("nama produk tidak boleh lebih dari 100 karakter"),

  body("description")
    .notEmpty()
    .withMessage("deskripsi harus di isi")
    .isLength({ max: 200 })
    .withMessage("deskripsi tidak boleh lebih dari 200 karakter"),

  body("price")
    .notEmpty()
    .withMessage("price harus di isi")
    .isInt()
    .withMessage("price harus berupa angka"),

  body("stok")
    .notEmpty()
    .withMessage("stok harus di isi")
    .isInt()
    .withMessage("stok harus berupa angka"),

  body("status")
    .notEmpty()
    .withMessage("status harus di isi")
    .isIn(["tersedia", "habis", "nonaktif"])
    .withMessage("status harus berisi 'tersedia', 'habis' atau 'nonaktif' "),

  body("unit")
    .notEmpty()
    .withMessage("unit harus di isi")
    .isIn(["porsi", "gelas"])
    .withMessage("status harus berisi 'porsi' atau 'gelas' "),
];

const UpdateProductValidator = [
  body("name_product")
    .optional()
    .isLength({ max: 100 })
    .withMessage("nama produk tidak boleh lebih dari 100 karakter"),

  body("description")
    .optional()
    .isLength({ max: 200 })
    .withMessage("deskripsi tidak boleh lebih dari 200 karakter"),

  body("price").optional().isInt().withMessage("price harus berupa angka"),

  body("stok").optional().isInt().withMessage("stok harus berupa angka"),

  body("status")
    .optional()
    .isIn(["tersedia", "habis", "nonaktif"])
    .withMessage("status harus berisi 'tersedia', 'habis' atau 'nonaktif' "),

  body("unit")
    .optional()
    .isInt(["porsi", "gelas"])
    .withMessage("status harus berisi 'porsi' atau 'gelas' "),
];

const IdParamValidator = [
  param("id").isInt().withMessage("ID harus berupa angka"),
];

module.exports = {
  CreateProductValidator,
  UpdateProductValidator,
  IdParamValidator,
};
