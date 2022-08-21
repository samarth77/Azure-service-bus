import { ServiceBusClient } from "@azure/service-bus";

export class ServiceBusWrapper {
  constructor(connectionString) {
    this.connectionString = connectionString;

    // create a Service Bus client using the connection string to the Service Bus namespace
    this.sbClient = new ServiceBusClient(this.connectionString);
  }
}
