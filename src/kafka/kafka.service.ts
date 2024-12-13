import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaService {
  private kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'CLIENT',
      brokers: ['localhost:9092'],
    });
  }

  @EventPattern('test-topic')
  async handleMessage(message: any) {
    console.log(`Mensaje recibido: ${message.value}`);
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
      eachMessage: async ({ message }) => {
        const value = message.value.toString();
        const event = JSON.parse(value); // Si está serializado en JSON
        console.log('Evento procesado:', event);
      },
    });
  }
}
