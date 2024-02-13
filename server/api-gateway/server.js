import express from "express";
import cors from "cors";
import { validateEnvs, currentConfig } from "./configs/envConfig.js";
import { proxy } from "./utils/proxy.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { verifyToken } from "./middlewares/verifyToken.js";
import { authRouter } from "./routes/authRouter.js";

validateEnvs();

export const app = express();
const PORT = 8080;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/account", verifyToken, proxy(currentConfig.ACCOUNT_SERVICE_BASE_URL));
app.use("/cart", proxy(currentConfig.CART_SERVICE_BASE_URL));
app.use("/inventory", proxy(currentConfig.INVENTORY_SERVICE_BASE_URL));
app.use(
  "/order-status",
  verifyToken,
  proxy(currentConfig.ORDER_STATUS_SERVICE_BASE_URL),
);
app.use("/payment", verifyToken, proxy(currentConfig.PAYMENT_SERVICE_BASE_URL));
app.use(
  "/place-order",
  verifyToken,
  proxy(currentConfig.PLACE_ORDER_SERVICE_BASE_URL),
);
app.use(
  "/product-review",
  verifyToken,
  proxy(currentConfig.PRODUCT_REVIEW_SERVICE_BASE_URL),
);
app.use(
  "/recommendation",
  proxy(currentConfig.RECOMMENDATION_SERVICE_BASE_URL),
);
app.use(
  "/recommendation-generation",
  proxy(currentConfig.RECOMMENDATION_GENERATION_SERVICE_BASE_URL),
);
app.use("/search", proxy(currentConfig.SEARCH_SERVICE_BASE_URL));
app.use(
  "/shipping",
  verifyToken,
  proxy(currentConfig.SHIPPING_SERVICE_BASE_URL),
);

app.use("/auth", authRouter);
app.use("*", (req, res) => res.sendStatus(404));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API Gateway läuft auf Port ${PORT}`);
});
