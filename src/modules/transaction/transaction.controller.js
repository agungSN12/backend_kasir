const transactionService = require("./transaction.service");
const ForbiddenError = require("../../errors/ForbiddenError");

class TransactionController {
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const payment_status = req.query.payment_status || "";
      const sortBy = req.query.sortBy || "created_at";
      const order = req.query.order || "asc";

      const result = await transactionService.getAll(
        page,
        limit,
        search,
        payment_status,
        sortBy,
        order
      );

      res.json({
        success: true,
        message: "Daftar transaksi kamu",
        result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await transactionService.getById(req.params.id);
      res.status(200).json({
        success: true,
        message: "transaksi di temukan",
        result: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = {
        ...req.body,
      };
      const result = await transactionService.create(data);
      res.status(200).json({
        success: true,
        message: "transaksi berhasil di buat",
        result: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      await transactionService.update(req.body, req.params.id);
      res
        .status(200)
        .json({ success: true, message: "data berhasil di update" });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await transactionService.delete(req.params.id);
      res
        .status(200)
        .json({ success: true, message: "data berhasil di hapus" });
    } catch (err) {
      next(err);
    }
  }

  async getMounlySummary(req, res, next) {
    try {
      const result = await transactionService.getMounlySummary();
      res.status(200).json({
        success: true,
        message: "summary data berhasil di ambil",
        result,
      });
    } catch (err) {
      next(err);
    }
  }
  async getMounlyChart(req, res, next) {
    try {
      const reuslt = await transactionService.getMounlyChart(req.userId);
      res.status(200).json({
        success: true,
        message: "chart data berhasil di ambil",
        data: reuslt,
      });
    } catch (err) {
      next(err);
    }
  }
  async getTodayTransaction(req, res, next) {
    try {
      const result = await transactionService.getTodayTransaction(req.userId);
      res.status(200).json({
        success: true,
        message: "data transaksi hari ini berhasil di ambil",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TransactionController();
