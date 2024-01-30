export const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message,
    errorType: err.errorType,
    errorCode: err.errorCode,
    statusCode: err.statusCode,
  });
};
