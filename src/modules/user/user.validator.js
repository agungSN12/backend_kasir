const { body, param } = require("express-validator");

const CreateUserValidator = [
  body("name")
    .notEmpty()
    .withMessage("nama wajib di isi")
    .isLength({ max: 50 })
    .withMessage("panjang tidak boleh lebih dari 50 karakter"),

  body("email")
    .notEmpty()
    .withMessage("email wajib di isi")
    .isEmail()
    .withMessage("email tidak valid"),

  body("password")
    .notEmpty()
    .withMessage("password wajib di isi")
    .isLength({ max: 20 })
    .withMessage("password tidak boleh lebih dari 6 karakter"),

  body("role")
    .notEmpty()
    .withMessage("role wajib di isi")
    .isIn(["admin", "kasir"])
    .withMessage("role harus berisi admin atau kasir"),

  body("address")
    .optional()
    .isLength({ max: 200 })
    .withMessage("address tidak boleh lebih dari 200 karakter"),

  body("phone")
    .optional()
    .isLength({ max: 14 })
    .withMessage("number tidak boleh lebih dari 14 karakter"),

  body("avatar").optional().isString().withMessage("avatar harus berupa teks"),
];

const UpdateUserValidator = [
  body("name")
    .notEmpty()
    .withMessage("nama wajib di isi")
    .isLength({ max: 50 })
    .withMessage("panjang tidak boleh lebih dari 50 karakter"),

  body("email")
    .notEmpty()
    .withMessage("email wajib di isi")
    .isEmail()
    .withMessage("email tidak valid"),

  body("password")
    .optional()
    .isLength({ max: 6 })
    .withMessage("password tidak boleh lebih dari 6 karakter"),

  body("role")
    .notEmpty()
    .withMessage("role wajib di isi")
    .isIn(["admin", "kasir"])
    .withMessage("role harus berisi admin atau kasir"),

  body("address")
    .optional()
    .isLength({ max: 200 })
    .withMessage("address tidak boleh lebih dari 200 karakter"),

  body("phone")
    .optional()
    .isLength({ max: 14 })
    .withMessage("number tidak boleh lebih dari 14 karakter"),

  body("avatar").optional().isString().withMessage("avatar harus berupa teks"),
];

const IdParamValidator = [
  param("id").isInt().withMessage("ID harus berupa angka"),
];

module.exports = {
  CreateUserValidator,
  UpdateUserValidator,
  IdParamValidator,
};
