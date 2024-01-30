import express from "express";
import cors from "cors";

import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = 8080;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded());

app.use("*", (req, res) => res.sendStatus(404));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API Gateway läuft auf Port ${PORT}`);
});
