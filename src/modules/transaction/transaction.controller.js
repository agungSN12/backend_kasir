const transactionService = require("./transaction.service");
const ForbiddenError = require("../../errors/ForbiddenError");

class TransactionController {
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";

      const result = await transactionService.getAll(
        req.userId,
        page,
        limit,
        search
      );

      res.json({
        success: true,
        message: "Daftar transaksi kamu",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const transaction = await transactionService.getById(req.params.id);
      if (transaction.user_id !== req.userId) {
        throw new ForbiddenError("kamu tidak bisa akses transaksi ini");
      }
      res.status(200).json({
        success: true,
        message: "transaksi di temukan",
        data: transaction,
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
      const transaction = await transactionService.create(data);
      res.status(200).json({
        success: true,
        message: "transaksi berhasil di buat",
        data: transaction,
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
      const data = await transactionService.getMounlySummary(req.userId);
      res.status(200).json({
        success: true,
        message: "summary data berhasil di ambil",
        data,
      });
    } catch (err) {
      next(err);
    }
  }
  async getMounlyChart(req, res, next) {
    try {
      const data = await transactionService.getMounlyChart(req.userId);
      res.status(200).json({
        success: true,
        message: "chart data berhasil di ambil",
        data,
      });
    } catch (err) {
      next(err);
    }
  }
  async getTodayTransaction(req, res, next) {
    try {
      const data = await transactionService.getTodayTransaction(req.userId);
      res.status(200).json({
        success: true,
        message: "data transaksi hari ini berhasil di ambil",
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TransactionController();
