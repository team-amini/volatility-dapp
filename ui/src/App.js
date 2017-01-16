import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

// import { Navbar, Jumbotron, Button } from 'react-bootstrap';

import service from './service'

import logo from './logo.svg';
import './App.css';

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
        var config = {
            title: {
                text: null
            },
            colors: [
                '#61dafb'
            ],
            xAxis:  {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Exchange Rate'
                }
            },            
            series: [{
                data: this.state.rates.map(row => [row.time, row.rate]),
                type: 'area',
                name: 'EUR/USD'
            }],
            credits: {
                enabled: false
            }
        };
        
        function priceFormatter(cell, row){
            return '<i class="glyphicon glyphicon-usd"></i> ' + cell;
        }

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Volatility DApp</h2>
                </div>
                <ReactHighcharts config = {config}></ReactHighcharts>
                <BootstrapTable data={this.state.rates} striped={true} hover={true} pagination search>
                    <TableHeaderColumn dataField="time" isKey={true} dataAlign="left" dataSort={true}>Time</TableHeaderColumn>
                    <TableHeaderColumn dataField="instrument" dataSort={true}>Instrument</TableHeaderColumn>
                    <TableHeaderColumn dataField="rate" dataFormat={priceFormatter}>Rate</TableHeaderColumn>
                </BootstrapTable>                
                <div>
                    <Volatility name={service.getVolatility()} balance={service.getBalance()} />
                </div>                
            </div>
        );
    }
}

class Volatility extends Component {
    render() {
        return (
            <div>
                <p>Volatility is {this.props.name}%</p>
                <p>Balance is {this.props.balance} wei</p>
            </div>
        )
    }
}
