const UserService = require("./product.service");
const NotFoundError = require("../../errors/NotFoundError");
const ProductService = require("./product.service");

class ProductController {
  async getAll(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const order = req.query.order || "asc";
    const sortBy = req.query.sortBy || "created_at";
    const status = req.query.status || "";

    try {
      const product = await ProductService.getAll({
        page,
        limit,
        search,
        status,
        sortBy,
        order,
      });
      if (product.data.length === 0)
        throw new NotFoundError("data belum ada boy");
      res.json({
        success: true,
        messege: "product berhasil di dapat",
        data: product.data,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await ProductService.getById(req.params.id);
      if (!product) throw new NotFoundError("data tidak ada boy");
      res.json({
        success: true,
        messege: "product berhasil di dapat",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }
  async create(req, res, next) {
    try {
      const file = req.file ? req.file.buffer : null;
      const filename = req.file ? req.file.originalname : null;
      const product = await ProductService.create(req.body, file, filename);
      res.status(201).json({
        success: true,
        messege: "product berhasil di buat",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      const file = req.file ? req.file.buffer : null;
      const filename = req.file ? req.file.originalname : null;
      const product = await ProductService.update(
        req.body,
        req.params.id,
        file,
        filename
      );
      if (!product) throw new NotFoundError("Data product tidak di temukan");
      res.status(200).json({
        success: true,
        messege: "data berhasil di ubah",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    const product = await ProductService.delete(req.params.id);
    if (!product) throw new NotFoundError("Data product tidak di temukan");
    res.status(200).json({ success: true, messege: "data berhasil di hapus" });
    try {
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();
