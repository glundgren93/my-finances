import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import uuidv1 from "uuid/v1";
import update from "immutability-helper";
import axios from "axios";
import ReactHighcharts from "react-highcharts";
import "./App.css";

/**
 * Renders input based on received props
 */
class Input extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  onChange(e) {
    // call onChange from Cell component
    this.props.onChange(e.target.value);
  }

  onKeyUp(e) {
    this.props.onKeyUp(e);
  }

  handleFocus(event) {
    event.target.select();
  }

  render() {
    let { value } = this.props;
    return (
      <input
        type={this.props.type}
        onKeyUp={this.onKeyUp}
        onFocus={this.handleFocus}
        onInput={this.onChange}
        defaultValue={value}
      />
    );
  }
}

/**
 * Cell containing strong with text received from props
 * @type {Object}
 */
const SpanCell = ({ text, className, style }) => {
  return (
    <div className={className} style={style}>
      <span>
        {text}
      </span>
    </div>
  );
};

/**
 * Cell containing input component
 */
class InputCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  onChange(value) {
    // save cell value inside component
    this.setState({ value });
    // call onChange from Row component
    this.props.onChange(value);
  }

  onKeyUp(e) {
    if (this.props.onKeyUp) this.props.onKeyUp(e, this.props.id); // call only if is value cell
  }

  render() {
    const props = {
      id: this.state.id,
      onChange: this.onChange,
      type: this.props.type,
      onKeyUp: this.onKeyUp,
      value: this.props.value
    };

    return (
      <div className="cell" style={this.props.style}>
        <Input {...props} />
      </div>
    );
  }
}

/**
 * Collection of Cells
 */
class Row extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, this.props.data);

    this.onKeyUp = this.onKeyUp.bind(this);
    this.onChange = this.onChange.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
  }

  onKeyUp(e, id) {
    let { index } = this.props;
    let formattedId;
    switch (e.keyCode) {
      case 38: // Up Arrow
        formattedId = (Number(id) - 10).toString();

        // if the id is in the first row, we must append the result to the "0" string
        this.props.handleFocus(index - 1, formattedId.length === 1 ? "0" + formattedId : formattedId);
        break;

      case 40: // Down arrow
        formattedId = (Number(id) + 10).toString();

        this.props.handleFocus(index + 1, formattedId);

        if (this.props.lastRow) {
          e.preventDefault();
          this.props.addRow();
        }
        break;
      default: // Do nothing
    }
  }

  deleteRow(index) {
    this.props.deleteRow(index, this.state.id);
  }

  /**
   * Dynamic onChange
   * @param  {String} property [Key used to update state]
   * @param  {[type]} value    [Value used to update key]
   */
  onChange = (property, value) => {
    let rowState = this.state; // clone state

    // update state with key and value from params
    // if property is value, we want to pass value as a number
    rowState[property] = property === "value" ? +value : value;
    this.setState({ rowState }, () => {
      this.props.saveRow(this.state, property, property === "value" ? +value : value);
    });
  };

  render() {
    let { index, data } = this.props;
    // filter id and timestamp, as we dont want to render them as inputs
    let keys = Object.keys(data).filter(x => x !== "id" && x !== "timestamp");

    // map over keys array in order to create inputs based on received props
    let inputs = keys.map((current, i) => {
      return (
        <InputCell
          type="text"
          style={{ width: "180px" }}
          value={data[current]}
          onKeyUp={this.onKeyUp}
          onChange={this.onChange.bind(this, current)}
          ref={"" + index + i}
          id={"" + index + i}
          key={"" + index + i}
        />
      );
    });

    return (
      <div className="row datas">
        <div
          className="cell"
          style={{
            width: "15px",
            height: "30px",
            border: "none",
            lineHeight: "30px",
            paddingLeft: "5px"
          }}
        >
          <i onClick={() => this.deleteRow(index)} className="material-icons delete-button no-select">
            close
          </i>
        </div>
        {inputs}
      </div>
    );
  }
}

/**
 * Collection of Rows
 */
