import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

export const verifyToken = asyncHandler(async (req, res, next) => {
  const {
    headers: { authorization },
  } = req;
  if (!authorization) {
    throw new ErrorResponse({
      message: "Bitte zuerst einloggen.",
      statusCode: 401,
      errorType: "AuthenticationError",
      errorCode: "AUTH_005",
    });
  }
  try {
    const { id } = jwt.verify(authorization, process.env.SECRET_KEY);
    req.userId = id;
    next();
  } catch (err) {
    throw new ErrorResponse({
      message: "Ungültiger Token",
      statusCode: 401,
      errorType: "AuthenticationError",
      errorCode: "AUTH_006",
    });
  }
});
