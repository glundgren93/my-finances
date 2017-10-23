import React, { Component } from "react";

import InputCell from "../InputCell";

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
        this.props.handleFocus(
          index - 1,
          formattedId.length === 1 ? "0" + formattedId : formattedId
        );
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
          <i
            onClick={() => this.deleteRow(index)}
            className="material-icons delete-button no-select"
          >
            close
          </i>
        </div>
        {inputs}
      </div>
    );
  }
}

export default Row;
