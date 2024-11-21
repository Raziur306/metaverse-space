import express from "express";
import { router } from "./router";

const app = express();

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
  console.log("http://localhost:3000/health");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

app.get("/health", (req, res) => {
  res.json({
    port: process.env.PORT || 3000,
    health: "Server is running",
    date: new Date(),
  });
});
