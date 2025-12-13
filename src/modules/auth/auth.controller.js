const NotFoundError = require("../../errors/NotFoundError");
const AuthService = require("./auth.service");

class AuthController {
  async register(req, res, next) {
    try {
      const data = req.body;
      const result = await AuthService.register(data);

      res.status(201).json({
        success: true,
        message: "berhasil register",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const data = req.body;
      const result = await AuthService.login(data);

      res.status(200).json({
        success: true,
        message: "berhasil login",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async profile(req, res, next) {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new NotFoundError("id tidak di temukan");
      }
      const user = await AuthService.Profile(userId);
      res.status(200).json({
        success: true,
        message: "profile berhasil di ambil",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
