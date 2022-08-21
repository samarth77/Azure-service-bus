import { TopicSender } from "../TopicSender.js";
import { TopicReceiver } from "../TopicReceiver.js";
import { QueueReceiver } from "../QueueReceiver.js";
import { QueueSender } from "../QueueSender.js";

import dotenv from "dotenv";
dotenv.config();

const messages = [
  { body: "Albert Einstein" },
  { body: "Werner Heisenberg" },
  { body: "Galileo Galilei" },
];
const connectionString = process.env.SERVICE_BUS_NAMESPACE_CONNECTION_STRING;
const topicName = process.env.TOPIC_NAME;
const queueName = process.env.QUEUE_NAME;
const subscriptionName = process.env.SUBSCRIPTION_NAME;

// create topic
const topicSend = new TopicSender(connectionString, topicName);
// send messages to it.
await topicSend.send(messages).catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});

// create topic subscription
const topicRecv = new TopicReceiver(
  connectionString,
  topicName,
  subscriptionName
);
// receive msgs from the subscription
await topicRecv.receive().catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});

// create Queue Sender and send messages in queue.
const QSender = new QueueSender(connectionString, queueName);

QSender.send(messages).catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});

// example queue receive
const QReceiver = new QueueReceiver(connectionString, queueName);
// call the main function
await QReceiver.receive().catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});
