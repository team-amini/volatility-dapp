import React, { Component } from 'react';
// import { Navbar, Jumbotron, Button } from 'react-bootstrap';

import service from './service'

import logo from './logo.svg';
import './App.css';

var now = Date.now();

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rates: []
        }
    }

    componentWillMount() {
        this.setState({
            rates: service.getRates()
        });
    }

    componentDidMount() {
        service.addListener((rates) => {
            this.setState({
                rates
            });            
        })
        service.start();
    }

    componentWillUnmount() {
        service.stop();
    }

    render() {
        var rows = [];
        this.state.rates.forEach((rate) => {
            rows.push(<RateRow ts={now} instrument="EUR/USD" rate={service.formatRate(rate)} key={now}/>);
            now += 1;
        });

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <div>
                    <RateTable rows={rows} />
                </div>
                <div>
                    <Volatility name={service.getVolatility()} />
                </div>
            </div>
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

class Volatility extends Component {
    render() {
        return (
            <p>Volatility is {this.props.name}%</p>
        )
    }
}
