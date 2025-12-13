const express = require("express");
const router = express.Router();
const authRoute = require("./src/modules/auth/auth.route");
const userRoute = require("./src/modules/user/user.route");
const NotFoundError = require("./src/errors/NotFoundError");
const productRoute = require("./src/modules/produk/product.route");
const transaction = require("./src/modules/transaction/transaction.route");

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/product", productRoute);
router.use("/transaction", transaction);

router.use((req, res) => {
  throw new NotFoundError("route tidak di temukan");
});
module.exports = router;
