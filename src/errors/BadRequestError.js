const HttpError = require("./HttpError");

class BadRequestError extends HttpError {
  constructor(message = "Bad Requests Error") {
    super(message, 400);
    this.name = "Bad Request Error";
  }
}

module.exports = BadRequestError;
