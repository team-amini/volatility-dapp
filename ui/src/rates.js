var timer;
var _onTick;
var lastRate = 10553;
var _instrument;

function start({onTick = () => {}, real = false, period = 10000, instrument='EURUSD'}) {
    _instrument = instrument;
    _onTick = onTick;
    timer = setInterval(real ? realTick : fakeTick, period);
}

function stop() {
    clearInterval(timer);
}

function fakeTick() {
    lastRate = generateRate();
    _onTick(lastRate)
}

function realTick() {
    fetch(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22${_instrument}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=`)
        .then((response) => response.json())
        .then((json) => {
            lastRate = Math.trunc(Number.parseFloat(json.query.results.rate.Rate) * 10000);
            _onTick(lastRate);
        });
}

function generateRate() {
    const percentChange = randomInt(0, 2);
    const direction = randomInt(0, 1);
    const change = lastRate * percentChange / 100;

    return Math.round(lastRate + (direction === 0 ? change : -change))
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default { start, stop };