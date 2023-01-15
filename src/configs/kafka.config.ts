import { Kafka, Partitioners } from "kafkajs";
export var isProducerConnected = false

export const kafkaClient = new Kafka({
    clientId: 'codese-client-id',
    brokers: ['localhost:9092'],
    retry: {
        retries: 5
    },
})

export const producer = kafkaClient.producer({
    createPartitioner: Partitioners.LegacyPartitioner
})

producer.connect()

producer.on('producer.connect', () => {
    isProducerConnected = true;
});

