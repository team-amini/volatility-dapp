import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { Tabs, Tab } from 'react-bootstrap';

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
        
        function rateFormatter(cell, row){
            return cell.toFixed(5);
        }

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Volatility DApp</h2>
                </div>
                <div className="App-body">
                    <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                        <Tab eventKey={1} title="Chart">
                            <ReactHighcharts config = {config}></ReactHighcharts>
                        </Tab>
                        <Tab eventKey={2} title="Table">
                            <BootstrapTable data={this.state.rates} striped={true} hover={true} pagination search>
                                <TableHeaderColumn dataField="time" isKey={true} dataAlign="left" dataSort={true}>Time</TableHeaderColumn>
                                <TableHeaderColumn dataField="instrument" dataSort={true}>Instrument</TableHeaderColumn>
                                <TableHeaderColumn dataField="rate" dataFormat={rateFormatter}>Rate</TableHeaderColumn>
                            </BootstrapTable>                    
                        </Tab>
                    </Tabs>           
                    <div>
                        <Volatility name={service.getVolatility()} balance={service.getBalance()} />
                    </div> 
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
