import React, { Component } from "react";
import uuidv1 from "uuid/v1";
import update from "immutability-helper";
import "./App.css";

/**
 * Renders input based on received props
 */
class Input extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  onChange(e) {
    // call onChange from Cell component
    this.props.onChange(+e.target.value);
  }

  onKeyUp(e) {
    this.props.onKeyUp(e);
  }

  render() {
    return <input type={this.props.type} onKeyUp={this.onKeyUp} onInput={this.onChange} />;
  }
}

/**
 * Cell containing strong with text received from props
 * @type {Object}
 */
const SpanCell = ({ text, className, style }) => {
  return (
    <div className={className} style={style}>
      <span>{text}</span>
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
    if (this.props.onKeyUp) this.props.onKeyUp(e); // call only if is value cell
  }

  render() {
    const props = {
      id: this.state.id,
      onChange: this.onChange,
      type: this.props.type,
      onKeyUp: this.onKeyUp
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

    this.state = {
      id: this.props.id,
      value: 0,
      title: "",
      date: ""
    };

    this.onKeyUp = this.onKeyUp.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
  }

  // used on value cell
  onValueChange(value) {
    this.setState({ value }, () => {
      this.props.saveRow(this.state, "value", value);
    });
  }

  // used on title cell
  onTitleChange(title) {
    this.setState({ title }, () => {
      this.props.saveRow(this.state, "title", title);
    });
  }

  // used on date cell
  onDateChange(date) {
    this.setState({ date }, () => {
      this.props.saveRow(this.state, "date", date);
    });
  }

  // handles onKeyUp event
  // if shift is pressed on the value cell and it is the last row
  // add new ROW
  onKeyUp(e) {
    if (e.keyCode === 16 && this.props.lastRow) {
      e.preventDefault();
      this.props.addRow();
    }
  }

  deleteRow(index) {
    this.props.deleteRow(index);
  }

  render() {
    return (
      <div className="row datas">
        <div
          className="cell"
          style={{
            width: "15px",
            height: "40px",
            border: "none",
            lineHeight: "40px",
            paddingLeft: "5px"
          }}
        >
          <button className="delete-button" onClick={() => this.deleteRow(this.props.index)}>
            X
          </button>
        </div>
        <InputCell type="text" style={{ width: "180px" }} onChange={this.onDateChange} />
        <InputCell type="text" style={{ width: "180px" }} onChange={this.onTitleChange} />
        <InputCell
          type="number"
          style={{ width: "180px" }}
          onChange={this.onValueChange}
          onKeyUp={this.onKeyUp}
        />
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
      rows: [{ id: uuidv1(), date: "", title: "", value: 0 }],
      rowsCount: 1 // number of rows
    };

    this.saveRow = this.saveRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.addRow = this.addRow.bind(this);
    this.createRowObj = this.createRowObj.bind(this);
  }

  createRowObj() {
    let { rows } = this.state;
    let len = rows.length;

    return {
      id: uuidv1(),
      date: "",
      title: "",
      value: 0
    };
  }

  // adds new rows
  addRow() {
    let { rows } = this.state;

    this.setState({ rows: [...rows, this.createRowObj()] });
  }

  deleteRow(index) {
    // if there is only one row, DO NOT DELETE IT
    if (this.state.rows.length === 1) {
      return;
    }
    var newData = this.state.rows.slice(); //copy array
    newData.splice(index, 1); //remove element
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
    let rowIndex = data.findIndex(c => c.id == row.id); // searches for index

    let updatedRow = update(data[rowIndex], { [key]: { $set: value } }); // update index with new content

    // create new array with new content
    let newData = update(data, {
      $splice: [[rowIndex, 1, updatedRow]]
    });

    this.setState({ rows: newData });
  }

  render() {
    let { headerStyle } = this.props;
    let values = this.state.rows.map(x => x.value);
    let rowsLen = this.state.rows.length;

    let rows = this.state.rows.map((current, index) => (
      <Row
        key={current.id.toString()}
        id={current.id}
        saveRow={this.saveRow}
        deleteRow={this.deleteRow}
        index={index}
        lastRow={rowsLen - 1 === index} // checks if it is last row of grid
        addRow={this.addRow}
      />
    ));

    return (
      <div className="grid">
        <div className="main">
          <div className="row title">
            <section>
              <h1>{this.props.title}</h1>
            </section>
          </div>
          <div className="row headers">
            <SpanCell
              className={headerStyle}
              style={{
                width: "20px",
                background: "white"
              }}
            />
            <SpanCell
              text="Data"
              className={headerStyle}
              style={{ width: "180px", border: "#ccc 1px solid", fontSize: "22px" }}
            />
            <SpanCell
              text="Categoria"
              className={headerStyle}
              style={{ width: "180px", border: "#ccc 1px solid", fontSize: "22px" }}
            />
            <SpanCell
              text="Valor"
              className={headerStyle}
              style={{ width: "180px", border: "#ccc 1px solid", fontSize: "22px" }}
            />
          </div>
          <div>{rows}</div>
          <div className="row result">
            <div>
              <h3>Total: R$ {values.length > 0 ? values.reduce((x, y) => x + y) : 0}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Collection of Grids
 */
class App extends Component {
  render() {
    return (
      <div>
        <section>
          <Grid title="Receitas" headerStyle="positive" />
        </section>
        <section>
          <Grid title="Despesas" headerStyle="negative" />
        </section>
      </div>
    );
  }
}

export default App;