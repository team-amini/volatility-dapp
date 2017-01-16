import client from './client'
import contract from './contract'

var precision = client.toDecimal(contract.precision());
var scalingfactor = client.toDecimal(contract.scalingfactor());

const instrument = 'eurusd'
var lastRate = 0;
var timer;
var listener;
var now = Date.now();

// Seed with some rates
sendRate(10599);
sendRate(10475);
sendRate(10415);
sendRate(10553);

function getRates() {
    let rates = contract.getRates.call(instrument);

    return rates.map((rate) => ({
        time: (now += 1),
        instrument: 'EUR/USD',
        rate: formatRate(rate)
    }));
}

function sendRate(rate) {
    lastRate = rate;
    contract.sendRate(instrument, rate, { gas: 1000000000 });
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function formatRate(rate) {
    return client.toDecimal(rate) / precision;
}

function getVolatility() {
    return client.toDecimal(contract.calcVolatility.call(instrument, { gas: 1000000000 })) / scalingfactor;
}

function tick() {
    var rate = generateRate();
    sendRate(rate);

    if (listener) {
        listener(getRates());
    }
}

function generateRate() {
    var percentchange = randomInt(1, 5);
    var direction = randomInt(0, 1);

    if (direction === 0) {
        return Math.round(lastRate + (lastRate * percentchange / 100));
    } else {
        return Math.round(lastRate - (lastRate * percentchange / 100));
    }
}

function addListener(l) {
    listener = l;
}

function start() {
    timer = setInterval(tick, 10000);
}

function stop() {
    clearInterval(timer);
}

function getBalance() {
    return client.eth.getBalance(client.eth.accounts[0]).toNumber();
}

export default {
    formatRate,
    getRates,
    getVolatility,
    getBalance,
    addListener,
    start,
    stop
};