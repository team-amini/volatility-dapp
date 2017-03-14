import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import service from './service';
//import rates from './rates';
import Rates2 from './Rates2';

export default class Chart extends Component {

    constructor(props) {
        super(props);
        this.rates = new Rates2();
        this.state = {
            rates: []
        }
    }

    getRates() {
        return this.state.rates;
    }

    componentWillMount() {
        console.log("component instrumnet prop " + this.props.instrument);
        this.setState({
            rates: service.getRates(this.props.instrument)
        });
    }

    componentDidMount() {
        this
            .rates
            .start({
                real: true,
                // onTick: (rate) => {     service.sendRate(rate,_instrument);
                // console.log(`Sending rate ${rate} for ${_instrument}...`)     this.setState({
                //         rates: service.getRates(_instrument)     }); },
                instrument: this.props.instrument,
                component: this
            });
    }

    componentWillUnmount() {
        this
            .rates
            .stop();
    }

    render() {
        var min = Math.min.apply(null,this.state.rates)-0.1;
        var max = Math.max.apply(null,this.state.rates)+0.1;

        var config = {
            title: {
                text: null
            },
            colors: ['#61dafb'],
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                floor: {min},
                ceiling: {max},
                minorTickInterval: 0.1,
                minorTickLength: 0,
                title: {
                    text: 'Exchange Rate'
                }
            },
            series: [
                {
                    data: this
                        .state
                        .rates
                        .map(row => [row.time, row.rate]),
                    type: 'line',
                    step: 'right',
                    name: this.props.instrument
                }
            ],
            credits: {
                enabled: false
            }
        };

        return (
            <ReactHighcharts config={config}></ReactHighcharts>
        )
    }
}