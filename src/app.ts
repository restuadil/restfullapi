import express, { Application } from "express";
import { logMiddleware } from "./middleware/log.middleware";
import { routeMiddleware } from "./middleware/route.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { CategoryRouter } from "./api/category/category.route";
import { ProductRouter } from "./api/product/product.route";

const app: Application = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use(logMiddleware);
//can declare routing here
app.use(CategoryRouter);
app.use(ProductRouter);

app.use(routeMiddleware);
app.use(errorMiddleware);
export default app;
