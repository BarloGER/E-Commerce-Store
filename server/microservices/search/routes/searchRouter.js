import { Router } from "express";
import { elasticSearch } from "../controllers/searchController.js";

export const searchRouter = Router();

searchRouter.post("/query", elasticSearch);
