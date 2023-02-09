import { stockList } from '../stock-socket-server/stocks';
import { codesePool, query } from '../src/configs/database.config';
import moment from 'moment';

const createTable = async () => {
  console.log('Starting create tables...');
  const startProcess = moment();
  for (var obj of stockList) {
    const sql = `CREATE TABLE if not exists marketDb.${obj.Code} (
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

    await query(codesePool, sql);
  }
  console.log('DONE');
  const endProcess = moment();
  console.info(
    `process_time: ${endProcess.diff(startProcess, 'milliseconds')}ms`
  );
};

createTable();
