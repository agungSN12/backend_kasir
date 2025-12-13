const jwt = require("../middlewares/JwtService.middleware");
const UnauthorizedError = require("../errors/UnauthorizedError");

function authJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("token tidak ada");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decode = jwt.verify(token);
    req.user = decode;
    req.userId = decode.id;
    req.role = decode.role;
    next();
  } catch (err) {
    throw new UnauthorizedError("token sudah tidak valid atau kadaluarsa");
  }
}

module.exports = authJWT;
