import express, { Application } from "express";
import { logMiddleware } from "./middleware/log.middleware";
import { routeMiddleware } from "./middleware/route.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { CategoryRouter } from "./api/category/category.route";
import { ProductRouter } from "./api/product/product.route";
import { UserRouter } from "./api/user/user.route";
import { AuthRouter } from "./api/auth/auth.route";

const app: Application = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hell Express api");
});
app.use(logMiddleware);
//can declare routing here
app.use("/api/v1", CategoryRouter);
app.use("/api/v1", ProductRouter);
app.use("/api/v1", AuthRouter);
app.use("/api/v1", UserRouter);

app.use(routeMiddleware);
app.use(errorMiddleware);
export default app;
