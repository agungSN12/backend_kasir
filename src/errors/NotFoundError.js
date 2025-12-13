const HttpError = require("./HttpError");

class NotFoundError extends HttpError {
  constructor(message = "Not Found Error") {
    super(message, 404);
    this.name = "Not Found Error";
  }
}

module.exports = NotFoundError;
