
const state = {
    lastRate: 10553
}
var timer;
var onTick;
var lastRate = 10553;

function start(onTick_) {
    const real = true;
    onTick = onTick_;
    timer = setInterval(real ? realTick : fakeTick, 10000);
}

function stop() {
    clearInterval(timer);
}

function fakeTick() {
    lastRate = generateRate();
    if (onTick) {
        onTick(lastRate)
    }
}

function realTick() {
    fetch('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22EURUSD%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=')
        .then((response) => response.json())
        .then((json) => {
            lastRate = Math.trunc(Number.parseFloat(json.query.results.rate.Rate) * 10000);
            if (onTick) {
                onTick(lastRate);
            }
        });
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

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default { start, stop };