import moment from 'moment';
import { codesePool, query } from '../configs/database.config';
import { KAFKA_TOPIC } from '../constants/kafka.constant';
import { IConsumer } from '../interfaces/IConsumer.interface';

const processor = async ({ topic, partition, message }) => {
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
    } = data;
    const sqlCheckExist = `SELECT COUNT(*)
    FROM information_schema.tables 
    WHERE table_schema = DATABASE()
    AND table_name = "${code}";`;
    const isExistTable = await query(codesePool, sqlCheckExist);
    if (isExistTable == 0) {
      const sqlCreateTable = `CREATE TABLE if not exists marketDb.${code} (
        id INT NOT NULL AUTO_INCREMENT,
        code VARCHAR(45) NOT NULL,
        exchange VARCHAR(45) NULL,
        tradingDate VARCHAR(45) NULL,
        askPrice1 INT NULL,
        askPrice2 INT NULL,
        askPrice3 INT NULL,
        askVol1 INT NULL,
        askVol2 INT NULL,
        askVol3 INT NULL,
        bidPrice1 INT NULL,
        bidPrice2 INT NULL,
        bidPrice3 INT NULL,
        bidVol1 INT NULL,
        bidVol2 INT NULL,
        bidVol3 INT NULL,
        lastPrice INT NULL,
        totalVol INT NULL,
        refPrice INT NULL,
        PRIMARY KEY (id))`;
      await query(codesePool, sqlCreateTable);
    }
    const sql = `insert into ${code} (code, exchange, tradingDate, askPrice1, askPrice2, askPrice3, askVol1, askVol2, askVol3, bidPrice1, bidPrice2, bidPrice3, bidVol1, bidVol2, bidVol3, lastPrice, totalVol, refPrice) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) on duplicate key update code=?,exchange=?, tradingDate=?, askPrice1=?, askPrice2=?, askPrice3=?, askVol1=?, askVol2=?, askVol3=?, bidPrice1=?, bidPrice2=?, bidPrice3=?, bidVol1=?, bidVol2=?, bidVol3=?, lastPrice=?, totalVol=?, refPrice=?`;
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
    ]);

    const endProcess = moment();
    console.info(
      `process_time: ${endProcess.diff(startProcess, 'milliseconds')}ms`
    );
  } catch (error) {
    console.error(error);
  }
};

export const SyncStockPriceConsumer: IConsumer = {
  name: 'sync-stock-price',
  fromBeginning: false,
  topicSubscribe: KAFKA_TOPIC.CODESE,
  groupId: 'operation-group:sync-stock-price',
  processor,
};
