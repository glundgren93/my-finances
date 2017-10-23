import React, { Component } from "react";
import ReactHighcharts from "react-highcharts";
import axios from "axios";

class PieChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: []
    };
  }
  async componentWillMount() {
    let entries = await axios.get("/expense/chart");
    if (entries.data.length > 1) {
      let data = entries.data.map(x =>
        Object.assign({}, null, {
          name: x.group,
          y: x.reduction
        })
      );
      this.setState({ chartData: data });
    }
  }

  render() {
    let { chartData } = this.state;

    const config = {
      chart: {
        plotBackgroundColor: "transparent",
        plotBorderWidth: 1,
        plotShadow: false,
        type: "pie",
        height: "500",
        width: "564"
      },
      title: {
        text: this.props.title,
        style: {
          fontFamily: "'Titillium Web', sans-serif"
        }
      },
      credits: {
        enabled: false
      },
      tooltip: {
        pointFormat: "{series.name}: <b>R$ {point.y:.2f}</b>"
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.2f} %",
            style: {
              fontSize: "14px",
              fontFamily: "'Titillium Web', sans-serif"
            }
          },
          showInLegend: true
        }
      },
      series: [
        {
          name: "Gastos",
          colorByPoint: true,
          data: chartData
        }
      ]
    };
    return chartData.length > 0 ? (
      <ReactHighcharts config={config} ref="chart" />
    ) : (
      <b className="no-chart">¯ \ _ (ツ) _ / ¯</b>
    );
  }
}

export default PieChart;
