import client from './client'
import contract from './contract'

var precision = client.toDecimal(contract.precision());
var scalingFactor = client.toDecimal(contract.scalingfactor());

const instrument = 'eurusd'
var now = Date.now();

function sendRate(rate) {
    contract.sendRate(instrument, rate, { gas: 1000000000 });
}

function getRates() {
    let rates = contract.getRates.call(instrument);

    console.log(rates)
    return rates.filter(rate => rate != 0.0).map((rate) => ({
        time: (now += 1),
        instrument: 'EUR/USD',
        rate: formatRate(rate)
    }));
}

function formatRate(rate) {
    return client.toDecimal(rate) / precision;
}

function getVolatility() {
    try {
        return client.toDecimal(contract.calcVolatility.call(instrument, { gas: 1000000000 })) / scalingFactor;
    } catch (e) {
        console.log(e);
        return 0.0;
    }
}

function getBalance() {
    return client.eth.getBalance(client.eth.accounts[0]).toNumber();
}

export default { sendRate, getRates, formatRate, getVolatility, getBalance };