import express from "express";
import cors from "cors";

const app = express();
const PORT = 8083;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Inventory Service: GET-Anfrage empfangen");
});

app.post("/", (req, res) => {
  res.send("Inventory Service: POST-Anfrage empfangen");
});

app.use("*", (req, res) => res.sendStatus(404));

app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});
