import React, { Component } from "react";
import "./App.css";

/////////////////////////////////////
class Input extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    // call onChange from Cell component
    this.props.onChange(+e.target.value);
  }

  render() {
    return <input type={this.props.type} onChange={this.onChange} />;
  }
}
/////////////////////////////////////
class Cell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    // save cell value inside component
    this.setState({ value });
    // call onChange from Row component
    this.props.onChange(value);
  }

  render() {
    const props = {
      id: this.state.id,
      onChange: this.onChange,
      type: this.props.type
    };

    return (
      <div className="cell">
        <Input {...props} />
      </div>
    );
  }
}

class Row extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id,
      value: 0,
      title: "",
      date: ""
    };

    this.onValueChange = this.onValueChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  // used on value cell
  onValueChange(value) {
    this.setState({ value }, () => {
      this.props.saveRow(this.state);
    });
  }

  // used on title cell
  onTitleChange(title) {
    this.setState({ title });
  }

  // used on date cell
  onDateChange(date) {
    this.setState({ date });
  }

  render() {
    return (
      <div className="row">
        <Cell type="date" onChange={this.onDateChange} />
        <Cell type="text" onChange={this.onTitleChange} />
        <Cell type="number" onChange={this.onValueChange} />
      </div>
    );
  }
}

class Grid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [],
      rowsCount: 1 // number of rows
    };

    this.saveRow = this.saveRow.bind(this);
    this.addRow = this.addRow.bind(this);
  }

// adds new rows
  addRow() {
    this.setState({ rowsCount: this.state.rowsCount + 1 });
  }

  /**
 * Checks if row content is already inside rows array.
 * If it is already there, exclude the row from the array
 * and updated it with new value
 * @param  {Object} row [Object containg Id, Date, Title and Value]
 * @return null
 */
  saveRow(row) {
    let { rows } = this.state;
    if (rows.filter(x => x.id === row.id).length > 0) {
      this.setState({ rows: [...rows.filter(x => x.id !== row.id), row] });
    } else {
      this.setState({ rows: [...rows, row] });
    }
  }

  render() {
    let values = this.state.rows.map(x => x.value);
    let rows = [];

    for (let i = 0; i < this.state.rowsCount; i++) {
      rows = [...rows, <Row id={i} saveRow={this.saveRow} />];
    }

    return (
      <div className="main">
        <div>
          {rows}
        </div>
        <h2>
          Total: R$ {values.length > 0 ? values.reduce((x, y) => x + y) : 0}
        </h2>
        <button onClick={this.addRow}>Add row</button>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <Grid />
        <Grid />
      </div>
    );
  }
}

export default App;
