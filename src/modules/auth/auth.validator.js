const { body } = require("express-validator");

const registerValidator = [
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

  body("phone").optional().isInt().withMessage("phone harus berupa angka"),

  body("avatar").optional().isString().withMessage("avatar harus berupa teks"),
];

const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email wajib diisi")
    .isEmail()
    .withMessage("Email tidak valid"),
  body("password").notEmpty().withMessage("Password wajib diisi"),
];

module.exports = {
  registerValidator,
  loginValidator,
};
