const express = require('express');
const app = express();
const http = require('http');
const moment = require('moment');

const stockList = require('./stocks')

for (const stock of stockList) {
    stock.TotalVol = 0
}

const server = http.createServer(app);
const { Server } = require("socket.io");

function random(min = 0, max = 10000) {
    const ran = Math.floor(Math.random() * (max - min + 1)) + min;
    return ran;
}

const io = new Server(server, {
    cors: {
        origin: "*",
        allowedHeaders: ["*"],
        credentials: true
    }
});


io.on('connection', (socket) => {
    console.log('connect');
});

setInterval(() => {
    const ranSell = random(20000, 50000)
    const ranSellVol = random(1, 2000)
    const ranBuy = random(20000, 50000)
    const ranBuyVol = random(1, 2000)

    const buyOrSell = random(0, 1) // buy:0, sell:1
    const matchValue = random(1, 3)

    let randomStockIndex = random(0, stockList.length - 1)

    const randomStock = stockList[randomStockIndex]

    let lastPrice = 0

    let data = {
        code: randomStock.Code,
        exchange: randomStock.Exchange,
        tradingDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
        askPrice1: ranSell,
        askPrice2: ranSell + 100,
        askPrice3: ranSell + 200,
        askVol1: ranSellVol,
        askVol2: ranSellVol + 10,
        askVol3: ranSellVol + 20,
        bidPrice1: ranBuy,
        bidPrice2: ranBuy + 100,
        bidPrice3: ranBuy + 200,
        bidVol1: ranBuyVol,
        bidVol2: ranBuyVol + 10,
        bidVol3: ranBuyVol + 20
    }

    lastPrice = data[`${buyOrSell ? 'askPrice' : 'bidPrice'}${matchValue}`]

    data.lastPrice = lastPrice

    stockList[randomStockIndex].TotalVol += Number(data[`${buyOrSell ? 'askVol' : 'bidVol'}${matchValue}`])

    data.totalVol = stockList[randomStockIndex].TotalVol

    data.refPrice = random(20000,50000)

    io.emit('stockPrice', data)

}, 100)

server.listen(3000, () => {
    console.log('*:3000');
});