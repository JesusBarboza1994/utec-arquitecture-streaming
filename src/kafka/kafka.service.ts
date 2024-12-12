import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { partition } from 'rxjs';

@Injectable()
export class KafkaService {
  private kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'CLIENT',
      brokers: ['localhost:9092'],
    });
  }

  async sendMessage(topic: string, message: string): Promise<void> {
    const producer = this.kafka.producer();
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: message }],
    });
    await producer.disconnect();
  }

  async consumeMessage(topic: string): Promise<void> {
    const consumer = this.kafka.consumer({ groupId: 'my-group' });
    await consumer.connect();
    await consumer.subscribe({ topic });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value.toString(),
        });
      },
    });
  }
}
