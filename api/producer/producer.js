require("dotenv").config();
const { app } = require("./app");
const config = require("./src/config");
const redisClient = require("./src/db/db");

const bootstrap = async () => {
  try {
    // connecting redis in-memory DB
    await redisClient.connect();
    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    // start server
    app.listen(config.server.port, () =>
      console.info(`Node Server listening on port: ${config.server.port}`)
    );
  } catch (e) {
    console.error(`Node Server Error Booting Up ERR: ${e}`);
    process.exit(1);
  }
};

bootstrap().then();

const closeOnExit = async (event) => {
  try {
    console.info(`Node Server Shuting Down : ${event}`);
    process.exit(0);
  } catch (e) {
    console.error(`Node Server Crashed Shuting Down : ${event}, ERR: ${e}}`);
    process.exit(1);
  }
};

process.once("SIGINT", async () => await closeOnExit("SIGINT"));
process.once("SIGTERM", async () => await closeOnExit("SIGTERM"));

module.exports = { app, redisClient };
