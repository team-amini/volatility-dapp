import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';

var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var volatilityContractABI = [{"constant":true,"inputs":[],"name":"scalingfactor","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"index","type":"uint256"},{"name":"array","type":"uint256[30]"}],"name":"deleteElement","outputs":[{"name":"","type":"uint256[30]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"instrument","type":"string"},{"name":"rate","type":"uint256"}],"name":"sendRate","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"instrument","type":"string"}],"name":"getRates","outputs":[{"name":"","type":"uint256[30]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"precision","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"instrument","type":"string"}],"name":"clearRates","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"instrument","type":"string"}],"name":"calcVolatility","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"}];
var volatilityContractAddress = '0x3c4da8d2e550febab692253bfeb9a9cc0ab6d2e1';
ETHEREUM_CLIENT.eth.defaultAccount = '0x4712c59d0554a57ee49847f12cb2c7f909826a46';

var volatilityContract = ETHEREUM_CLIENT.eth.contract(volatilityContractABI).at(volatilityContractAddress);
var precision = ETHEREUM_CLIENT.toDecimal(volatilityContract.precision());
var scalingfactor = ETHEREUM_CLIENT.toDecimal(volatilityContract.scalingfactor());
var lastRate = 0;

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function calcVolatility() {
    var volatility = ETHEREUM_CLIENT.toDecimal(volatilityContract.calcVolatility.call("eurusd"))/scalingfactor;
    console.log("volatility is " + volatility + "%");
    return volatility;
}

class RateRow extends Component {
    render() {
        return (
            <tr>
        <td>{this.props.ts}</td>
        <td>{this.props.instrument}</td>
        <td>{this.props.rate}</td>
      </tr>
        );
    }
}

class RateTable extends Component {

    render() {
        return (
            <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Instrument</th>
              <th>Rate</th>
            </tr>
            </thead>
             <tbody>{this.props.rows}</tbody>
          </table>
        )
    }
}

class Volatility extends Component {
    render() {
        return (
            <p> Volatility is {this.props.name}% </p>
        )
    }
}

class App extends Component {


    constructor(props) {
        super(props);
        this.state = {
            rates: []
        }
    }

    componentWillMount() {
        volatilityContract.sendRate("eurusd", 10599);
        volatilityContract.sendRate("eurusd", 10475);
        volatilityContract.sendRate("eurusd", 10415);
        volatilityContract.sendRate("eurusd", 10553);
        lastRate = 10553;
        var data = volatilityContract.getRates.call("eurusd");
        this.setState({
            rates: data
        });
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            10000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        var percentchange = randomIntFromInterval(1, 5);
        var direction = randomIntFromInterval(0, 1);
        if (direction == 0) {
            lastRate = Math.round(lastRate + (lastRate * percentchange / 100));
        } else {
            lastRate = Math.round(lastRate - (lastRate * percentchange / 100));
        }
        console.log(lastRate + "(" + percentchange + "% change)");
        volatilityContract.sendRate("eurusd", lastRate);
        var data = volatilityContract.getRates.call("eurusd");
        this.setState({
            rates: data
        });
    }

    render() {
        var rows = [];
        var now = Date.now();
        this.state.rates.forEach((rate) => {
            rows.push(<RateRow ts={now} instrument="EUR/USD" rate={ETHEREUM_CLIENT.toDecimal(rate)/precision} key={now}/>);
            now = now + 1;
        })
        var volatility = calcVolatility();
        return (
            <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div>
            <RateTable rows={rows}/>
        </div>
        <div>
          <Volatility name={volatility} />
        </div>
      </div>
        );
    }
}

export default App;