import app from "./app";
import { logger } from "./config/logger";

app.listen(8080, () => {
  logger.info("Server is running on port localhost:8080");
});
