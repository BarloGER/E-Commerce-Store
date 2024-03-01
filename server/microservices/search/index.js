import express from "express";
import cors from "cors";
import { productRouter } from "./routes/productRouter.js";
import { searchRouter } from "./routes/searchRouter.js";
import { testDBConnection } from "./db/index.js";
import { setupElasticsearch } from "./utils/elasticSetup.js";

const app = express();
const PORT = 8090;

testDBConnection();
setupElasticsearch();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Search Service: GET-Anfrage empfangen");
});

app.post("/", (req, res) => {
  res.send("Search Service: POST-Anfrage empfangen");
});

app.use("/", searchRouter);
app.use("/auth", productRouter);
app.use("*", (req, res) => res.sendStatus(404));

app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});
