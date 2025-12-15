const express = require("express");
const router = express.Router();
const authJWT = require("../../middlewares/auth.middleware");
const asyncErrorHandle = require("../../errors/AsyncErrorHandle");
const transactionController = require("./transaction.controller");
const {
  createTransactionValidator,
  updateTransactionValidator,
  idParamValidator,
} = require("./transaction.validator");
const validateRequest = require("../../middlewares/validation.middleware");
const authorizedRole = require("../../middlewares/authorizedRole.middleware");

router.use(authJWT);

router.get(
  "/",
  asyncErrorHandle(transactionController.getAll.bind(transactionController))
);

router.get(
  "/monthly-summary",
  asyncErrorHandle(
    transactionController.getMonthlySummary.bind(transactionController)
  )
);
router.get(
  "/monthly-chart",
  authorizedRole("admin"),
  asyncErrorHandle(
    transactionController.getMonthlyChart.bind(transactionController)
  )
);
router.get(
  "/today",
  asyncErrorHandle(
    transactionController.getTodayTransaction.bind(transactionController)
  )
);
router.get(
  "/weekly-summary",
  asyncErrorHandle(
    transactionController.getWeeklySummary.bind(transactionController)
  )
);
router.get(
  "/best-selling",
  asyncErrorHandle(
    transactionController.getBestSelling.bind(transactionController)
  )
);

router.get(
  "/:id",
  idParamValidator,
  validateRequest,
  asyncErrorHandle(transactionController.getById.bind(transactionController))
);

router.post(
  "/",
  createTransactionValidator,
  validateRequest,
  asyncErrorHandle(transactionController.create.bind(transactionController))
);

router.put(
  "/:id",
  idParamValidator,
  updateTransactionValidator,
  validateRequest,
  asyncErrorHandle(transactionController.update.bind(transactionController))
);

router.delete(
  "/:id",
  authorizedRole("admin"),
  idParamValidator,
  validateRequest,
  asyncErrorHandle(transactionController.delete.bind(transactionController))
);

module.exports = router;
