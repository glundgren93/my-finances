import React, { Component } from "react";
import uuidv1 from "uuid/v1";
import "./App.css";

/**
 * Renders input based on received props
 */
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

/**
 * Cell containing strong with text received from props
 * @type {Object}
 */
const StrongCell = ({ text, className, style }) => {
  return (
    <div className={className} style={style}>
      <strong>{text}</strong>
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

    this.onValueChange = this.onValueChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
  }
  componentWillMount() {
    this.setState({ id: this.props.id });
  }

  // used on value cell
  onValueChange(value) {
    this.setState({ value }, () => {
      this.props.saveRow(this.state);
    });
  }

  // used on title cell
  onTitleChange(title) {
    this.setState({ title }, () => {
      this.props.saveRow(this.state);
    });
  }

  // used on date cell
  onDateChange(date) {
    this.setState({ date }, () => {
      this.props.saveRow(this.state);
    });
  }

  deleteRow(row) {
    this.props.deleteRow(row);
  }

  render() {
    return (
      <div className="row datas">
        <button onClick={() => this.deleteRow(this.state.id)}>x</button>
        <StrongCell text={this.state.id} className="cell header" />
        <InputCell type="text" onChange={this.onDateChange} />
        <InputCell type="text" onChange={this.onTitleChange} />
        <InputCell type="number" onChange={this.onValueChange} />
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
    let len = rows.length;

    // this.setState({ rowsCount: this.state.rowsCount + 1 });
    this.setState({ rows: [...rows, this.createRowObj()] });
  }

  deleteRow(id) {
    let { rows } = this.state;
    this.setState({ rows: [...rows.filter(x => x.id !== id)] }, () => {
      this.forceUpdate();
    });
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
    let { headerStyle } = this.props;
    let values = this.state.rows.map(x => x.value);
    let rows = this.state.rows.map((current, index) => (
      <Row id={current.id} saveRow={this.saveRow} deleteRow={this.deleteRow} />
    ));

    return (
      <div className="grid">
        <div className="main">
          <div className="row title">
            <section>
              <h1>{this.props.title}</h1>
            </section>
            <section>
              <button onClick={this.addRow}>Add row</button>
            </section>
          </div>
          <div className="row headers">
            <StrongCell text="ID" className={headerStyle} />
            <StrongCell text="Data" className={headerStyle} />
            <StrongCell text="Categoria" className={headerStyle} />
            <StrongCell text="Valor" className={headerStyle} />
          </div>
          <div>{rows}</div>
          <div className="row result">
            <div className="cell">
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
          <Grid title="Receitas" headerStyle="cell positive" />
        </section>
        <section>
          <Grid title="Despesas" headerStyle="cell negative" />
        </section>
      </div>
    );
  }
}

export default App;
