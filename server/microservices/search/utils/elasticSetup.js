import { Client } from "@elastic/elasticsearch";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

const ELASTIC_URL = process.env.ELASTIC_URL;
const ELASTIC_API_KEY = process.env.ELASTIC_API_KEY;
const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME;
const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD;

export const elasticClient = new Client({
  node: ELASTIC_URL,
  auth: {
    ELASTIC_API_KEY,
    ELASTIC_USERNAME,
    ELASTIC_PASSWORD,
  },
  ssl: {
    rejectUnauthorized: false, // ACHTUNG: Nicht für Produktionsgebrauch!
  },
});

export const createIndex = asyncHandler(async (req, res, next) => {
  try {
    await elasticClient.indices.create({
      index: "products",
      body: {
        mappings: {
          properties: {
            ItemDescription: { type: "text" },
          },
        },
      },
    });

    res.status(200).json({ message: "Index created successfully" });
  } catch (error) {
    if (
      error.meta &&
      error.meta.body &&
      error.meta.body.error &&
      error.meta.body.error.type === "resource_already_exists_exception"
    ) {
      return next(
        new ErrorResponse({
          message: "Index already exists",
          statusCode: 400,
          errorType: "Bad Request",
          errorCode: "INDEX_EXISTS",
        }),
      );
    } else {
      // Behandle den Fall, dass error.meta oder error.meta.body nicht definiert ist
      console.error("Error creating index:", error);
      return next(
        new ErrorResponse({
          message: error.message || "Error creating index",
          statusCode: error.statusCode || 500,
          errorType: "Internal Server Error",
          errorCode: "INDEX_CREATION_FAILED",
        }),
      );
    }
  }
});

export const setupElasticsearch = asyncHandler(async (req, res, next) => {
  // Prüfe, ob der Index existiert
  const indexExists = await elasticClient.indices.exists({ index: "products" });

  if (!indexExists) {
    // Wenn der Index nicht existiert, erstelle ihn
    await createIndex(req, res, next).catch(next);
  } else {
    console.log("Index already exists");
  }
});
