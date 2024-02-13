import { ErrorResponse } from "../utils/ErrorResponse.js";

export const validateJoi = (schema) => (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(
      new ErrorResponse({
        message: "Keine Daten zum Validieren vorhanden.",
        statusCode: 400,
        errorType: "ValidationError",
        errorCode: "VAL_001",
      }),
    );
  }

  const { error } = schema.validate(req.body);
  return error
    ? next(
        new ErrorResponse({
          message: error.details[0].message,
          statusCode: 400,
          errorType: "ValidationError",
          errorCode: "VAL_002",
        }),
      )
    : next();
};
