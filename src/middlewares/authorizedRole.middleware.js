const UnauthorizedError = require("../errors/UnauthorizedError");

function authorizedRole(...role) {
  return (req, res, next) => {
    if (!role.includes(req.role)) {
      throw new UnauthorizedError("halaman ini tidak bisa di akses");
    }
    next();
  };
}

module.exports = authorizedRole;
