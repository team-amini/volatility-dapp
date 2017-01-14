import client from './client'
import contract from './contract'

var precision = client.toDecimal(contract.precision());
var scalingfactor = client.toDecimal(contract.scalingfactor());

var lastRate = 0;
var timer;
var listener;

sendRate(10599);
sendRate(10475);
sendRate(10415);
sendRate(10553);
lastRate = 10553;

function getRates() {
    return contract.getRates.call("eurusd");
}

function sendRate(rate) {
    contract.sendRate("eurusd", rate);
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function formatRate(rate) {
    return client.toDecimal(rate) / precision;
}

function getVolatility() {
    var volatility = client.toDecimal(contract.calcVolatility.call("eurusd")) / scalingfactor;
    console.log("volatility is " + volatility + "%");
    return volatility;
}

function tick() {
    var percentchange = randomIntFromInterval(1, 5);
    var direction = randomIntFromInterval(0, 1);
    if (direction === 0) {
        lastRate = Math.round(lastRate + (lastRate * percentchange / 100));
    } else {
        lastRate = Math.round(lastRate - (lastRate * percentchange / 100));
    }
    console.log(lastRate + "(" + percentchange + "% change)");
    sendRate(lastRate);

    if (listener) {
        listener(getRates());
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

export default {
    formatRate,
    getRates,
    getVolatility,
    addListener,
    start,
    stop
}