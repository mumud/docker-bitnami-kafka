import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "nodejs-kafka",
  //   brokers: ["127.0.0.1:9093"], // single
  brokers: ["127.0.0.1:29092", "127.0.0.1:29093", "127.0.0.1:29094"], // cluster
  sasl: {
    mechanism: "PLAIN",
    username: "client1",
    password: "pass1",
  },
});

const consumer = kafka.consumer({ groupId: "test-group" });
consumer.on("consumer.connect", () => {
  console.log("Kafka consumer connected");
});

consumer.on("consumer.disconnect", () => {
  console.log("Kafka consumer disconnected");
});

consumer.on("consumer.network.request_timeout", () => {
  console.log("Kafka consumer network request timeout");
});

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "coba-kafka", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: JSON.parse(message.value),
      });
    },
  });
};

run().catch((error) => console.error(error));
