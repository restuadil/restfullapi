import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

app.listen(env.PORT, () => {
  logger.info(`Server is running on port localhost:${env.PORT}`);
});
