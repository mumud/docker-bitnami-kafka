import { Kafka, Partitioners } from "kafkajs";

const kafka = new Kafka({
  clientId: "nodejs-kafka",
  //   brokers: ["127.0.0.1:9093"], // single
  brokers: ["127.0.0.1:29092", "127.0.0.1:29093", "127.0.0.1:29094"], // cluster
  sasl: {
    mechanism: "plain",
    username: "client1",
    password: "pass1",
  },
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
producer.on("producer.connect", () => {
  console.log("Kafka producer connected");
});

producer.on("producer.disconnect", () => {
  console.log("Kafka producer disconnected");
});

producer.on("producer.network.request_timeout", () => {
  console.log("Kafka producer network request timeout");
});

const run = async () => {
  await producer.connect();

  setInterval(async () => {
    await producer.send({
      topic: "coba-kafka",
      messages: [
        {
          key: "1",
          value: Buffer.from(
            JSON.stringify({
              id: 1,
              fullname: "Jhony Kemod",
              message: "Coba kirim pesan ke topic",
            })
          ),
        },
      ],
    });
  }, 5000);
};

run().catch((error) => console.error(error));
