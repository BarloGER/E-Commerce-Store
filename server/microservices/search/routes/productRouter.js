import { Router } from "express";
import {
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

export const productRouter = Router();

productRouter.post("/products", addProduct);
productRouter.get("/products/:ProductID", getProductById);
productRouter.put("/products/:ProductID", updateProduct);
productRouter.delete("/products/:ProductID", deleteProduct);
