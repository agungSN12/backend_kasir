const UserService = require("./user.service");
const NotFoundError = require("../../errors/NotFoundError");

class UserController {
  async getAll(req, res, next) {
    try {
      const users = await UserService.getAll();
      if (users.length === 0) throw new NotFoundError("data belum ada boy");
      res.json({
        success: true,
        messege: "user berhasil di dapat boy",
        data: users,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await UserService.getById(req.params.id);
      if (!user) throw new NotFoundError("data tidak ada boy");
      res.json({
        success: true,
        messege: "user berhasil di dapat id",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
  async create(req, res, next) {
    try {
      const user = await UserService.create(req.body);
      res
        .status(201)
        .json({ success: true, messege: "user berhasil di buat", data: user });
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      const user = await UserService.update(req.body, req.params.id);
      if (!user) throw new NotFoundError("Data user tidak di temukan");
      res
        .status(200)
        .json({ success: true, messege: "data berhasil di ubah", data: user });
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    const user = await UserService.delete(req.params.id);
    if (!user) throw new NotFoundError("Data user tidak di temukan");
    res.status(200).json({ success: true, messege: "data berhasil di hapus" });
    try {
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
