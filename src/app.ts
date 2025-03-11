import express, { Application } from "express";

const app: Application = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/api", (req, res) => {
  res.json({ message: "API endpoint is working" });
});

export default app;
