import express from "express";
import cors from "cors";
import { authRouter } from "./routes/authRouter.js";

const app = express();
const PORT = 8081;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Account Service: GET-Anfrage empfangen");
});

app.post("/", (req, res) => {
  res.send("Account Service: POST-Anfrage empfangen");
});

app.use("/auth", authRouter);
app.use("*", (req, res) => res.sendStatus(404));

app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});
