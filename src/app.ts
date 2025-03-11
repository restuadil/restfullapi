import { PrismaClient } from "@prisma/client";
import express, { Application } from "express";

const app: Application = express();
const prisma = new PrismaClient();
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/api", (req, res) => {
  res.json({ message: "API endpoint is working" });
});
app.get("/api/users", async (req, res) => {
  const response = await prisma.user.findMany();
  res.json(response);
});
export default app;
