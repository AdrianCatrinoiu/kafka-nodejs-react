const kafka = require("kafka-node");
const redisClient = require("../db/db");

(async () => {
  // connect to redis
  await redisClient.connect();
  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  const kafkaClientOptions = {
    sessionTimeout: 1000,
    spinDelay: 1000,
    retries: 500,
  };
  const kafkaClient = new kafka.KafkaClient(
    process.env.KAFKA_ZOOKEEPER_CONNECT,
    "consumer-client",
    kafkaClientOptions
  );

  const topics = [{ topic: "users" }];

  const options = {
    autoCommit: false,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: "buffer",
  };

  const kafkaConsumer = new kafka.Consumer(kafkaClient, topics, options);

  kafkaConsumer.on("message", async function (message) {
    console.log("Message received:", message);

    const usersList = redisClient.get("users");
    if (!usersList || usersList.length < 1) {
      const newUsersList = [...users, message.data];
      await redisClient.set("users", JSON.stringify(newUsersList));
    }
  });

  kafkaClient.on("error", (error) =>
    console.error("Kafka client error:", error)
  );
  kafkaConsumer.on("error", (error) =>
    console.error("Kafka consumer error:", error)
  );
})();
