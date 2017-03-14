
'use strict';
import service from './service';

export default class Rates2 {
    //timer;
    // _onTick;
    // //lastRate = 10553;
    // _instrument;
    // component;
    

    constructor() {
        this.lastRate = 10555;
    }

    start({
        //onTick = () => {},
        real = false,
        period = 10000,
        instrument = 'EURUSD',
        component
    }) {
        this._instrument = instrument;
        console.log("setting instrument to " + this._instrument);
        this.component = component;
        //this._onTick = onTick;
        if (real) {
            this.timer = setInterval(this.realTick.bind(this),period);
        }
        else {
            this.timer = setInterval(this.fakeTick.bind(this), period);
        }
        console.log("timer id " + this.timer);
        
        // this.timer = setInterval(real
        //     ? this.realTick
        //     : this.fakeTick, period);
    }

    _onTick = function(rate) {
        service.sendRate(rate,this._instrument);
        console.log(`Sending rate ${rate} for ${this._instrument}...`)
        console.log("timer id that triggered " + this.timer)
        this.component.setState({
            rates: service.getRates(this._instrument)
        });
    }

    stop() {
        clearInterval(this.timer);
    }

    generateRate() {
        const percentChange = this.randomInt(0, 2);
        const direction = this.randomInt(0, 1);
        const change = this.lastRate * percentChange / 100;

        return Math.round(this.lastRate + (direction === 0
            ? change
            : -change))
    }

    fakeTick() {
        this.lastRate = this.generateRate();
        console.log(this.lastRate);
        this._onTick(this.lastRate);
    }

    realTick() {
        fetch(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22${this._instrument}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=`).then((response) => response.json()).then((json) => {
            this.lastRate = Math.trunc(Number.parseFloat(json.query.results.rate.Rate) * 10000);
            this._onTick(this.lastRate);
        });
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

}