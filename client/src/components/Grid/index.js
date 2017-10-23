import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import uuidv1 from "uuid/v1";
import update from "immutability-helper";
import axios from "axios";

import SpanCell from "../SpanCell";
import Row from "../Row";

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
    this.renderResult = this.renderResult.bind(this);
  }

  async componentDidMount() {
    try {
      let entries = await axios.get(`/${this.props.collection}`);
      let len = entries.data.length;

      if (len > 0) {
        this.setState({ rows: entries.data });
      } else if (len === 0) {
        this.addRow();
      }
    } catch (e) {
      this.addRow();
    }
  }

  createRowObj() {
    let newRow = {}; // create new object
    let keys = this.props.inputCells;
    keys.map(x => (newRow[x] = " ")); // map over keys and create property in object

    // concat id and timestamp properties into newRow object
    return Object.assign(
      {
        id: uuidv1(),
        timestamp: new Date()
      },
      newRow
    );
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

  renderResult(key) {
    let values = this.state.rows.map(x => x[key]);
    let html =
      values.length > 0 && values ? (
        <div className="row result">
          <div>
            <span>
              Total: R$ {values.filter(x => Number.isInteger(x)).reduce((x, y) => x + y, 0)}
            </span>
          </div>
        </div>
      ) : null;

    return html;
  }

  render() {
    let { headerCells } = this.props;
    let { result } = this.props;
    let rowsLen = this.state.rows.length;

    let headers = headerCells.map((title, index) => {
      return (
        <SpanCell
          key={index}
          text={title}
          className="header"
          style={{ width: "180px", fontSize: "20px" }}
        />
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
              <sup>{this.props.title}</sup>
            </section>
          </div>
          <div className="row headers">
            {" "}
            <SpanCell
              className="header"
              style={{
                width: "20px",
                background: "white"
              }}
            />
            {headers}
          </div>
          <div>{rows}</div>
          {result ? this.renderResult(result) : null}
        </div>
      </div>
    );
  }
}

export default Grid;
