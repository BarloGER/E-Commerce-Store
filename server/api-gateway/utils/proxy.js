import axios from "axios";
import logger from "../configs/logger.js";
import { asyncHandler } from "./asyncHandler.js";
import { ErrorResponse } from "./ErrorResponse.js";

export const proxy = (target) => {
  const instance = axios.create({
    baseURL: target,
    timeout: 5000,
  });

  instance.interceptors.request.use((config) => {
    delete config.headers["Authorization"];
    logger.info(`Proxying request to: ${config.baseURL}${config.url}`, {
      requestConfig: config,
    });
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      logger.info(
        `Response from: ${response.config.url} with status: ${response.status}`,
      );
      return response;
    },
    (error) => {
      if (error.response) {
        logger.error(
          `Error response from: ${error.response.config.url} with status: ${error.response.status}`,
          { error: error.message },
        );
      } else {
        logger.error("Error in request:", { error: error.message });
      }
      return Promise.reject(error);
    },
  );

  return asyncHandler(async (req, res, next) => {
    try {
      const response = await instance({
        method: req.method,
        url: req.url,
        headers: req.headers,
        data: req.body,
        params: req.query,
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        next(
          new ErrorResponse({
            message: "Gateway Timeout",
            statusCode: 504,
            errorType: "NetworkError",
            errorCode: "NET_001",
          }),
        );
      } else if (error.response) {
        next(
          new ErrorResponse({
            message: error.response.data.message || "An error occurred",
            statusCode: error.response.status,
            errorType: "APIError",
            errorCode: "API_001",
          }),
        );
      } else {
        next(
          new ErrorResponse({
            message: "Server Error",
            statusCode: 500,
            errorType: "InternalError",
            errorCode: "INT_001",
          }),
        );
      }
    }
  });
};
