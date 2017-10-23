import React, { Component } from "react";

import "./App.css";

import Grid from "../Grid";
import PieChart from "../PieChart";

/**
 * Collection of Grids
 */
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: 1
    };

    this.refreshChart = this.refreshChart.bind(this);
  }

  refreshChart() {
    this.setState({ key: Math.random() });
  }

  render() {
    let entryCells = ["Mês", "Categoria", "Valor"];
    let inputCells = ["date", "title", "value"];

    return (
      <div>
        <section>
          <Grid
            title="Receitas"
            headerCells={entryCells}
            inputCells={inputCells}
            collection="income"
            result="value"
          />
        </section>
        <section>
          <Grid
            title="Despesas"
            headerCells={entryCells}
            inputCells={inputCells}
            collection="expense"
            result="value"
          />
          <div className="chart">
            <i onClick={this.refreshChart} className="material-icons">
              refresh
            </i>
            <PieChart title="Despesas" key={this.state.key} />
          </div>
        </section>
      </div>
    );
  }
}

export default App;
