const HttpError = require("./HttpError");

class ServerError extends HttpError {
  constructor(message = "Server Error") {
    super(message, 500);
    this.name = "Server Error";
  }
}

module.exports = ServerError;
