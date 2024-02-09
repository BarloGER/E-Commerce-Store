import express from "express";
import cors from "cors";
import { proxy } from "./utils/proxy.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { verifyToken } from "./middlewares/verifyToken.js";
import { authRouter } from "./routes/authRouter.js";

const app = express();
const PORT = 8080;

const accountServiceBaseURL = process.env.ACCOUNT_SERVICE_Base_URL;
const cartServiceBaseURL = process.env.CART_SERVICE_Base_URL;
const inventoryServiceBaseURL = process.env.INVENTORY_SERVICE_Base_URL;
const orderStatusServiceBaseURL = process.env.ORDER_STATUS_SERVICE_Base_URL;
const paymentServiceBaseURL = process.env.PAYMENT_SERVICE_Base_URL;
const placeOrderServiceBaseURL = process.env.PLACE_ORDER_SERVICE_Base_URL;
const productReviewServiceBaseURL = process.env.PRODUCT_REVIEW_SERVICE_Base_URL;
const recommendationServiceBaseURL =
  process.env.RECOMMENDATION_SERVICE_Base_URL;
const recommendationGenerationServiceBaseURL =
  process.env.RECOMMENDATION_GENERATION_SERVICE_Base_URL;
const searchServiceBaseURL = process.env.SEARCH_SERVICE_Base_URL;
const shippingServiceBaseURL = process.env.SHIPPING_SERVICE_Base_URL;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/account", verifyToken, proxy(accountServiceBaseURL));
app.use("/cart", proxy(cartServiceBaseURL));
app.use("/inventory", proxy(inventoryServiceBaseURL));
app.use("/order-status", verifyToken, proxy(orderStatusServiceBaseURL));
app.use("/payment", verifyToken, proxy(paymentServiceBaseURL));
app.use("/place-order", verifyToken, proxy(placeOrderServiceBaseURL));
app.use("/product-review", verifyToken, proxy(productReviewServiceBaseURL));
app.use("/recommendation", proxy(recommendationServiceBaseURL));
app.use(
  "/recommendation-generation",
  proxy(recommendationGenerationServiceBaseURL)
);
app.use("/search", proxy(searchServiceBaseURL));
app.use("/shipping", verifyToken, proxy(shippingServiceBaseURL));

app.use("/auth", authRouter);
app.use("*", (req, res) => res.sendStatus(404));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API Gateway läuft auf Port ${PORT}`);
});
