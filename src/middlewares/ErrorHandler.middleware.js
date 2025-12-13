const HttpError = require("../errors/HttpError");

function ErrorHandler(error, req, res, next) {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (process.env.NODE_ENV === "development") {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
      return;
    }
  }

  console.log(error);

  return res.status(500).json({
    success: false,
    message: error.message,
  });
}

module.exports = ErrorHandler;
