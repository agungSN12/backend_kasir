const transactionService = require("./transaction.service");

class TransactionController {
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const payment_status = req.query.payment_status || "";
      const sortBy = req.query.sortBy || "created_at";
      const order = req.query.order || "asc";

      const result = await transactionService.getAll({
        page,
        limit,
        search,
        payment_status,
        sortBy,
        order,
      });

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
        message: "transaksi ditemukan",
        result,
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const result = await transactionService.create(req.body);
      res.status(201).json({
        success: true,
        message: "transaksi berhasil dibuat",
        result,
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      await transactionService.update(req.body, req.params.id);
      res.status(200).json({
        success: true,
        message: "data berhasil diupdate",
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await transactionService.delete(req.params.id);
      res.status(200).json({
        success: true,
        message: "data berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  }

  async getMonthlySummary(req, res, next) {
    try {
      const result = await transactionService.getMounlySummary();
      res.status(200).json({
        success: true,
        message: "summary data berhasil diambil",
        result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMonthlyChart(req, res, next) {
    try {
      const result = await transactionService.getMounlyChart();
      res.status(200).json({
        success: true,
        message: "chart data berhasil diambil",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getTodayTransaction(req, res, next) {
    try {
      const result = await transactionService.getTodayTransaction();
      res.status(200).json({
        success: true,
        message: "data transaksi hari ini berhasil diambil",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getWeeklySummary(req, res, next) {
    try {
      const result = await transactionService.getWeeklySummary();
      res.status(200).json({
        success: true,
        message: "weekly summary berhasil diambil",
        result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getBestSelling(req, res, next) {
    try {
      const limit = Number(req.query.limit) || 5;
      const result = await transactionService.getBestSellingByQty(limit);

      res.status(200).json({
        success: true,
        message: "Produk paling laris berdasarkan qty",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TransactionController();
