const kafka = require("kafka-node");
const redisClient = require("../db/db");

const kafkaClientOptions = { sessionTimeout: 100, spinDelay: 100, retries: 2 };
const kafkaClient = new kafka.KafkaClient(
  process.env.KAFKA_ZOOKEEPER_CONNECT,
  "producer-client",
  kafkaClientOptions
);
const kafkaProducer = new kafka.Producer(kafkaClient);

kafkaClient.on("error", (error) => console.error("Kafka client error:", error));
kafkaProducer.on("error", (error) =>
  console.error("Kafka producer error:", error)
);

exports.getUserData = async (req, res) => {
  const { id } = req.query;

  const usersList = JSON.parse(await redisClient.get("users"));
  const foundUserIndex = usersList.findIndex((x) => x.id === id);
  const foundUser = usersList[foundUserIndex];

  if (!foundUser) return res.status(204).json({ message: "No user found" });

  res.json({ id: foundUser.id, name: foundUser.name, email: foundUser.email });
};