class Grid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [],
      rowsCount: 1 // number of rows
    };

    this.saveRow = this.saveRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.addRow = this.addRow.bind(this);
    this.createRowObj = this.createRowObj.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  async componentDidMount() {
    let entries = await axios.get(`/${this.props.collection}`);
    let len = entries.data.length;

    if (len > 0) {
      this.setState({ rows: entries.data });
    } else if (len === 0) {
      this.addRow();
    }
  }

  createRowObj() {
    return {
      id: uuidv1(),
      date: "",
      title: "",
      value: 0,
      timestamp: new Date()
    };
  }

  // adds new rows
  addRow() {
    let { rows } = this.state;
    let entry = this.createRowObj();
    this.setState({ rows: [...rows, entry] }, () => {
      axios.post(`/${this.props.collection}`, entry);
    });
  }

  deleteRow(index, id) {
    // if there is only one row, DO NOT DELETE IT
    if (this.state.rows.length === 1) {
      return;
    }
    let newData = this.state.rows.slice(); //copy array
    newData.splice(index, 1); //remove element

    axios.delete(`/${this.props.collection}/${id}`);

    this.setState({ rows: newData }); //update state
  }

  /**
 * Checks if row content is already inside rows array.
 * If it is already there, exclude the row from the array
 * and updated it with new value
 * @param  {Object} row [Object containg Id, Date, Title and Value]
 * @return null
 */
  saveRow(row, key, value) {
    let data = this.state.rows; // get rows state
    let rowIndex = data.findIndex(c => c.id === row.id); // searches for index
    let updatedRow = update(data[rowIndex], { [key]: { $set: value } }); // update index with new content

    // create new array with new content
    let newData = update(data, {
      $splice: [[rowIndex, 1, updatedRow]]
    });

    this.setState({ rows: newData }, () => {
      axios.put(`/${this.props.collection}`, updatedRow);
    });
  }

  // https://stackoverflow.com/questions/27711018/cleaner-way-to-change-focus-on-child-components-in-react
  handleFocus(rowId, childId) {
    let child = this.refs["child" + rowId];
    if (!child) return;
    let input = child.refs[childId];
    let focusedInput = findDOMNode(input);
    if (!focusedInput) return;
    focusedInput.firstChild.focus();
  }

  render() {
    let { headerCells } = this.props;
    let values = this.state.rows.map(x => x.value);
    let rowsLen = this.state.rows.length;

    let headers = headerCells.map((title, index) => {
      return (
        <SpanCell key={index} text={title} className="header" style={{ width: "180px", fontSize: "20px" }} />
      );
    });

    let rows = this.state.rows.map((current, index) => {
      return (
        <Row
          key={current.id.toString()}
          id={current.id}
          saveRow={this.saveRow}
          deleteRow={this.deleteRow}
          index={index}
          lastRow={rowsLen - 1 === index} // checks if it is last row of grid
          addRow={this.addRow}
          title={current.title}
          date={current.date}
          value={current.value}
          data={current}
          ref={"child" + index}
          handleFocus={this.handleFocus}
        />
      );
    });

    return (
      <div className="grid">
        <div className="main">
          <div className="row title">
            <section>
              <sup>
                {this.props.title}
              </sup>
            </section>
          </div>
          <div className="row headers">
            {" "}<SpanCell
              className="header"
              style={{
                width: "20px",
                background: "white"
              }}
            />
            {headers}
          </div>
          <div>
            {rows}
          </div>
          <div className="row result">
            <div>
              <span>
                Total: R$ {values.length > 0 ? values.reduce((x, y) => x + y) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

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
      let chart = this.refs.chart.getChart();
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
    return chartData.length > 0
      ? <ReactHighcharts config={config} ref="chart" />
      : <b className="no-chart">¯ \ _ (ツ) _ / ¯</b>;
  }
}

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

    return (
      <div>
        <section>
          <Grid title="Receitas" headerCells={entryCells} collection="income" />
        </section>
        <section>
          <Grid title="Despesas" headerCells={entryCells} collection="expense" />
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
