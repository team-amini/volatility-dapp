import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { Col, Tabs, Tab } from 'react-bootstrap';

import service from './service'
import rates from './rates'

import logo from './logo.svg';
import './App.css';

HighchartsMore(ReactHighcharts.Highcharts);
HighchartsSolidGauge(ReactHighcharts.Highcharts)

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
        rates.start({real: false, onTick: (rate) =>  {
            service.sendRate(rate);
            console.log(`Sending rate ${rate}...`)
            this.setState({ rates: service.getRates() });
        }});
    }

    componentWillUnmount() {
        rates.stop();
    }

    render() {
        var volatility = service.getVolatility();
        console.log(volatility);

        var config = {
            title: {
                text: null
            },
            colors: [
                '#61dafb'
            ],
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                floor: 0.5,
                ceiling: 1.5,
                minorTickInterval: 0.05,
                minorTickLength: 0,
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

        var gauge = {
            chart: {
                type: 'solidgauge',
                width: 300
            },
            title: null,

            pane: {
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
            yAxis: {
                stops: [
                    [0.0, '#55BF3B'], // green
                    [0.25, '#DDDF0D'], // yellow
                    [0.5, '#DF5353'] // red
                ],
                lineWidth: 0,
                minorTickInterval: null,
                tickAmount: 2,
                title: {
                    text: 'Volatility',
                    y: 20
                },
                min: 0,
                max: 20
            },
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            },
            series: [{
                name: 'Volatility',
                data: [volatility],
                tooltip: {
                    valueSuffix: ' %'
                }
            }]
        }

        function rateFormatter(cell, row) {
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
                            <Col xs={12} md={8}>
                                <ReactHighcharts config={config}></ReactHighcharts>
                            </Col>
                            <Col xs={6} md={4}>
                                <ReactHighcharts config={gauge}></ReactHighcharts>
                            </Col>
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
                        <Volatility name={volatility} balance={service.getBalance()} />
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
