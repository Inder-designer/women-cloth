const ErrorHandler = require('../Utils/errorhandler');

exports.errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong Mongoose ObjectId
  if (err.name === "CastError") {
    console.log(err);

    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue || {}).join(
      ", "
    )} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Invalid JWT
  if (err.name === "JsonWebTokenError") {
    const message = "Json Web Token is invalid, try again";
    err = new ErrorHandler(message, 401);
  }

  // Expired JWT
  if (err.name === "TokenExpiredError") {
    const message = "Json Web Token has expired, try again";
    err = new ErrorHandler(message, 401);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
  });
};
