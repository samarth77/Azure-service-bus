import { ServiceBusWrapper } from "./ServiceBusWrapper.js";

export class TopicSender extends ServiceBusWrapper {
  constructor(connectionString, topicName) {
    super(connectionString);
    this.topicName = topicName;

    // createSender() can also be used to create a sender for a queue.
    this.sender = this.sbClient.createSender(this.topicName);
  }

  async send(messages) {
    // Tries to send all messages in a single batch.
    // Will fail if the messages cannot fit in a batch.
    // await sender.sendMessages(messages);
    try {
      // create a batch object
      let batch = await this.sender.createMessageBatch();
      for (let i = 0; i < messages.length; i++) {
        // for each message in the arry

        // try to add the message to the batch
        if (!batch.tryAddMessage(messages[i])) {
          // if it fails to add the message to the current batch
          // send the current batch as it is full
          await this.sender.sendMessages(batch);

          // then, create a new batch
          batch = await this.sender.createMessageBatch();

          // now, add the message failed to be added to the previous batch to this batch
          if (!batch.tryAddMessage(messages[i])) {
            // if it still can't be added to the batch, the message is probably too big to fit in a batch
            throw new Error("Message too big to fit in a batch");
          }
        }
      }

      // Send the last created batch of messages to the topic
      await this.sender.sendMessages(batch);

      console.log(`Sent a batch of messages to the topic: ${this.topicName}`);

      // Close the sender
      await this.sender.close();
    } finally {
      await this.sbClient.close();
    }
  }
}
