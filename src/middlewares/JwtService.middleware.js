const jwt = require("jsonwebtoken");
const config = require("../config/config");

class JwtService {
  sign(payload) {
    return jwt.sign(payload, config.jwt.secretJWT, { expiresIn: "1d" });
  }

  verify(token) {
    return jwt.verify(token, config.jwt.secretJWT);
  }
}

module.exports = new JwtService();
