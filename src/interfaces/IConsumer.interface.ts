export interface IConsumer {
    name: string;
    groupId: string;
    topicSubscribe: string;
    fromBeginning: boolean;
    processor: ({ topic, partition, message }) => Promise<void>;
  }
  