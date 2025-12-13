const { body, param } = require("express-validator");

const createTransactionValidator = [
  body("customer_name")
    .notEmpty()
    .withMessage("nama customer harus diisi")
    .isString()
    .withMessage("nama harus menggunakan teks"),
  body("total_amount")
    .notEmpty()
    .withMessage("total amount harus di isi")
    .isInt()
    .withMessage("total amount harus berupa angka"),
  body("payment_method")
    .notEmpty()
    .withMessage("payment method harus di isi")
    .isIn(["Cash", "Qris"])
    .withMessage("payment method harus berisi 'Cash' atau 'Qris' "),
  body("payment_status")
    .notEmpty()
    .withMessage("payment status harus diisi")
    .isIn(["di proses", "dalam antrian", "selesai"])
    .withMessage(
      "payment status harus berisi 'diproses', 'dalam antrian', atau 'selesai' "
    ),
  body("note")
    .optional()
    .isString()
    .withMessage("note harus berupa teks")
    .isLength({ max: 200 })
    .withMessage("note tidak boleh lebih dari 200 karakter"),
];

const updateTransactionValidator = [
  body("customer_name")
    .optional()
    .isString()
    .withMessage("nama harus menggunakan teks"),
  body("total_amount")
    .optional()
    .isInt()
    .withMessage("total amount harus berupa angka"),
  body("payment_method")
    .optional()
    .isString()
    .withMessage("payment_method harus berupa teks"),
  body("payment_status")
    .optional()
    .isIn(["di proses", "dalam antrian", "selesai"])
    .withMessage(
      "payment status harus berisi 'diproses', 'dalam antrian', atau 'selesai' "
    ),
  body("note")
    .optional()
    .isString()
    .withMessage("note harus berupa teks")
    .isLength({ max: 200 })
    .withMessage("note tidak boleh lebih dari 200 karakter"),
];

const idParamValidator = [
  param("id").isInt().withMessage("ID transaksi harus berupa angka"),
];

module.exports = {
  createTransactionValidator,
  updateTransactionValidator,
  idParamValidator,
};
