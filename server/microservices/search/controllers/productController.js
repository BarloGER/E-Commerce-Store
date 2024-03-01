import {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import { ddbClient } from "../db/index.js";
import { elasticClient } from "../utils/elasticSetup.js";

export const addProduct = asyncHandler(async (req, res) => {
  const ProductID = crypto.randomUUID();

  // Erstelle ein Objekt für DynamoDB und Elasticsearch
  let dynamoItem = {
    ProductID: { S: ProductID },
  };

  let esItem = {
    ProductID,
  };

  // Füge nur die Felder hinzu, die tatsächlich vorhanden sind
  [
    "Category",
    "ItemDescription",
    "Gender",
    "Size",
    "Color",
    "Resolution",
    "ManufacturedBy",
  ].forEach((field) => {
    if (req.body[field]) {
      dynamoItem[field] = { S: req.body[field] };
      esItem[field] = req.body[field];
    }
  });

  if (req.body.BatteryLife) {
    dynamoItem.BatteryLife = { N: req.body.BatteryLife.toString() };
    esItem.BatteryLife = req.body.BatteryLife;
  }

  const params = {
    TableName: "Products",
    Item: dynamoItem,
  };

  try {
    // Schreibe zuerst das Produkt in DynamoDB
    await ddbClient.send(new PutItemCommand(params));

    // Indexiere das Produkt in Elasticsearch
    const esResponse = await elasticClient.index({
      index: "products",
      id: ProductID,
      body: esItem,
    });

    // Überprüfe die Antwort von Elasticsearch
    if (
      esResponse.result === "created" &&
      esResponse._shards.successful > 0 &&
      esResponse._shards.failed === 0
    ) {
      res.status(201).json({
        message:
          "Product added successfully to both DynamoDB and Elasticsearch.",
      });
    } else {
      throw new ErrorResponse({
        message:
          "Product added to DynamoDB but failed to index in Elasticsearch.",
        statusCode: 500,
        errorType: "InternalServerError",
        errorCode: "ES_INDEXING_FAILED",
      });
    }
  } catch (error) {
    console.error("Error adding product:", error);
    throw new ErrorResponse({
      message: `Unable to add product: ${error.message}`,
      statusCode: error.statusCode || 500,
      errorType: "InternalServerError",
      errorCode: "DB_ERROR",
    });
  }
});

export const getProductById = asyncHandler(async (req, res) => {
  const { ProductID } = req.params;

  const params = {
    TableName: "Products",
    Key: {
      ProductID: { N: ProductID },
    },
  };

  try {
    const { Item } = await ddbClient.send(new GetItemCommand(params));
    if (!Item) {
      throw new ErrorResponse("Product not found", 404);
    }
    res.status(200).json({ Item });
  } catch (error) {
    throw new ErrorResponse("Unable to get product", 500);
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { ProductID } = req.params;

  // Halte die Update-Expression und die Werte dynamisch
  let updateExpression = "set";
  let expressionAttributeValues = {};

  Object.keys(req.body).forEach((key, index) => {
    // Füge Kommas hinzu, wenn es nicht das erste Element ist
    updateExpression += `${index > 0 ? "," : ""} ${key} = :${key}`;
    expressionAttributeValues[`:${key}`] =
      req.body[key] instanceof Number
        ? { N: req.body[key].toString() }
        : { S: req.body[key] };
  });

  const params = {
    TableName: "Products",
    Key: {
      ProductID: { S: ProductID },
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "UPDATED_NEW",
  };

  try {
    // Aktualisiere zuerst das Produkt in DynamoDB
    await ddbClient.send(new UpdateItemCommand(params));

    // Bereite das Dokument für Elasticsearch vor
    let esDoc = {};
    for (const [key, value] of Object.entries(req.body)) {
      esDoc[key] = value;
    }

    // Aktualisiere das Produkt in Elasticsearch
    const esResponse = await elasticClient.update({
      index: "products",
      id: ProductID,
      body: {
        doc: esDoc,
      },
    });

    // Überprüfe die Antwort von Elasticsearch
    if (
      esResponse.result === "updated" &&
      esResponse._shards.successful > 0 &&
      esResponse._shards.failed === 0
    ) {
      res.status(200).json({
        message:
          "Product updated successfully in both DynamoDB and Elasticsearch.",
      });
    } else {
      throw new ErrorResponse({
        message:
          "Product updated in DynamoDB but failed to update in Elasticsearch.",
        statusCode: 500,
        errorType: "InternalServerError",
        errorCode: "ES_UPDATE_FAILED",
      });
    }
  } catch (error) {
    throw new ErrorResponse({
      message: `Unable to update product: ${error.message}`,
      statusCode: error.statusCode || 500,
      errorType: "InternalServerError",
      errorCode: "UPDATE_ERROR",
    });
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { ProductID } = req.params;

  const params = {
    TableName: "Products",
    Key: {
      ProductID: { S: ProductID },
    },
  };

  try {
    // Lösche zuerst das Produkt aus DynamoDB
    await ddbClient.send(new DeleteItemCommand(params));

    // Lösche das Produkt aus Elasticsearch
    const esResponse = await elasticClient.delete({
      index: "products",
      id: ProductID,
    });

    // Elasticsearch gibt kein 'result' zurück, wenn nichts gelöscht wurde, daher prüfen wir auf 'found'.
    if (
      esResponse.result === "deleted" &&
      esResponse._shards.successful > 0 &&
      esResponse._shards.failed === 0
    ) {
      res.status(200).json({
        message:
          "Product deleted successfully from both DynamoDB and Elasticsearch.",
      });
    } else {
      throw new ErrorResponse({
        message:
          "Product deleted from DynamoDB but Elasticsearch returned an unexpected result.",
        statusCode: 500,
        errorType: "InternalServerError",
        errorCode: "ES_DELETE_FAILED",
      });
    }
  } catch (error) {
    // Wenn ein Fehler in Elasticsearch auftritt, z.B. das Dokument existiert nicht, wird ein 404-Statuscode zurückgegeben.
    if (error.meta && error.meta.statusCode === 404) {
      res.status(200).json({
        message:
          "Product not found in Elasticsearch, but was removed from DynamoDB.",
      });
    } else {
      throw new ErrorResponse({
        message: `Unable to delete product: ${error.message}`,
        statusCode: error.meta ? error.meta.statusCode : 500,
        errorType: "InternalServerError",
        errorCode: "DELETE_ERROR",
      });
    }
  }
});
