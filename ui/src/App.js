import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { Col, Tabs, Tab } from 'react-bootstrap';
import Chart from './Chart';
import Gauge from './Gauge';


import service from './service'
import rates from './rates'

import logo from './logo.svg';
import './App.css';

HighchartsMore(ReactHighcharts.Highcharts);
HighchartsSolidGauge(ReactHighcharts.Highcharts)

export default class App extends Component {

    // constructor(props) {
    //     // super(props);
    //     // this.state = {
    //     //     rates: []
    //     // }
    // }

    componentWillMount() {
        // this.setState({
        //     rates: service.getRates()
        // });
    }

    componentDidMount() {
        // rates.start({real: true, onTick: (rate) =>  {
        //     service.sendRate(rate);
        //     console.log(`Sending rate ${rate}...`)
        //     this.setState({ rates: service.getRates() });
        // }});
    }

    componentWillUnmount() {
        // rates.stop();
    }

    render() {

        //TODO a hack. Need to lift state up so App component has rates from different charts
        var rates1 = service.getRates("EURUSD");
        var rates2 = service.getRates("USDCAD");
        var rates = rates1.concat(rates2);


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
                            <Col xs={6} md={4}>
                                <Chart instrument="USDCAD" ref="usdcad"></Chart>
                                
                            </Col>
                            <Col xs={6} md={2}> 
                                <Gauge instrument="USDCAD"></Gauge>
                            </Col>
                            <Col xs={6} md={4}>
                                <Chart instrument="EURUSD" ref="eurusd"></Chart>
                            </Col>
                            <Col xs={6} md={2}> 
                               <Gauge instrument="EURUSD"></Gauge>
                            </Col>
                            
                        </Tab>
                        <Tab eventKey={2} title="Table">
                            <BootstrapTable data={rates} striped={true} hover={true} pagination search>
                                <TableHeaderColumn dataField="time" isKey={true} dataAlign="left" dataSort={true}>Time</TableHeaderColumn>
                                <TableHeaderColumn dataField="instrument" dataSort={true}>Instrument</TableHeaderColumn>
                                <TableHeaderColumn dataField="rate" dataFormat={rateFormatter}>Rate</TableHeaderColumn>
                            </BootstrapTable>
                        </Tab>
                    </Tabs>   
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
