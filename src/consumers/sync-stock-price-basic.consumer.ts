import moment from 'moment';
import { codesePool, query } from '../configs/database.config';
import { KAFKA_TOPIC } from '../constants/kafka.constant';
import { IConsumer } from '../interfaces/IConsumer.interface';
import { isProducerConnected, producer } from '../configs/kafka.config';

export const processor = async ({ topic, partition, message }) => {
  try {
    const startProcess = moment();
    const data = JSON.parse(message.value.toString());

    const {
      code,
      exchange,
      tradingDate,
      askPrice1,
      askPrice2,
      askPrice3,
      askVol1,
      askVol2,
      askVol3,
      bidPrice1,
      bidPrice2,
      bidPrice3,
      bidVol1,
      bidVol2,
      bidVol3,
      lastPrice,
      totalVol,
      refPrice,
      unixTime,
    } = data;
    const test = askVol1 % 2;
    if (test != 0) {
      throw Error('Retry message because not divided to 2');
    }
    const sql = `insert into StockPrice (code, exchange, tradingDate, askPrice1, askPrice2, askPrice3, askVol1, askVol2, askVol3, bidPrice1, bidPrice2, bidPrice3, bidVol1, bidVol2, bidVol3, lastPrice, totalVol, refPrice, unixTime) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) on duplicate key update exchange=?, tradingDate=?, askPrice1=?, askPrice2=?, askPrice3=?, askVol1=?, askVol2=?, askVol3=?, bidPrice1=?, bidPrice2=?, bidPrice3=?, bidVol1=?, bidVol2=?, bidVol3=?, lastPrice=?, totalVol=?, refPrice=?, unixTime=?`;
    await query(codesePool, sql, [
      code,
      exchange,
      tradingDate,
      askPrice1,
      askPrice2,
      askPrice3,
      askVol1,
      askVol2,
      askVol3,
      bidPrice1,
      bidPrice2,
      bidPrice3,
      bidVol1,
      bidVol2,
      bidVol3,
      lastPrice,
      totalVol,
      refPrice,
      unixTime,
      exchange,
      tradingDate,
      askPrice1,
      askPrice2,
      askPrice3,
      askVol1,
      askVol2,
      askVol3,
      bidPrice1,
      bidPrice2,
      bidPrice3,
      bidVol1,
      bidVol2,
      bidVol3,
      lastPrice,
      totalVol,
      refPrice,
      unixTime,
    ]);

    const endProcess = moment();
    console.info(
      `process_time: ${endProcess.diff(startProcess, 'milliseconds')}ms`
    );
  } catch (error) {
    if (isProducerConnected) {
      await producer.send({
        topic: KAFKA_TOPIC.RETRY_CODESES,
        messages: [
          {
            key: message.key,
            value: message.value,
          },
        ],
      });
    }
  }
};

export const SyncStockPriceBasicConsumer: IConsumer = {
  name: 'sync-stock-price-basic',
  fromBeginning: false,
  topicSubscribe: KAFKA_TOPIC.CODESE,
  groupId: 'operation-group:sync-stock-price-basic',
  processor,
};
