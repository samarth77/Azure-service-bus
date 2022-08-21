import { delay } from "@azure/service-bus";
import { ServiceBusWrapper } from "./ServiceBusWrapper.js";

export class QueueReceiver extends ServiceBusWrapper {
  constructor(connectionString, queueName) {
    super(connectionString);
    this.queueName = queueName;

    // createReceiver() can also be used to create a receiver for a subscription.
    this.receiver = this.sbClient.createReceiver(this.queueName);
  }

  async receive() {
    // function to handle messages
    const myMessageHandler = async (messageReceived) => {
      console.log(`Received message: ${messageReceived.body}`);
    };

    // function to handle any errors
    const myErrorHandler = async (error) => {
      console.log(error);
    };

    // subscribe and specify the message and error handlers
    this.receiver.subscribe({
      processMessage: myMessageHandler,
      processError: myErrorHandler,
    });

    // Waiting long enough before closing the sender to send messages
    await delay(20000);

    await this.receiver.close();
    await this.sbClient.close();
  }
}
