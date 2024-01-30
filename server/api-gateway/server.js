import express from "express";
import cors from "cors";

import { proxy } from "./utils/proxy.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = 8080;

const accountServiceURL = process.env.ACCOUNT_SERVICE_URL;
const cartServiceURL = process.env.CART_SERVICE_URL;
const inventoryServiceURL = process.env.INVENTORY_SERVICE_URL;
const orderStatusServiceURL = process.env.ORDER_STATUS_SERVICE_URL;
const paymentServiceURL = process.env.PAYMENT_SERVICE_URL;
const placeOrderServiceURL = process.env.PLACE_ORDER_SERVICE_URL;
const productReviewServiceURL = process.env.PRODUCT_REVIEW_SERVICE_URL;
const recommendationServiceURL = process.env.RECOMMENDATION_SERVICE_URL;
const recommendationGenerationServiceURL =
  process.env.RECOMMENDATION_GENERATION_SERVICE_URL;
const searchServiceURL = process.env.SEARCH_SERVICE_URL;
const shippingServiceURL = process.env.SHIPPING_SERVICE_URL;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded());

app.use("/account", proxy(accountServiceURL));
app.use("/cart", proxy(cartServiceURL));
app.use("/inventory", proxy(inventoryServiceURL));
app.use("/order-status", proxy(orderStatusServiceURL));
app.use("/payment", proxy(paymentServiceURL));
app.use("/place-order", proxy(placeOrderServiceURL));
app.use("/product-review", proxy(productReviewServiceURL));
app.use("/recommendation", proxy(recommendationServiceURL));
app.use(
  "/recommendation-generation",
  proxy(recommendationGenerationServiceURL)
);
app.use("/search", proxy(searchServiceURL));
app.use("/shipping", proxy(shippingServiceURL));

app.use("*", (req, res) => res.sendStatus(404));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API Gateway läuft auf Port ${PORT}`);
});
