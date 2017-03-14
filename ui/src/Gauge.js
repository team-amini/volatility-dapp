import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';
import service from './service';

export default class Gauge extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            volatility: service.getVolatility(this.props.instrument)
        });
    }

    render() {
        var gauge = {
            chart: {
                type: 'solidgauge',
                width: 150
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
                    [
                        0.0, '#55BF3B'
                    ], // green
                    [
                        0.25, '#DDDF0D'
                    ], // yellow
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
                max: 2
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
            series: [
                {
                    name: 'Volatility',
                    data: [this.state.volatility],
                    tooltip: {
                        valueSuffix: ' %'
                    }
                }
            ]
        };
        return (
            <ReactHighcharts config={gauge}></ReactHighcharts>
        )
    }

}