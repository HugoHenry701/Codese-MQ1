import { io } from 'socket.io-client'
import { isProducerConnected, producer } from '../configs/kafka.config';
import { KAFKA_TOPIC } from '../constants/kafka.constant';


async function produceMessage(key: string, value: string) {
    if (isProducerConnected) {
        await producer.send({
            topic: KAFKA_TOPIC.CODESE,
            messages: [
                {
                    key,
                    value
                }
            ]
        })
    }
}

async function main() {
    const socket = io('http://localhost:3000');

    socket.on('stockPrice', (data) => {
        produceMessage(data.code, JSON.stringify(data))
    })

}

main()