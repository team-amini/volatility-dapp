import client from './client'
import contract from './contract'

const precision = client.toDecimal(contract.precision());
const scalingFactor = client.toDecimal(contract.scalingfactor());
const instrument = 'eurusd'

var now = Date.now();

function sendRate(rate) {
    contract.sendRate(instrument, rate, { gas: 1000000000 });
}

function getRates() {
    const rates = contract.getRates.call(instrument);

    return rates.filter(rate => rate != 0).map((rate) => ({
        time: (now += 1),
        instrument: 'EUR/USD',
        rate: formatRate(rate)
    }));
}

function formatRate(rate) {
    return client.toDecimal(rate) / precision;
}

function getVolatility() {
    return client.toDecimal(contract.calcVolatility.call(instrument, { gas: 1000000000 })) / scalingFactor;
}

function getBalance() {
    return client.eth.getBalance(client.eth.accounts[0]).toNumber();
}

export default { sendRate, getRates, formatRate, getVolatility, getBalance };