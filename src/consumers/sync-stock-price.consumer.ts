import moment from "moment";
import { codesePool, query } from "../configs/database.config";
import { KAFKA_TOPIC } from "../constants/kafka.constant";
import { IConsumer } from "../interfaces/IConsumer.interface";

const processor = async ({ topic, partition, message }) => {
    try {
        const startProcess = moment()

        const data = JSON.parse(message.value.toString())
        const { code, exchange, tradingDate, askPrice1, askVol1 } = data

        const sql = `insert into StockPrice (code,exchange,trading_date,askPrice1,askVol1) values (?,?,?,?,?) on duplicate key update exchange=?, trading_date=?, askPrice1=?, askVol1=?`
        await query(codesePool, sql, [code, exchange, tradingDate, askPrice1, askVol1, exchange, tradingDate, askPrice1, askVol1])

        const endProcess = moment()
        console.info(`process_time: ${endProcess.diff(startProcess, 'milliseconds')}ms`)
    } catch (error) {
        console.error(error)
    }
}

export const SyncStockPriceConsumer: IConsumer = {
    name: 'sync-stock-price',
    fromBeginning: false,
    topicSubscribe: KAFKA_TOPIC.CODESE,
    groupId: 'operation-group:sync-stock-price',
    processor
}