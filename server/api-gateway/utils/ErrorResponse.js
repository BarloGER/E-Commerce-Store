class ErrorResponse extends Error {
  constructor({ message, statusCode, errorType, errorCode }) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.errorCode = errorCode;
  }
}

export default ErrorResponse;
